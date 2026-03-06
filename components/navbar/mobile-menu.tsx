"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  Clock,
  TrendingUp,
  User,
  Package,
  Gavel,
  UserCircle,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const WELCOME_KEY = "bidmarket_welcome_sheet";

interface MobileMenuProps {
  isAuthenticated: boolean;
  user?: {
    picture?: string | null;
    given_name?: string | null;
    email?: string | null;
  } | null;
}

export function MobileMenu({ isAuthenticated, user }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  // Auto-open on mobile the first time the user lands after logging in
  useEffect(() => {
    if (!isAuthenticated) return;
    const isMobile = window.innerWidth < 1024; // lg breakpoint matches navbar
    const alreadyShown = sessionStorage.getItem(WELCOME_KEY);
    if (isMobile && !alreadyShown) {
      setOpen(true);
      sessionStorage.setItem(WELCOME_KEY, "1");
    }
  }, [isAuthenticated]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Hamburger trigger */}
      <SheetTrigger asChild>
        <button
          className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-foreground" />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-72 sm:w-80 p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-linear-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4 text-white" />
            </div>
            <SheetTitle className="text-base font-bold">BidMarket</SheetTitle>
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Explore */}
          <div>
            <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Explore
            </p>
            <div className="space-y-1">
              <SheetClose asChild>
                <Link
                  href="/catalog"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                  <Package className="h-5 w-5 shrink-0" />
                  <span>Browse Auctions</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/catalog?filter=ending-soon"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                  <Clock className="h-5 w-5 shrink-0" />
                  <span>Ending Soon</span>
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  href="/catalog?filter=trending"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                >
                  <TrendingUp className="h-5 w-5 shrink-0" />
                  <span>Trending</span>
                </Link>
              </SheetClose>
            </div>
          </div>

          {/* Account */}
          <div className="border-t border-border pt-5">
            {isAuthenticated ? (
              <>
                <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </p>

                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-lg mb-3">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.given_name || "User"}
                      className="w-10 h-10 rounded-full border-2 border-primary/20 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {user?.given_name || "Account"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <SheetClose asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      <UserCircle className="h-5 w-5 shrink-0" />
                      <span>My Profile</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/profile/bids"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      <Gavel className="h-5 w-5 shrink-0" />
                      <span>My Bids</span>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/profile/listings"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    >
                      <ShoppingBag className="h-5 w-5 shrink-0" />
                      <span>My Listings</span>
                    </Link>
                  </SheetClose>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <SheetClose asChild>
                  <LoginLink className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-linear-to-r from-primary to-orange-600 text-white rounded-lg hover:from-primary/90 hover:to-orange-600/90 text-sm font-medium transition-all shadow-md">
                    <User className="h-4 w-4" />
                    <span>Sign In</span>
                  </LoginLink>
                </SheetClose>
                <p className="text-xs text-center text-muted-foreground">
                  Sign in to place bids and manage your account
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sign Out pinned to bottom via SheetFooter */}
        {isAuthenticated && (
          <SheetFooter className="border-t border-border p-4">
            <LogoutLink className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 text-sm font-medium transition-all">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </LogoutLink>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
