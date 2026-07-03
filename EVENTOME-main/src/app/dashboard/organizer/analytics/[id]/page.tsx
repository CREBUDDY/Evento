
'use client'

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Download, Ticket, Users, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from '@/firebase';
import type { Event } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function EventAnalyticsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const eventDocRef = useMemoFirebase(() => 
    (firestore && id) ? doc(firestore, 'creato', id) : null, 
  [firestore, id]);
  
  const { data: event, isLoading: isEventLoading } = useDoc<Event>(eventDocRef);

  if (isEventLoading || isUserLoading) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-10 w-48"/>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32 w-full"/>
                <Skeleton className="h-32 w-full"/>
                <Skeleton className="h-32 w-full"/>
                <Skeleton className="h-32 w-full"/>
            </div>
            <Skeleton className="h-64 w-full"/>
        </div>
    );
  }

  if (!event) {
     return (
        <div className="text-center py-20">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-muted-foreground mt-4">Event not found. It might have been moved or deleted.</p>
            <Button asChild variant="outline" className="mt-6">
                <Link href="/dashboard/organizer">Go to Organizer Dashboard</Link>
            </Button>
        </div>
     );
  }

  // Ensure organizer is viewing their own event analytics
  if (user?.uid !== event.organizerId) {
     return (
        <div className="text-center py-20">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">You do not have permission to view these analytics.</p>
             <Button asChild variant="outline" className="mt-6">
                <Link href="/dashboard/organizer">Go to Organizer Dashboard</Link>
            </Button>
        </div>
     )
  }
  
  const attendees = event.attendees || 0;
  const capacity = event.capacity;
  const attendancePercentage = capacity > 0 ? (attendees / capacity) * 100 : 0;
  const revenue = attendees * (event.price || 0);
  const ticketsScanned = Math.floor(attendees * 0.85); // Mocked data
  const scanPercentage = attendees > 0 ? (ticketsScanned / attendees) * 100 : 0;

  return (
    <div className="space-y-8">
        <Button variant="ghost" asChild>
            <Link href="/dashboard/organizer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Organizer Dashboard
            </Link>
        </Button>
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Event Analytics</h1>
        <p className="text-muted-foreground text-lg">{event.title}</p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/60 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">from {attendees.toLocaleString()} attendees</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendees.toLocaleString()} / {capacity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{attendancePercentage.toFixed(1)}% full</p>
          </CardContent>
        </Card>
        <Card className="bg-card/60 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Scanned</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketsScanned.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{scanPercentage.toFixed(1)}% check-in rate</p>
          </CardContent>
        </Card>
         <Card className="bg-card/60 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(new Date(event.dateTime), 'MMM dd')}</div>
             <p className="text-xs text-muted-foreground">{format(new Date(event.dateTime), 'yyyy, p')}</p>
          </CardContent>
        </Card>
      </div>

       <Card className="bg-card/60 backdrop-blur-sm border-white/10">
        <CardHeader>
            <div className="flex justify-between items-center">
                 <div>
                    <CardTitle>Attendee List</CardTitle>
                    <CardDescription>A list of all registered attendees for your event.</CardDescription>
                </div>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download CSV
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            {/* Mock Attendee List */}
            <div className="text-center py-12 text-muted-foreground">
                <p>Attendee list will be displayed here.</p>
            </div>
        </CardContent>
       </Card>

    </div>
  );
}
