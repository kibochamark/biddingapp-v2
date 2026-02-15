export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-muted animate-pulse" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-xl bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className="space-y-6">
          {/* Title & Badge */}
          <div>
            <div className="h-5 w-20 bg-muted rounded-full animate-pulse mb-3" />
            <div className="h-8 w-3/4 bg-muted rounded-lg animate-pulse" />
            <div className="h-5 w-1/2 bg-muted rounded mt-3 animate-pulse" />
          </div>

          {/* Price / Entry Fee */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-28 bg-muted rounded-xl animate-pulse" />
            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
          </div>

          {/* Timer */}
          <div className="rounded-2xl border border-border p-5">
            <div className="h-4 w-24 bg-muted rounded animate-pulse mb-3" />
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-10 w-14 bg-muted rounded-lg animate-pulse" />
                  <div className="h-3 w-10 bg-muted rounded mt-1 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Bid Form */}
          <div className="rounded-2xl border border-border p-5 space-y-4">
            <div className="h-11 w-full bg-muted rounded-xl animate-pulse" />
            <div className="h-11 w-full bg-primary/20 rounded-xl animate-pulse" />
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border pb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-5 w-24 bg-muted rounded animate-pulse"
              />
            ))}
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-muted rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
