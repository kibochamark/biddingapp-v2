"use client";

import { Menu, Clock, TrendingUp, User, X, Package, Gavel, UserCircle, ShoppingBag, LogOut } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-foreground" />
        ) : (
          <Menu className="h-5 w-5 text-foreground" />
        )}
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
              onClick={closeMenu}
            />

            {/* Menu Panel - Dropdown style below navbar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-16 left-0 right-0 bg-card border-b border-border shadow-xl z-40 max-h-[calc(100vh-4rem)] overflow-y-auto lg:hidden"
            >
              <div className="p-4 space-y-1">
                {/* Navigation Links */}
                <div className="space-y-1 mb-4">
                  <Link
                    href="/catalog"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    onClick={closeMenu}
                  >
                    <Package className="h-5 w-5" />
                    <span>Browse Auctions</span>
                  </Link>
                  <Link
                    href="/catalog?filter=ending-soon"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    onClick={closeMenu}
                  >
                    <Clock className="h-5 w-5" />
                    <span>Ending Soon</span>
                  </Link>
                  <Link
                    href="/catalog?filter=trending"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    onClick={closeMenu}
                  >
                    <TrendingUp className="h-5 w-5" />
                    <span>Trending</span>
                  </Link>
                </div>

                {/* User Section */}
                {isAuthenticated ? (
                  <>
                    <div className="border-t border-border pt-4 mt-4">
                      {/* User Info Card */}
                      <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-lg mb-3">
                        {user?.picture ? (
                          <img
                            src={user.picture}
                            alt={user.given_name || "User"}
                            className="w-10 h-10 rounded-full border-2 border-primary/20"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
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

                      {/* User Menu Links */}
                      <div className="space-y-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          onClick={closeMenu}
                        >
                          <UserCircle className="h-5 w-5" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          href="/profile/bids"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          onClick={closeMenu}
                        >
                          <Gavel className="h-5 w-5" />
                          <span>My Bids</span>
                        </Link>
                        <Link
                          href="/profile/listings"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          onClick={closeMenu}
                        >
                          <ShoppingBag className="h-5 w-5" />
                          <span>My Listings</span>
                        </Link>
                      </div>

                      {/* Sign Out Button */}
                      <LogoutLink className="flex items-center justify-center gap-2 w-full px-4 py-3 mt-4 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 text-sm font-medium transition-all shadow-md">
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </LogoutLink>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-border pt-4 mt-4">
                    <LoginLink className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg hover:from-primary/90 hover:to-orange-600/90 text-sm font-medium transition-all shadow-md">
                      <User className="h-4 w-4" />
                      <span>Sign In</span>
                    </LoginLink>
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Sign in to place bids and manage your account
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
