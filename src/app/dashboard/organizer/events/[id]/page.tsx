import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, DollarSign, Calendar, MapPin, ClipboardList, Settings, Download, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EventControls from "./EventControls";
import TicketCleanupCard from "./TicketCleanupCard";

export default async function EventDashboard({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const event = await prisma.event.findUnique({
    where: { id, organizerId: user.id },
    include: {
      attendees: true,
      _count: {
        select: { attendees: true }
      }
    }
  });

  if (!event) {
    redirect('/dashboard/organizer');
  }

  const revenue = event._count.attendees * event.price;
  const pendingRegistrations = event.attendees.filter(a => a.status === 'pending_registration').length;
  const checkedIn = event.attendees.filter(a => a.status === 'checked_in').length;
  const absent = event.attendees.filter(a => a.status === 'absent').length;
  const approved = event.attendees.filter(a => a.status === 'approved' || a.status === 'checked_in').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Button asChild variant="ghost" className="mb-4 text-black hover:bg-brutalYellow rounded-none border-2 border-transparent hover:border-black transition-all">
          <Link href="/dashboard/organizer">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to My Events
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-8 border-brutalBlue pl-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className={`rounded-none border-2 border-black font-black uppercase ${
                event.status === 'published' ? 'bg-brutalBlue text-white shadow-[2px_2px_0px_0px_var(--brutal-shadow)]' : 
                event.status === 'completed' ? 'bg-brutalGreen text-black -rotate-2 shadow-[2px_2px_0px_0px_var(--brutal-shadow)]' : 
                event.status === 'cancelled' ? 'bg-brutalRed text-white rotate-2 shadow-[2px_2px_0px_0px_var(--brutal-shadow)] border-dashed' : 
                'bg-white text-gray-500'
              }`}>
                {event.status}
              </Badge>
              {pendingRegistrations > 0 && (
                <Badge variant="destructive" className="rounded-none border-2 border-black bg-brutalRed text-black font-black flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" strokeWidth={3} />
                  {pendingRegistrations} Pending
                </Badge>
              )}
            </div>
            <h1 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-4xl text-black">{event.title}</h1>
            <p className="text-black font-bold text-lg mt-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> {format(new Date(event.dateTime), "MMMM d, yyyy h:mm a")}
            </p>
          </div>
          <EventControls eventId={event.id} status={event.status} />
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button asChild variant="outline" className="h-24 rounded-none border-4 border-black bg-white text-black font-black uppercase hover:bg-brutalYellow shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex flex-col items-center justify-center gap-2">
            <Link href={`/dashboard/organizer/events/${event.id}/approvals`}>
                <ClipboardList className="h-6 w-6" strokeWidth={3} />
                Approvals
            </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 rounded-none border-4 border-black bg-white text-black font-black uppercase hover:bg-brutalGreen shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex flex-col items-center justify-center gap-2">
            <Link href={`/dashboard/organizer/events/${event.id}/attendees`}>
                <Users className="h-6 w-6" strokeWidth={3} />
                Attendees
            </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 rounded-none border-4 border-black bg-white text-black font-black uppercase hover:bg-gray-200 shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex flex-col items-center justify-center gap-2">
            <Link href={`/dashboard/organizer/events/${event.id}/reports`}>
                <FileText className="h-6 w-6" strokeWidth={3} />
                Reports
            </Link>
        </Button>
        <Button asChild variant="outline" className="h-24 rounded-none border-4 border-black bg-white text-black font-black uppercase hover:bg-brutalBlue shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all flex flex-col items-center justify-center gap-2">
            <Link href={`/creato/${event.id}/edit`}>
                <Settings className="h-6 w-6" strokeWidth={3} />
                Settings
            </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-none border-4 border-black bg-white shadow-brutal text-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-brutalBlue" strokeWidth={3} />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">₹{revenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-4 border-black bg-white shadow-brutal text-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider">Approved Attendees</CardTitle>
            <Users className="h-5 w-5 text-black" strokeWidth={3} />
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-black">{approved} / {event.capacity}</div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-4 border-black bg-white shadow-brutal text-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider">Checked-In</CardTitle>
            <CheckCircle className="h-5 w-5 text-brutalGreen" strokeWidth={3} />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{checkedIn}</div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-4 border-black bg-white text-black shadow-brutal transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider">Absent / No-Show</CardTitle>
            <AlertCircle className="h-5 w-5 text-brutalRed" strokeWidth={3} />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{absent}</div>
          </CardContent>
        </Card>
      </div>

      <TicketCleanupCard eventId={event.id} status={event.status} ticketCount={event._count.attendees} />
      
    </div>
  );
}
