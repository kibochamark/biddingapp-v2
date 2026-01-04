import Link from "next/link";
import { Home, Search, TrendingUp, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-[120px] sm:text-[180px] font-bold text-primary/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-6 bg-primary/10 rounded-full">
              <Search className="h-16 w-16 sm:h-20 sm:w-20 text-primary" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Home className="h-5 w-5" />
            Go Home
          </Link>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-accent transition-all border border-border"
          >
            <TrendingUp className="h-5 w-5" />
            Browse Auctions
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">
            Here are some helpful links instead:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/catalog?filter=trending"
              className="text-primary hover:underline"
            >
              Trending Auctions
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/catalog?filter=ending-soon"
              className="text-primary hover:underline"
            >
              Ending Soon
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/how-it-works"
              className="text-primary hover:underline"
            >
              How It Works
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/profile"
              className="text-primary hover:underline"
            >
              My Account
            </Link>
          </div>
        </div>

        {/* Back Button */}
      
      </div>
    </div>
  );
}

export const metadata = {
  title: "404 - Page Not Found | BidMarket",
  description: "The page you're looking for doesn't exist.",
};
