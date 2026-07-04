
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DeprecatedCreateEventPage() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-screen text-center">
           <h1 className="text-3xl font-bold mb-4">This Page is No Longer in Use</h1>
           <p className="text-muted-foreground mb-8 max-w-md">Event creation has moved to our new and improved "Creato" page. Please use the button below to create your next event.</p>
           <Button asChild>
             <Link href="/creato">Go to Creato Page</Link>
           </Button>
        </div>
    )
}
