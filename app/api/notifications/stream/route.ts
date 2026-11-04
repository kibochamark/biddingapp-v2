import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createSubscriber } from "@/lib/redis";

export const dynamic = "force-dynamic";

// The backend publishes payment-settlement events to this per-user channel
// once it finishes processing a Stripe payment (its own webhook, not one in
// this repo). This route's only job is to relay that channel to the browser.
const encoder = new TextEncoder();

export async function GET(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const paymentChannel = `payment:${user.id}`;
  const subscriber = createSubscriber();

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: string) => {
        try {
          controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
        } catch {
          // Controller already closed (client disconnected) — ignore.
        }
      };

      // Send initial connection event
      send(JSON.stringify({ type: "connected" }));

      // Subscribe to this user's payment channel
      subscriber.subscribe(paymentChannel, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${paymentChannel}:`, err);
          send(JSON.stringify({ type: "error", message: "Subscription failed" }));
          controller.close();
        }
      });

      // Stream messages from Redis to the client
      subscriber.on("message", (_channel: string, message: string) => {
        send(message);
      });

      // Heartbeat every 30s to keep the connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch {
          clearInterval(heartbeat);
        }
      }, 30_000);

      // Clean up when client disconnects
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        subscriber.unsubscribe(paymentChannel);
        subscriber.quit();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
