import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton to mirror your product detail layout while loading
export default function ProductDetailSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 py-4">
        {/* Header: thumbnail + basic info */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-md overflow-hidden">
            <Skeleton className="h-full w-full rounded-md" />
          </div>

          <div className="space-y-2 w-full max-w-[600px]">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-40" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Meta grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <RowSkeleton labelW="w-24" valueW="w-28" />
            <RowSkeleton labelW="w-28" valueW="w-20" />
            <RowSkeleton labelW="w-24" valueW="w-24" />
            <RowSkeleton labelW="w-24" valueW="w-28" />
          </div>

          <div className="space-y-3">
            <RowSkeleton labelW="w-24" valueW="w-20" />
            <RowSkeleton labelW="w-20" valueW="w-24" />
            <RowSkeleton labelW="w-16" valueW="w-40" />
            <RowSkeleton labelW="w-40" valueW="w-24" />
            <RowSkeleton labelW="w-28" valueW="w-24" />
            <RowSkeleton labelW="w-28" valueW="w-20" />
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div>
          <Skeleton className="h-5 w-40 mb-2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-28 rounded-2xl" />
        <Skeleton className="h-10 w-24 rounded-2xl" />
      </div>
    </div>
  );
}

function RowSkeleton({ labelW = "w-24", valueW = "w-24" }: { labelW?: string; valueW?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-4 rounded-full" />
      <Skeleton className={`h-4 ${labelW}`} />
      <Skeleton className={`h-4 ${valueW}`} />
    </div>
  );
}