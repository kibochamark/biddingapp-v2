import Link from "next/link";
import { TrendingUp, Clock, Gavel } from "lucide-react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { SearchBar } from "./navbar/search-bar";
import { UserMenu } from "./navbar/user-menu";
import { MobileMenu } from "./navbar/mobile-menu";

export default async function Navbar() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  const user = isUserAuthenticated ? await getUser() : null;

  return (
    <nav className="sticky top-0 z-40 glass-navbar backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-1 sm:gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-xl font-bold text-foreground hidden md:block">
              BidMarket
            </div>
            <div className="text-xl font-bold text-foreground md:hidden">BM</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:ml-2 items-center space-x-6">
            <Link
              href="/catalog"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group"
            >
              Browse Auctions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/catalog?filter=ending-soon"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group flex items-center gap-1"
            >
              <Clock className="h-4 w-4" />
              Ending Soon
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/catalog?filter=trending"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors relative group flex items-center gap-1"
            >
              <TrendingUp className="h-4 w-4" />
              Trending
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </div>

          {/* Search Bar - Client Component */}
          <div className="">
            <SearchBar />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* My Bids - Only show when authenticated */}
            {isUserAuthenticated && (
              <Link
                href="/profile?tab=bids"
                className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-accent rounded-full transition-colors group"
              >
                <Gavel className="h-4 w-4 text-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary">My Bids</span>
              </Link>
            )}

            {/* Desktop Auth UI */}
            {isUserAuthenticated && user ? (
              <UserMenu user={user} />
            ) : (
              <LoginLink className="hidden md:block px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105">
                Sign In
              </LoginLink>
            )}

            {/* Mobile Menu - Client Component */}
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
