import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-28 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-40 bg-muted rounded mt-2 animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-muted rounded-xl animate-pulse" />
      </div>

      {/* Bento Grid Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Large winning card skeleton */}
        <div className="col-span-2 row-span-2 rounded-2xl bg-linear-to-br from-green-500/20 to-emerald-600/20 p-5 sm:p-6 animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 bg-white/20 rounded-lg" />
            <div className="h-4 w-24 bg-white/20 rounded" />
          </div>
          <div className="h-14 w-20 bg-white/20 rounded mb-2" />
          <div className="h-4 w-28 bg-white/20 rounded" />
        </div>

        {/* Small stat cards */}
        <div className="col-span-1 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 animate-pulse">
          <div className="h-7 w-7 bg-primary/20 rounded-lg mb-3" />
          <div className="h-8 w-10 bg-primary/20 rounded mb-1" />
          <div className="h-3 w-16 bg-primary/20 rounded" />
        </div>

        <div className="col-span-1 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30 p-4 sm:p-5 animate-pulse">
          <div className="h-7 w-7 bg-blue-200 dark:bg-blue-800 rounded-lg mb-3" />
          <div className="h-8 w-10 bg-blue-200 dark:bg-blue-800 rounded mb-1" />
          <div className="h-3 w-16 bg-blue-200 dark:bg-blue-800 rounded" />
        </div>

        {/* Wide card */}
        <div className="col-span-2 rounded-2xl bg-white dark:bg-gray-900 border border-border p-4 sm:p-5 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-7 w-7 bg-muted rounded-lg" />
                <div className="h-3 w-20 bg-muted rounded" />
              </div>
              <div className="h-8 w-24 bg-muted rounded" />
            </div>
            <div className="text-right">
              <div className="h-3 w-16 bg-muted rounded mb-1" />
              <div className="h-5 w-10 bg-muted rounded" />
            </div>
          </div>
        </div>

        {/* Dark action card */}
        <div className="col-span-2 lg:col-span-2 rounded-2xl bg-gray-900 dark:bg-gray-800 p-4 sm:p-5 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-3 w-20 bg-white/10 rounded mb-2" />
              <div className="h-5 w-32 bg-white/10 rounded" />
            </div>
            <div className="h-11 w-11 bg-white/10 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm">Loading your bids...</p>
      </div>

      {/* Bid cards skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-muted rounded animate-pulse" />
          <div className="h-5 w-24 bg-muted rounded animate-pulse" />
          <div className="h-5 w-6 bg-muted rounded-full animate-pulse ml-2" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-white dark:bg-gray-900 overflow-hidden animate-pulse"
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-16 bg-muted rounded-full" />
                  <div className="h-6 w-20 bg-muted rounded-full" />
                </div>
                <div className="h-5 w-3/4 bg-muted rounded mb-2" />
                <div className="h-3 w-1/2 bg-muted rounded mb-4" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="h-2 w-12 bg-muted rounded mb-2" />
                    <div className="h-6 w-16 bg-muted rounded" />
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="h-2 w-12 bg-muted rounded mb-2" />
                    <div className="h-6 w-16 bg-muted rounded" />
                  </div>
                </div>
              </div>
              <div className="border-t border-border/50 px-4 py-3 bg-muted/30 flex items-center justify-between">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-4 w-4 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
