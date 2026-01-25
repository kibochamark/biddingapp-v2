"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  MapPin,
  ShieldCheck,
  Package,
  Gavel,
} from "lucide-react";

const tabs = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/profile/addresses", label: "Addresses", icon: MapPin },
  { href: "/profile/bids", label: "My Bids", icon: Gavel },
];

export default function ProfileNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
