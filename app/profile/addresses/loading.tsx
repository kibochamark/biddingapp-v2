export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 w-44 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-52 bg-muted rounded mt-2 animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-muted rounded-xl animate-pulse" />
      </div>

      {/* Address Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card overflow-hidden"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 bg-muted rounded-md animate-pulse" />
                <div className="h-5 w-12 bg-muted rounded-md animate-pulse" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
                <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
              </div>
            </div>
            {/* Card Body */}
            <div className="p-5 space-y-2">
              <div className="h-5 w-36 bg-muted rounded animate-pulse" />
              <div className="h-4 w-48 bg-muted rounded animate-pulse" />
              <div className="h-4 w-40 bg-muted rounded animate-pulse" />
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-4 w-32 bg-muted rounded mt-3 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
