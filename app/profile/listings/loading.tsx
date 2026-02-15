export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-36 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded mt-2 animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-muted rounded-xl animate-pulse" />
      </div>

      {/* Listings Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            {/* Image Placeholder */}
            <div className="aspect-4/3 bg-muted animate-pulse" />
            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              <div className="flex items-center justify-between pt-1">
                <div className="h-5 w-20 bg-muted rounded animate-pulse" />
                <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
