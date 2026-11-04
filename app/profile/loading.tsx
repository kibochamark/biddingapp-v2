export default function Loading() {
  return (
    <div className="space-y-10">
      {/* Profile Information Skeleton */}
      <div>
        <div className="pb-5   mb-6">
          <div className="h-6 w-44 bg-soft-cloud rounded-full animate-pulse" />
          <div className="h-4 w-72 bg-soft-cloud rounded-full mt-2 animate-pulse" />
        </div>
        <div className="space-y-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 bg-soft-cloud rounded-full animate-pulse" />
              <div className="h-12 w-full bg-soft-cloud rounded-full animate-pulse" />
            </div>
          ))}
          <div className="pt-2">
            <div className="h-11 w-32 bg-soft-cloud rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Account Status Skeleton */}
      <div>
        <div className="pb-5   mb-6">
          <div className="h-6 w-24 bg-soft-cloud rounded-full animate-pulse" />
        </div>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-soft-cloud rounded-full animate-pulse" />
            <div>
              <div className="h-4 w-28 bg-soft-cloud rounded-full animate-pulse" />
              <div className="h-3 w-36 bg-soft-cloud rounded-full mt-1.5 animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-20 bg-soft-cloud rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
