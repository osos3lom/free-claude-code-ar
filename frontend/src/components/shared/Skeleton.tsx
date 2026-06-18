import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--surface-raised)]",
        className,
      )}
    />
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-5">
      {[1, 2].map((s) => (
        <div key={s} className="rounded-lg border border-[var(--border)] p-4 space-y-3">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-px w-full" />
          {[1, 2, 3].map((f) => (
            <div key={f} className="py-1 space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-8 w-20 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-4">
      {/* Status card */}
      <div className="rounded-lg border border-[var(--border)] p-4">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
          <div className="col-span-2 space-y-1.5">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
      </div>
      {/* Provider status */}
      <div className="rounded-lg border border-[var(--border)] p-4">
        <Skeleton className="h-4 w-28 mb-3" />
        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-[var(--border)] p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-7 w-14 rounded-md self-end ms-auto" />
        </div>
      ))}
    </div>
  );
}
