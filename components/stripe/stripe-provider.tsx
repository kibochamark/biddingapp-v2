"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { ReactNode } from "react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!
);

interface StripeProviderProps {
  children: ReactNode;
  clientSecret: string;
}

export default function StripeProvider({
  children,
  clientSecret,
}: StripeProviderProps) {
  const appearance: Appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#f97316",
      colorBackground: "#ffffff",
      colorText: "#1f2937",
      colorDanger: "#ef4444",
      fontFamily: "system-ui, sans-serif",
      borderRadius: "8px",
      spacingUnit: "4px",
    },
    rules: {
      ".Input": {
        border: "2px solid #e5e7eb",
        boxShadow: "none",
        padding: "12px",
      },
      ".Input:focus": {
        border: "2px solid #f97316",
        boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.2)",
      },
      ".Label": {
        fontWeight: "500",
        marginBottom: "8px",
      },
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
