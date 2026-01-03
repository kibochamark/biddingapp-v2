"use client";

import { Menu, Clock, TrendingUp, User } from "lucide-react";
import { useState } from "react";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";

interface MobileMenuProps {
  isAuthenticated: boolean;
  user?: {
    picture?: string | null;
    given_name?: string | null;
    email?: string | null;
  } | null;
}

export function MobileMenu({ isAuthenticated, user }: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed inset-y-0 right-0 w-64 bg-card shadow-xl z-50 md:hidden overflow-y-auto">
            <div className="p-4 space-y-3">
              {/* Close button */}
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <Menu className="h-5 w-5 text-foreground" />
                </button>
              </div>

              <Link
                href="/catalog"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse Auctions
              </Link>
              <Link
                href="/catalog?filter=ending-soon"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Clock className="h-4 w-4" />
                Ending Soon
              </Link>
              <Link
                href="/catalog?filter=trending"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TrendingUp className="h-4 w-4" />
                Trending
              </Link>

              {isAuthenticated ? (
                <>
                  <hr className="my-2 border-border" />
                  <div className="flex items-center gap-2 px-2 py-1">
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
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {user?.given_name || "Account"}
                      </p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/profile?tab=bids"
                    className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Bids
                  </Link>
                  <Link
                    href="/profile?tab=listings"
                    className="block text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Listings
                  </Link>
                  <LogoutLink className="block px-4 py-2.5 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 text-center text-sm font-medium transition-colors mt-4">
                    Sign Out
                  </LogoutLink>
                </>
              ) : (
                <LoginLink className="block px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-center text-sm font-medium transition-all shadow-md mt-4">
                  Sign In
                </LoginLink>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
