"use client";

import { User, LogOut, TrendingUp, Package } from "lucide-react";
import { useState } from "react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";

interface UserMenuProps {
  user: {
    picture?: string | null;
    given_name?: string | null;
    family_name?: string | null;
    email?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="hidden md:flex items-center gap-2 relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-accent rounded-full transition-colors"
      >
        {user?.picture ? (
          <img
            src={user.picture}
            alt={user.given_name || "User"}
            className="w-8 h-8 rounded-full border-2 border-border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        <span className="text-sm font-medium text-foreground hidden lg:block">
          {user?.given_name || "Account"}
        </span>
      </button>

      {/* User Dropdown Menu */}
      {showUserMenu && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowUserMenu(false)}
          />
          <div className="absolute top-12 right-0 w-56 bg-card rounded-xl shadow-lg border border-border py-2 z-50">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-card-foreground">
                {user?.given_name} {user?.family_name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
            </div>
            <Link
              href="/profile"
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors text-foreground"
              onClick={() => setShowUserMenu(false)}
            >
              <User className="h-4 w-4 text-muted-foreground" />
              My Profile
            </Link>
            <Link
              href="/profile?tab=bids"
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors text-foreground"
              onClick={() => setShowUserMenu(false)}
            >
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              My Bids
            </Link>
            <Link
              href="/profile?tab=listings"
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-accent transition-colors text-foreground"
              onClick={() => setShowUserMenu(false)}
            >
              <Package className="h-4 w-4 text-muted-foreground" />
              My Listings
            </Link>
            <hr className="my-2 border-border" />
            <LogoutLink className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-destructive/10 transition-colors text-destructive">
              <LogOut className="h-4 w-4" />
              Sign Out
            </LogoutLink>
          </div>
        </>
      )}
    </div>
  );
}
