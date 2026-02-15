import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createSubscriber } from "@/lib/redis";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const channel = `payment:${user.id}`;
  const subscriber = createSubscriber();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      controller.enqueue(`data: ${JSON.stringify({ type: "connected" })}\n\n`);

      // Subscribe to the user's payment channel
      subscriber.subscribe(channel, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${channel}:`, err);
          controller.close();
        }
      });

      // Stream messages from Redis to the client
      subscriber.on("message", (_channel: string, message: string) => {
        controller.enqueue(`data: ${message}\n\n`);
      });

      // Heartbeat every 30s to keep the connection alive
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(`: heartbeat\n\n`);
        } catch {
          clearInterval(heartbeat);
        }
      }, 30_000);

      // Clean up when client disconnects
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        subscriber.unsubscribe(channel);
        subscriber.quit();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
