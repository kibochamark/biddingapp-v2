import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { getPublisher } from "@/lib/redis";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const productId = paymentIntent.metadata?.productId;
  const bidderId = paymentIntent.metadata?.bidderId;

  switch (event.type) {
    case "payment_intent.succeeded":
      console.log(
        `Payment succeeded for PaymentIntent ${paymentIntent.id}`,
        productId ? `(product: ${productId})` : ""
      );

      if (productId) {
        revalidatePath(`/product/${productId}`);
      }

      // Publish real-time notification to the bidder via Redis
      if (bidderId) {
        const publisher = getPublisher();
        await publisher.publish(
          `payment:${bidderId}`,
          JSON.stringify({
            type: "payment_success",
            productId,
            productTitle: paymentIntent.metadata?.productTitle || "Auction item",
          })
        );
      }
      break;

    case "payment_intent.payment_failed":
      const failureMessage =
        paymentIntent.last_payment_error?.message ?? "Unknown error";

      console.error(
        `Payment failed for PaymentIntent ${paymentIntent.id}: ${failureMessage}`,
        productId ? `(product: ${productId})` : ""
      );

      if (productId) {
        revalidatePath(`/product/${productId}`);
      }

      // Publish failure notification to the bidder via Redis
      if (bidderId) {
        const publisher = getPublisher();
        await publisher.publish(
          `payment:${bidderId}`,
          JSON.stringify({
            type: "payment_failed",
            productId,
            productTitle: paymentIntent.metadata?.productTitle || "Auction item",
            message: failureMessage,
          })
        );
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
