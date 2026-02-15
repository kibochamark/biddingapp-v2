export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Profile Information Card Skeleton */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <div className="h-6 w-44 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-muted rounded mt-2 animate-pulse" />
        </div>
        <div className="p-6 space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-11 w-full bg-muted rounded-xl animate-pulse" />
            </div>
          ))}
          <div className="pt-2">
            <div className="h-11 w-32 bg-muted rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Account Status Card Skeleton */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <div className="h-6 w-24 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-muted rounded-lg animate-pulse" />
              <div>
                <div className="h-4 w-28 bg-muted rounded animate-pulse" />
                <div className="h-3 w-36 bg-muted rounded mt-1.5 animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-20 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
