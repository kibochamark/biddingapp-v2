"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { encodeBidAmountsMetadata } from "@/lib/stripe/bid-metadata";

const stripeKey = process.env.STRIPE_SECRET_KEY;

interface CreateBidCheckoutParams {
  productId: string;
  productTitle: string;
  biddingFee: number;
  // One bid amount per entry — e.g. 5 entries means 5 distinct amounts, not
  // the same amount charged 5 times. The entry fee is what's paid now; each
  // bidAmount is only charged later if that specific entry wins.
  bidAmounts: number[];
  bidderId: string;
  bidderName: string;
  bidderEmail: string;
}

export async function createBidCheckoutAction(params: CreateBidCheckoutParams) {
  const {
    productId,
    productTitle,
    biddingFee,
    bidAmounts,
    bidderId,
    bidderName,
    bidderEmail,
  } = params;

  const numberOfBids = bidAmounts.length;

  console.log("Creating bid checkout:", { productId, numberOfBids, bidderId });

  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY is missing from your .env.local file");
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2025-12-15.clover",
  });

  const totalAmount = biddingFee * numberOfBids;

  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${numberOfBids}x Bid ${numberOfBids > 1 ? "Entries" : "Entry"}: ${productTitle}`,
              description: `${numberOfBids} auction ${numberOfBids > 1 ? "entries" : "entry"} for ${productTitle} (${biddingFee.toFixed(2)} USD each)`,
              images: [], // You can add product image URLs here if needed
            },
            unit_amount: Math.round(biddingFee * 100), // Convert to cents
          },
          quantity: numberOfBids,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${productId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${productId}/bid?payment=cancelled`,
      metadata: {
        type: "bid_entry",
        productId,
        bidderId,
        bidderName,
        bidderEmail,
        numberOfBids: numberOfBids.toString(),
        biddingFee: biddingFee.toString(),
        totalAmount: totalAmount.toString(),
        ...encodeBidAmountsMetadata(bidAmounts),
      },
      customer_email: bidderEmail,
      // Optional: Add customer creation
      // customer: customerId, // If you have existing Stripe customers
    });

    console.log("Stripe session created:", session.id);

    // Redirect to Stripe Checkout
    if (session.url) {
      redirect(session.url);
    } else {
      throw new Error("Failed to create checkout session URL");
    }
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    throw new Error(error.message || "Failed to create checkout session");
  }
}
