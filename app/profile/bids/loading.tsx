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
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-4 ">
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

      {/* Bid group rows skeleton */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-soft-cloud rounded-full animate-pulse" />
          <div className="h-5 w-24 bg-soft-cloud rounded-full animate-pulse" />
          <div className="h-5 w-6 bg-soft-cloud rounded-full animate-pulse ml-2" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="shadow-surface p-4 flex items-center justify-between gap-4 animate-pulse"
            >
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 bg-soft-cloud rounded-full" />
                  <div className="h-5 w-20 bg-soft-cloud rounded-full" />
                </div>
                <div className="h-4 w-1/2 bg-soft-cloud rounded-full" />
                <div className="h-3 w-1/3 bg-soft-cloud rounded-full" />
              </div>
              <div className="h-5 w-5 bg-soft-cloud rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
