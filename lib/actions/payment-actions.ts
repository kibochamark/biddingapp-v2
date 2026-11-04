"use server";

import Stripe from "stripe";
import { encodeBidAmountsMetadata } from "@/lib/stripe/bid-metadata";

// TODO: Implement this server action with your Stripe backend
// This is a stub - you need to add your Stripe secret key and implement the PaymentIntent creation

interface CreatePaymentIntentParams {
  productId: string;
  productTitle: string;
  biddingFee: number;
  // One bid amount per entry — e.g. 5 entries means 5 distinct amounts, not
  // the same amount charged 5 times. The entry fee (below) is what's actually
  // paid now; each bidAmount is only charged later if that specific entry wins.
  bidAmounts: number[];
  bidderId: string;
  bidderName: string;
  bidderEmail: string;
  auctionId:string;
  // Generated once per form-submission attempt on the client (see
  // bid-payment-modal.tsx) and reused for every retry of that same attempt.
  // Without this, a double-click or a retried request creates a second,
  // fully separate PaymentIntent — Stripe has no way to know it's the same
  // logical request — which is how a single bid ends up charged twice.
  idempotencyKey: string;
}

interface PaymentIntentResult {
  clientSecret?: string;
  error?: string;
}

export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentIntentResult> {
  try {
    // TODO: Uncomment and configure with your Stripe secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const numberOfBids = params.bidAmounts.length;
    const totalAmount = numberOfBids * params.biddingFee;

    // TODO: Replace this with actual Stripe PaymentIntent creation
    // Example implementation:

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        productId: params.productId,
        productTitle: params.productTitle,
        bidderId: params.bidderId,
        bidderName: params.bidderName,
        bidderEmail: params.bidderEmail,
        numberOfBids: numberOfBids.toString(),
        entryFee: params.biddingFee.toString(),
        totalPaid: Math.round(totalAmount),
        auctionId: params.auctionId,
        ...encodeBidAmountsMetadata(params.bidAmounts),
      },
      receipt_email: params.bidderEmail,
      description: `Bid entry for ${params.productTitle} - ${numberOfBids} entries @ ${params.biddingFee.toFixed(2)} USD each`,
    }, {
      idempotencyKey: params.idempotencyKey,
    });

    return { clientSecret: paymentIntent.client_secret! };
  
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return {
      error: error.message || "Failed to create payment intent",
    };
  }
}
