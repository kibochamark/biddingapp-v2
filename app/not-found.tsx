import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="font-display text-[160px] sm:text-[220px] leading-none text-soft-cloud select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-20 sm:size-24 rounded-full bg-soft-cloud flex items-center justify-center">
              <Search className="h-8 w-8 sm:h-10 sm:w-10 text-ink" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl sm:text-3xl font-medium text-ink uppercase mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-mute mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 active:scale-95 transition-[transform,background-color]"
          >
            Go Home
          </Link>
          <Link
            href="/catalog?sortBy=ending_soon"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-soft-cloud text-ink rounded-full font-medium hover:bg-hairline-soft active:scale-95 transition-[transform,background-color]"
          >
            <TrendingUp className="h-5 w-5" />
            Browse Auctions
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8  ">
          <p className="text-sm text-mute mb-4">
            Here are some helpful links instead:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/catalog?sortBy=ending_soon"
              className="text-ink underline underline-offset-4 hover:text-primary"
            >
              Trending Auctions
            </Link>
            <span className="text-mute">•</span>
            <Link
              href="/catalog?sortBy=ending_soon"
              className="text-ink underline underline-offset-4 hover:text-primary"
            >
              Ending Soon
            </Link>
            <span className="text-mute">•</span>
            <Link
              href="/how-it-works"
              className="text-ink underline underline-offset-4 hover:text-primary"
            >
              How It Works
            </Link>
            <span className="text-mute">•</span>
            <Link
              href="/profile"
              className="text-ink underline underline-offset-4 hover:text-primary"
            >
              My Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "404 - Page Not Found | BidMarket",
  description: "The page you're looking for doesn't exist.",
};
