"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";


const stripeKey = process.env.STRIPE_SECRET_KEY;

export async function createBidCheckout(
  productId: string, 
  productTitle: string, 
  biddingFee: number
) {

  console.log("Checking Stripe Key starts with:", stripeKey?.slice(0, 7));

  if (!stripeKey) {
    throw new Error("STRIPE_SECRET_KEY is missing from your .env.local file");
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2025-12-15.clover", 
  });


  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Bid Entry: ${productTitle}`,
            description: `One auction entry fee for ${productTitle}`,
          },
          unit_amount: Math.round(biddingFee * 100), 
        },
        quantity: 1,
      },
    ],
    mode: "payment",

    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${productId}?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${productId}?payment=cancelled`,
    metadata: {
      productId: productId,
    },
  });

  
  if (session.url) {
    redirect(session.url);
  }
}