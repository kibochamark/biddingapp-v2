"use client"
import Link from "next/link";
import { TrendingUp, Clock, Gavel, Package } from "lucide-react";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { SearchBar } from "./navbar/search-bar";
import { UserMenu } from "./navbar/user-menu";
import { MobileMenu } from "./navbar/mobile-menu";
import { BidToolTip } from "./navbar/bidtooltip";
import { usePathname } from "next/navigation";

interface MainNavbarProps {
  user?: {} | null; // or a proper User type
  isUserAuthenticated?: boolean | null;
}

export default  function Navbar({user, isUserAuthenticated}: MainNavbarProps) {

  const router = usePathname();

  if (router.startsWith("/admin")) {
    return null; // Do not render navbar on admin pages
  }

  return (
    <nav className="sticky top-0 z-100 glass-navbar">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          {/* Logo - Responsive */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary flex items-center justify-center">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg sm:text-xl font-semibold text-ink whitespace-nowrap">
                BidMarket
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            <Link
              href="/catalog?sortBy=ending_soon"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink hover:text-primary transition-colors whitespace-nowrap"
            >
              <Package className="h-4 w-4" />
              <span>Browse</span>
            </Link>
            <Link
              href="/catalog?sortBy=ending_soon"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink hover:text-primary transition-colors whitespace-nowrap"
            >
              <Clock className="h-4 w-4" />
              <span>Ending Soon</span>
            </Link>
            <Link
              href="/catalog?sortBy=ending_soon"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink hover:text-primary transition-colors whitespace-nowrap"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </Link>
          </div>

          {/* Search Bar - Flexible width */}
          <div className="flex-1 max-w-md block mx-2 sm:mx-3 lg:mx-4">
            <SearchBar />
          </div>

          {/* Right Section - Auth & Menu */}
          <div className="flex items-center gap-2 mx-4 sm:gap-3 shrink-0">
            {/* My Bids - Desktop only, icon + text on larger screens */}
            {isUserAuthenticated && (
              <BidToolTip />
            )}

            {/* Desktop Auth - Hidden on mobile */}
            <div className="hidden md:flex items-center">
              {isUserAuthenticated && user ? (
                <UserMenu user={user} />
              ) : (
                <LoginLink className="h-10 px-5 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-[transform,background-color] text-sm font-medium whitespace-nowrap">
                  Sign In
                </LoginLink>
              )}
            </div>

            {/* Mobile Menu - Always visible on small screens */}
            <MobileMenu
              isAuthenticated={!!isUserAuthenticated}
              user={user}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
