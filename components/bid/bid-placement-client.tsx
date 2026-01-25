"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import BidPlacementForm from "./bid-placement-form";
import {
  Gavel,
  Clock,
  ShieldCheck,
  TrendingUp,
  Info,
  AlertCircle,
  CheckCircle2,
  Package,
} from "lucide-react";
import { formatPrice, formatTimeRemaining, formatDateTime } from "@/lib/format";

interface BidPlacementClientProps {
  product: Product;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function BidPlacementClient({ product, user }: BidPlacementClientProps) {
  const [step, setStep] = useState<"form" | "payment" | "success">("form");

  const biddingFee = product.entryFee || 5;
  const totalBids = product.auctions?.length > 0 ? product.auctions[0]?.totalBidsCount : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Product Summary (Sticky) */}
      <div className="lg:col-span-1">
        <div className="sticky top-20 space-y-4">
          {/* Product Card */}
          <div className="glass-card rounded-xl overflow-hidden border border-border">
            <div className="relative h-48 bg-muted">
              {product.images[0] && (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-4">
              <h2 className="font-bold text-lg mb-2 line-clamp-2">{product.title}</h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Entry Fee</span>
                  <span className="font-bold text-primary text-lg">
                    {formatPrice(biddingFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Entries</span>
                  <span className="font-semibold">{totalBids}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Original Price</span>
                  <span className="font-semibold">
                    {formatPrice(product.retailValue || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Time Remaining */}
          <div className="glass-card p-4 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Time Remaining
              </span>
            </div>
            <p className="text-xl font-bold text-primary">
              {formatTimeRemaining(new Date(product.endDate))}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Ends {formatDateTime(new Date(product.endDate))}
            </p>
          </div>

          {/* Security Badge */}
          <div className="glass-card p-4 rounded-lg border border-border bg-green-50/50 dark:bg-green-900/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-sm">Secure Payment</p>
                <p className="text-xs text-muted-foreground">
                  SSL Encrypted & PCI Compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Bid Form and Information */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Place Your Bid</h1>
          <p className="text-muted-foreground">
            Complete your entry to join the auction
          </p>
        </div>

        {/* How It Works */}
        <div className="glass-card p-6 rounded-xl border border-border space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">How It Works</h3>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <p className="font-semibold">Pay Entry Fee</p>
                <p className="text-sm text-muted-foreground">
                  Each bid costs {formatPrice(biddingFee)} and counts as one entry
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <p className="font-semibold">Enter the Auction</p>
                <p className="text-sm text-muted-foreground">
                  Your entry is confirmed instantly after payment
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <p className="font-semibold">Increase Your Chances</p>
                <p className="text-sm text-muted-foreground">
                  Place multiple bids to increase your odds of winning
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                4
              </div>
              <div>
                <p className="font-semibold">Winner Selected</p>
                <p className="text-sm text-muted-foreground">
                  A random winner is chosen when the auction ends
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="glass-card p-6 rounded-xl border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Bidding Tips</h3>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span>
                More bids = higher chances. Consider placing multiple entries
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span>
                Entry fee is non-refundable, but winning gets you the product at a huge discount
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <span>
                Bid early to secure your spot before the auction closes
              </span>
            </li>
          </ul>
        </div>

        {/* Important Notice */}
        <div className="glass-card p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                Important Notice
              </p>
              <p className="text-yellow-800 dark:text-yellow-300">
                By placing a bid, you agree to our terms of service. Entry fees are non-refundable.
                Winners will be contacted via email within 24 hours of auction close.
              </p>
            </div>
          </div>
        </div>

        {/* Bid Form */}
        <div className="glass-card p-6 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-6">
            <Gavel className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-xl">Confirm Your Entry</h3>
          </div>
          <BidPlacementForm
            productId={product.id}
            productTitle={product.title}
            biddingFee={biddingFee}
            user={user}
          />
        </div>
      </div>
    </div>
  );
}
