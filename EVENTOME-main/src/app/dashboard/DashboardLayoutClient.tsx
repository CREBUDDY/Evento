
"use client"
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, Ticket, Building, FilePenLine, PanelLeft } from "lucide-react";
import { useEffect } from "react";
import { useUser } from "@/firebase";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const sidebarNavItems = [
    {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutGrid
    },
    {
        title: "Organizer",
        href: "/dashboard/organizer",
        icon: Building
    },
    {
        title: "Drafts",
        href: "/dashboard/organizer/drafts",
        icon: FilePenLine
    },
    {
        title: "Attendee",
        href: "/dashboard/attendee",
        icon: Ticket
    },
];

function SidebarNav({ className }: { className?: string }) {
    const pathname = usePathname();
    return (
         <nav className={cn("grid items-start gap-4 px-2 text-sm font-black uppercase", className)}>
            {sidebarNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center w-full justify-start px-4 py-3 border-4 border-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                      isActive ? "bg-brutalGreen text-black" : "bg-white text-black hover:bg-brutalYellow"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" strokeWidth={3} />
                    {item.title}
                  </div>
                </Link>
              );
            })}
          </nav>
    )
}

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isUserLoading && !user) {
      const redirect = searchParams.get('redirect');
      router.push(redirect ? `/login?redirect=${redirect}`: '/login?redirect=/dashboard');
    }
  }, [user, isUserLoading, router, searchParams]);

  if (isUserLoading || !user) {
    return (
        <div className="container min-h-screen">
          <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-12 py-12">
            <aside className="-ml-4 hidden md:block">
              <nav className="grid items-start gap-2 px-2 text-sm font-medium">
                {sidebarNavItems.map((item) => (
                  <Skeleton key={item.href} className="h-10 w-full" />
                ))}
              </nav>
            </aside>
            <main className="w-full space-y-8">
                <Skeleton className="h-10 w-1/2" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </main>
          </div>
        </div>
    );
  }

  return (
    <div className="container min-h-screen">
      <div className="grid md:grid-cols-[220px_1fr] lg:grid-cols-[250px_1fr] gap-12 py-8 md:py-12">
        <aside className="-ml-4 hidden md:block">
          <SidebarNav />
        </aside>
        <main className="w-full">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="md:hidden mb-4">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Navigation</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-60 p-4">
                   <SidebarNav className="mt-8"/>
                </SheetContent>
            </Sheet>
            {children}
        </main>
      </div>
    </div>
  );
}
