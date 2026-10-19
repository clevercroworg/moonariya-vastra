// Instant-navigation fallbacks shown while a route's URL-dependent content streams in.

export function CollectionSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading collection">
      <div className="bg-maroon-950">
        <div className="container-x py-14 lg:py-20">
          <div className="h-3 w-40 animate-pulse rounded bg-ivory-50/10" />
          <div className="mt-10 h-12 w-72 max-w-full animate-pulse rounded bg-ivory-50/10" />
          <div className="mt-4 h-12 w-56 animate-pulse rounded bg-ivory-50/10" />
          <div className="mt-6 h-4 w-96 max-w-full animate-pulse rounded bg-ivory-50/10" />
        </div>
      </div>
      <div className="container-x grid grid-cols-2 gap-x-4 gap-y-10 py-14 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] animate-pulse rounded-[2px] bg-ivory-100" />
            <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-ivory-100" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-ivory-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="container-x grid gap-10 pt-14 pb-20 lg:grid-cols-12 lg:gap-14" aria-busy="true" aria-label="Loading saree">
      <div className="aspect-[3/4] animate-pulse rounded-[2px] bg-ivory-100 lg:col-span-7" />
      <div className="lg:col-span-5">
        <div className="h-3 w-32 animate-pulse rounded bg-ivory-100" />
        <div className="mt-4 h-10 w-full animate-pulse rounded bg-ivory-100" />
        <div className="mt-6 h-8 w-40 animate-pulse rounded bg-ivory-100" />
        <div className="mt-8 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-sm bg-ivory-100" />
          ))}
        </div>
        <div className="mt-8 h-14 w-full animate-pulse rounded-full bg-ivory-100" />
      </div>
    </div>
  );
}

export function PlainSkeleton() {
  return <div className="min-h-[72vh] animate-pulse bg-maroon-950" aria-busy="true" />;
}
