
import { Suspense, ReactNode } from "react";
import { Skeleton } from "./ui/skeleton";

import LoaderBox from "./loader-box";

function DefaultLoadingFallback() {
    return (
        <div className="container py-12 md:py-24 flex items-center justify-center min-h-[50vh]">
            <LoaderBox />
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
