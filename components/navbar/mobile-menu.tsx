"use client";

import {
  Menu,
  Clock,
  TrendingUp,
  User,
  X,
  Package,
  Gavel,
  UserCircle,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  isAuthenticated: boolean;
  user?: {
    picture?: string | null;
    given_name?: string | null;
    email?: string | null;
  } | null;
}

export function MobileMenu({ isAuthenticated, user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150] lg:hidden"
              onClick={close}
            />

            {/* Drawer — slides in from the right, full height */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="fixed top-0 right-0 h-full w-72 sm:w-80 bg-card border-l border-border shadow-2xl z-[160] flex flex-col lg:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-linear-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-base text-foreground">BidMarket</span>
                </div>
                <button
                  onClick={close}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto p-4">

                {/* Explore section */}
                <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Explore
                </p>
                <div className="space-y-1 mb-5">
                  <Link
                    href="/catalog"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    onClick={close}
                  >
                    <Package className="h-5 w-5 shrink-0" />
                    <span>Browse Auctions</span>
                  </Link>
                  <Link
                    href="/catalog?filter=ending-soon"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    onClick={close}
                  >
                    <Clock className="h-5 w-5 shrink-0" />
                    <span>Ending Soon</span>
                  </Link>
                  <Link
                    href="/catalog?filter=trending"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    onClick={close}
                  >
                    <TrendingUp className="h-5 w-5 shrink-0" />
                    <span>Trending</span>
                  </Link>
                </div>

                {/* Account section */}
                <div className="border-t border-border pt-4">
                  {isAuthenticated ? (
                    <>
                      <p className="px-1 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Account
                      </p>

                      {/* User info card */}
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
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          onClick={close}
                        >
                          <UserCircle className="h-5 w-5 shrink-0" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/profile/bids"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          onClick={close}
                        >
                          <Gavel className="h-5 w-5 shrink-0" />
                          <span>My Bids</span>
                        </Link>
                        <Link
                          href="/profile/listings"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          onClick={close}
                        >
                          <ShoppingBag className="h-5 w-5 shrink-0" />
                          <span>My Listings</span>
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <LoginLink className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-linear-to-r from-primary to-orange-600 text-white rounded-lg hover:from-primary/90 hover:to-orange-600/90 text-sm font-medium transition-all shadow-md">
                        <User className="h-4 w-4" />
                        <span>Sign In</span>
                      </LoginLink>
                      <p className="text-xs text-center text-muted-foreground">
                        Sign in to place bids and manage your account
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sign Out — pinned to the bottom */}
              {isAuthenticated && (
                <div className="px-4 py-4 border-t border-border shrink-0">
                  <LogoutLink className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 text-sm font-medium transition-all">
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </LogoutLink>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
