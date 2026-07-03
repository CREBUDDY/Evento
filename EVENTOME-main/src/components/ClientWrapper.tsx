
import { Suspense, ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";

function DefaultLoadingFallback() {
    return (
        <div className="container py-12 md:py-24">
            <div className="mx-auto max-w-3xl">
                <div className="space-y-2 text-center mb-12">
                    <Skeleton className="h-10 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-2 gap-8">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    )
}

export default function ClientWrapper({ children, fallback }: { children: ReactNode, fallback?: ReactNode }) {
  return (
    <Suspense fallback={fallback || <DefaultLoadingFallback />}>
        {children}
    </Suspense>
  );
}
