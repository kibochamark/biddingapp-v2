// Loading skeleton components

export function ProductCardSkeleton() {
  return (
    <div className="glass-card rounded-lg overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-square bg-muted" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="h-4 bg-muted rounded w-3/4" />

        {/* Price */}
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-6 bg-muted rounded w-2/3" />
        </div>

        {/* Time */}
        <div className="h-3 bg-muted rounded w-1/3" />

        {/* Seller */}
        <div className="pt-2 border-t border-border">
          <div className="h-3 bg-muted rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-5">
      <div className="h-7 bg-muted rounded w-40 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HeroCarouselSkeleton() {
  return (
    <div className="relative w-full h-[500px] bg-muted rounded-2xl animate-pulse">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-12 bg-muted-foreground/20 rounded w-64 mx-auto" />
          <div className="h-6 bg-muted-foreground/20 rounded w-48 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card rounded-lg p-6 animate-pulse">
          <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3" />
          <div className="h-4 bg-muted rounded w-3/4 mx-auto" />
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
        {/* Image skeleton */}
        <div className="aspect-square bg-muted rounded-lg" />

        {/* Info skeleton */}
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}

export function AddressCardSkeleton() {
  return (
    <div className="glass-card rounded-lg p-6 animate-pulse">
      <div className="space-y-3">
        {/* Name */}
        <div className="h-5 bg-muted rounded w-1/2" />

        {/* Address lines */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>

        {/* Phone */}
        <div className="h-4 bg-muted rounded w-1/3" />

        {/* Actions */}
        <div className="pt-4 border-t border-border flex gap-2">
          <div className="h-9 bg-muted rounded w-20" />
          <div className="h-9 bg-muted rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function AddressesGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <AddressCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function KYCStatusSkeleton() {
  return (
    <div className="glass-card rounded-lg p-6 animate-pulse">
      <div className="space-y-4">
        {/* Status badge */}
        <div className="h-6 bg-muted rounded w-32" />

        {/* Info */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-20" />
            <div className="h-4 bg-muted rounded w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-20" />
            <div className="h-4 bg-muted rounded w-full" />
          </div>
        </div>

        {/* Button */}
        <div className="h-10 bg-muted rounded w-full" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Profile header */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-muted rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-6 bg-muted rounded w-48" />
            <div className="h-4 bg-muted rounded w-64" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        <div className="h-10 bg-muted rounded w-32" />
        <div className="h-10 bg-muted rounded w-32" />
      </div>

      {/* Content area */}
      <div className="h-64 bg-muted rounded-lg" />
    </div>
  );
}
