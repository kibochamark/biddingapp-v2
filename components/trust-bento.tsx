import { Shield, Truck, BadgeCheck, HeadphonesIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Verified Listings",
    description: "Every product inspected and condition-rated before it goes live.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Entry fees and checkout are processed through Stripe and PayPal.",
  },
  {
    icon: Truck,
    title: "Insured Shipping",
    description: "Tracked delivery on every auction you win.",
  },
  {
    icon: HeadphonesIcon,
    title: "Real Support",
    description: "A team that answers when a bid or a shipment needs help.",
  },
];

// Flat trust strip + a single dark CTA banner — no gradients, no glow, no
// invented engagement metrics; every claim here is a real platform capability.
export default function TrustBento() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline">
        {trustPoints.map(({ icon: Icon, title, description }) => (
          <div key={title} className="bg-background p-6 space-y-3">
            <Icon className="h-5 w-5 text-ink" />
            <h3 className="font-medium text-ink">{title}</h3>
            <p className="text-sm text-mute">{description}</p>
          </div>
        ))}
      </div>

      <div className="bg-ink p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold text-background mb-1">
            Ready to win for less?
          </h3>
          <p className="text-background/70 text-sm">
            Place your first bid and see how far a fraction of retail can go.
          </p>
        </div>
        <Link
          href="/catalog?sortBy=ending_soon"
          className="shrink-0 inline-flex items-center gap-2 h-12 px-8 bg-background text-ink rounded-full font-medium hover:bg-soft-cloud active:scale-95 transition-[transform,background-color]"
        >
          Browse Auctions
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

// Skeleton for loading state
export function TrustBentoSkeleton() {
  return (
    <div className="space-y-12 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-hairline">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-background p-6 space-y-3">
            <div className="h-5 w-5 bg-soft-cloud" />
            <div className="h-4 w-24 bg-soft-cloud" />
            <div className="h-3 w-full bg-soft-cloud" />
          </div>
        ))}
      </div>
      <div className="bg-soft-cloud h-32" />
    </div>
  );
}
