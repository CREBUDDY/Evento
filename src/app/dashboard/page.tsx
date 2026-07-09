
"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Ticket, ArrowRight } from "lucide-react";
import { useUser } from "@/firebase";

export default function DashboardPage() {
  const { user } = useUser();
  const userName = user?.displayName?.split(' ')[0] || 'User';

  return (
    <div className="space-y-8">
      <div className="border-l-8 border-brutalPurple pl-6">
        <h1 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-5xl text-black">Welcome to your Dashboard, {userName}!</h1>
        <p className="text-black font-bold text-lg mt-2">Manage your events and tickets all in one place.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-none border-4 border-black bg-brutalBlue p-6 shadow-brutal text-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase">
              <Building className="h-8 w-8 text-black" strokeWidth={3} />
              Organizer Dashboard
            </CardTitle>
            <CardDescription className="text-black font-bold text-base mt-2">
              Create, manage, and track your hosted events. View analytics and engage with your attendees.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Button asChild className="rounded-none border-4 border-black bg-white text-black font-black uppercase hover:bg-white w-full mt-4 h-12 shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <Link href="/dashboard/organizer">
                Go to Organizer View <ArrowRight className="ml-2 h-5 w-5" strokeWidth={3} />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-none border-4 border-black bg-brutalYellow p-6 shadow-brutal text-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="flex items-center gap-2 text-2xl font-black uppercase">
              <Ticket className="h-8 w-8 text-black" strokeWidth={3} />
              Attendee Dashboard
            </CardTitle>
            <CardDescription className="text-black font-bold text-base mt-2">
              Access your tickets for upcoming events, view event details, and manage your joined events.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Button asChild className="rounded-none border-4 border-black bg-white text-black font-black uppercase hover:bg-white w-full mt-4 h-12 shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <Link href="/dashboard/attendee">
                Go to Attendee View <ArrowRight className="ml-2 h-5 w-5" strokeWidth={3} />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
