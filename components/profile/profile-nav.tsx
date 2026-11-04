"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Gavel, ChevronRight } from "lucide-react";

const tabs = [
  {
    href: "/profile",
    label: "Profile",
    description: "Personal info",
    icon: User,
  },
  {
    href: "/profile/addresses",
    label: "Addresses",
    description: "Shipping details",
    icon: MapPin,
  },
  {
    href: "/profile/bids",
    label: "My Bids",
    description: "Bid history",
    icon: Gavel,
  },
];

export default function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`group flex items-center gap-3 px-4 py-3 rounded-full transition-colors whitespace-nowrap ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-soft-cloud text-ink"
            }`}
          >
            <div
              className={`p-2 rounded-full ${
                isActive
                  ? "bg-primary-foreground/20"
                  : "bg-soft-cloud group-hover:bg-background"
              }`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium leading-tight">
                {tab.label}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  isActive
                    ? "text-primary-foreground/70"
                    : "text-mute"
                }`}
              >
                {tab.description}
              </p>
            </div>
            <span className="lg:block hidden ml-auto">
              <ChevronRight
                className={`h-4 w-4 ${
                  isActive
                    ? "text-primary-foreground/50"
                    : "text-mute/60 group-hover:text-mute"
                }`}
              />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
