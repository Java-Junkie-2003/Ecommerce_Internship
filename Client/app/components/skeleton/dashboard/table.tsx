import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton() {
    return (
        <div className="w-full">
            <div className="rounded-md border">
                <div className="border-b p-4">
                    <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-[20%]" />
                    <Skeleton className="h-4 w-[30%]" />
                    <Skeleton className="h-4 w-[40%]" />
                    <Skeleton className="h-4 w-[50%]" />

                </div>
            </div>
            {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b p-4 last:border-b-0">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-[20%]" />
                        <Skeleton className="h-4 w-[30%]" />
                        <Skeleton className="h-4 w-[40%]" />
                        <Skeleton className="h-4 w-[50%]" />
                    </div>
                </div>
            ))}
        </div>
    </div >
);  
}
