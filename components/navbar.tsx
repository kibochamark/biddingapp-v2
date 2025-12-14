"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { LoginLink, LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isAuthenticated, user, isLoading } = useKindeBrowserClient();

  return (
    <nav className="sticky top-0 z-50 glass-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">BidMarket</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/catalog"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Browse Auctions
            </Link>
            <Link
              href="/catalog"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/catalog"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Ending Soon
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 pr-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="p-2 hover:bg-accent rounded-lg transition-colors relative"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Desktop Auth UI */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="hidden md:flex items-center gap-2 relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt={user.given_name || "User"}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                      <span className="text-sm font-medium">
                        {user?.given_name || "Account"}
                      </span>
                    </button>

                    {/* User Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute top-12 right-0 w-48 glass-card rounded-lg shadow-lg py-2 z-50">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/profile?tab=bids"
                          className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Bids
                        </Link>
                        <Link
                          href="/profile?tab=listings"
                          className="block px-4 py-2 text-sm hover:bg-accent transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Listings
                        </Link>
                        <hr className="my-2 border-border" />
                        <LogoutLink className="block px-4 py-2 text-sm hover:bg-accent transition-colors text-destructive">
                          <div className="flex items-center gap-2">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </div>
                        </LogoutLink>
                      </div>
                    )}
                  </div>
                ) : (
                  <LoginLink className="hidden md:block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                    Sign In
                  </LoginLink>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-accent rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2 pr-10 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/catalog"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Auctions
            </Link>
            <Link
              href="/catalog"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/catalog"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ending Soon
            </Link>

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <hr className="my-2 border-border" />
                    <div className="flex items-center gap-2 px-2">
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt={user.given_name || "User"}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                      <span className="text-sm font-medium">
                        {user?.given_name || "Account"}
                      </span>
                    </div>
                    <Link
                      href="/profile"
                      className="block text-sm font-medium hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/profile?tab=bids"
                      className="block text-sm font-medium hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Bids
                    </Link>
                    <Link
                      href="/profile?tab=listings"
                      className="block text-sm font-medium hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Listings
                    </Link>
                    <LogoutLink className="block px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 text-center text-sm font-medium">
                      Sign Out
                    </LogoutLink>
                  </>
                ) : (
                  <LoginLink className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-center text-sm font-medium">
                    Sign In
                  </LoginLink>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
