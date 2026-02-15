"use server";

import Stripe from "stripe";

// TODO: Implement this server action with your Stripe backend
// This is a stub - you need to add your Stripe secret key and implement the PaymentIntent creation

interface CreatePaymentIntentParams {
  productId: string;
  productTitle: string;
  biddingFee: number;
  bidAmount: number;
  numberOfBids: number;
  bidderId: string;
  bidderName: string;
  bidderEmail: string;
  auctionId:string;
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

    const totalAmount = params.numberOfBids * params.biddingFee;

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
        bidAmount: params.bidAmount.toString(),
        numberOfBids: params.numberOfBids.toString(),
        entryFee: params.biddingFee.toString(),
        totalPaid: Math.round(totalAmount),
        auctionId:params.auctionId
      },
      receipt_email: params.bidderEmail,
      description: `Bid entry for ${params.productTitle} - ${params.numberOfBids} entries @ ${params.biddingFee.toFixed(2)} USD each`,
    });

    return { clientSecret: paymentIntent.client_secret! };
  
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return {
      error: error.message || "Failed to create payment intent",
    };
  }
}
