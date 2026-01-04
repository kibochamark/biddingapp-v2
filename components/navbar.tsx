import Link from "next/link";
import { TrendingUp, Clock, Gavel, Package } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { SearchBar } from "./navbar/search-bar";
import { UserMenu } from "./navbar/user-menu";
import { MobileMenu } from "./navbar/mobile-menu";
import { BidToolTip } from "./navbar/bidtooltip";

export default async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = isUserAuthenticated ? await getUser() : null;

  return (
    <nav className="sticky top-0 z-40 glass-navbar backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-3">
          {/* Logo - Responsive */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-md">
              <Package className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg sm:text-xl font-bold text-foreground whitespace-nowrap">
                BidMarket
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
            <Link
              href="/catalog"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all whitespace-nowrap group"
            >
              <Package className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Browse</span>
            </Link>
            <Link
              href="/catalog?filter=ending-soon"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all whitespace-nowrap group"
            >
              <Clock className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Ending Soon</span>
            </Link>
            <Link
              href="/catalog?filter=trending"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all whitespace-nowrap group"
            >
              <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
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
                <LoginLink className="px-4 py-2 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg hover:from-primary/90 hover:to-orange-600/90 transition-all text-sm font-medium shadow-md hover:shadow-lg whitespace-nowrap">
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
  );
}
