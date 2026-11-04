import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-28 bg-soft-cloud rounded-full animate-pulse" />
          <div className="h-4 w-40 bg-soft-cloud rounded-full mt-2 animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-soft-cloud rounded-full animate-pulse" />
      </div>

      {/* Quick stats row skeleton */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-4 border-y border-hairline">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="h-3 w-10 bg-soft-cloud rounded-full mb-1.5 animate-pulse" />
            <div className="h-6 w-12 bg-soft-cloud rounded-full animate-pulse" />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-mute text-sm">Loading your bids...</p>
      </div>

      {/* Bid cards skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-soft-cloud rounded-full animate-pulse" />
          <div className="h-5 w-24 bg-soft-cloud rounded-full animate-pulse" />
          <div className="h-5 w-6 bg-soft-cloud rounded-full animate-pulse ml-2" />
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="border border-hairline overflow-hidden animate-pulse"
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-16 bg-soft-cloud rounded-full" />
                  <div className="h-6 w-20 bg-soft-cloud rounded-full" />
                </div>
                <div className="h-5 w-3/4 bg-soft-cloud rounded-full mb-2" />
                <div className="h-3 w-1/2 bg-soft-cloud rounded-full mb-4" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-soft-cloud rounded-lg p-3">
                    <div className="h-2 w-12 bg-background rounded-full mb-2" />
                    <div className="h-6 w-16 bg-background rounded-full" />
                  </div>
                  <div className="bg-soft-cloud rounded-lg p-3">
                    <div className="h-2 w-12 bg-background rounded-full mb-2" />
                    <div className="h-6 w-16 bg-background rounded-full" />
                  </div>
                </div>
              </div>
              <div className="border-t border-hairline px-4 py-3 bg-soft-cloud flex items-center justify-between">
                <div className="h-3 w-20 bg-background rounded-full" />
                <div className="h-4 w-4 bg-background rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
