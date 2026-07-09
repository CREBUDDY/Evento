import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Calendar, Users, DollarSign, MoreHorizontal, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import VerifyAttendeeForm from "./VerifyAttendeeForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteEventItem from "./DeleteEventItem";

export const revalidate = 0;

export default async function OrganizerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Auto-delete events that were completed or cancelled more than 7 days ago
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await prisma.event.deleteMany({
    where: {
      organizerId: user.id,
      status: { in: ['completed', 'cancelled'] },
      updatedAt: { lt: sevenDaysAgo }
    }
  });

  const organizerEvents = await prisma.event.findMany({
    where: { 
      organizerId: user.id,
      status: { notIn: ['completed', 'cancelled'] }
    },
    include: {
      _count: {
        select: { attendees: true }
      },
      attendees: {
        select: {
          status: true
        }
      }
    },
    orderBy: { dateTime: 'desc' }
  });

  const totalEvents = organizerEvents.length;
  const totalAttendees = organizerEvents.reduce((sum, event) => sum + event._count.attendees, 0);
  const totalRevenue = organizerEvents.reduce((sum, event) => sum + (event._count.attendees * event.price), 0);
  const pendingApprovals = organizerEvents.reduce((sum, event) => sum + event.attendees.filter(a => a.status === 'pending_registration').length, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-8 border-brutalRed pl-6">
        <div>
          <h1 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-5xl text-black">Organizer Dashboard</h1>
          <p className="text-black font-bold text-lg mt-2">Here's an overview of your events.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Button asChild className="w-full sm:w-auto rounded-none border-4 border-black bg-brutalGreen text-black font-black uppercase hover:bg-brutalGreen shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
            <Link href="/creato">
                <PlusCircle className="mr-2 h-5 w-5" strokeWidth={3} />
                Create New Event
            </Link>
            </Button>
        </div>
      </div>

      <VerifyAttendeeForm events={organizerEvents} organizerId={user.id} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-none border-4 border-black bg-brutalBlue shadow-[4px_4px_0px_0px_var(--brutal-shadow)] text-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{totalEvents}</div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-4 border-black bg-brutalYellow shadow-[4px_4px_0px_0px_var(--brutal-shadow)] text-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{totalAttendees}</div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-4 border-black bg-brutalGreen shadow-[4px_4px_0px_0px_var(--brutal-shadow)] text-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_var(--brutal-shadow)] text-black">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider">Pending Approvals</CardTitle>
            <Users className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{pendingApprovals}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_var(--brutal-shadow)] md:shadow-[8px_8px_0px_0px_var(--brutal-shadow)] text-black">
        <CardHeader className="border-b-4 border-black pb-4">
          <CardTitle className="font-black uppercase text-2xl">My Events</CardTitle>
          <CardDescription className="font-bold text-black">A list of events you are hosting.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-brutalBg">
              <TableRow className="border-b-4 border-black">
                <TableHead className="font-black uppercase text-black">Event</TableHead>
                <TableHead className="font-black uppercase text-black">Status</TableHead>
                <TableHead className="hidden md:table-cell font-black uppercase text-black">Date</TableHead>
                <TableHead className="text-right font-black uppercase text-black">Attendees</TableHead>
                <TableHead className="text-right font-black uppercase text-black">Revenue</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizerEvents.map((event) => (
                <TableRow key={event.id} className="border-b-2 border-black hover:bg-brutalYellow transition-colors">
                  <TableCell className="font-black text-lg">{event.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-none border-2 border-black font-black uppercase text-xs ${
                      event.status === 'published' ? 'bg-brutalBlue text-white shadow-[2px_2px_0px_0px_var(--brutal-shadow)]' : 
                      event.status === 'completed' ? 'bg-brutalGreen text-black -rotate-2 shadow-[2px_2px_0px_0px_var(--brutal-shadow)]' : 
                      event.status === 'cancelled' ? 'bg-brutalRed text-white rotate-2 shadow-[2px_2px_0px_0px_var(--brutal-shadow)] border-dashed' : 
                      'bg-white text-gray-500'
                    }`}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-bold">{format(new Date(event.dateTime), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right font-bold">{event._count.attendees} / {event.capacity}</TableCell>
                  <TableCell className="text-right font-black">₹{(event._count.attendees * event.price).toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="outline" className="rounded-none border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_var(--brutal-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                          <MoreHorizontal className="h-5 w-5" strokeWidth={3} />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_var(--brutal-shadow)] p-0 bg-white">
                        <DropdownMenuLabel className="font-black uppercase bg-brutalBg border-b-2 border-black text-black">Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="rounded-none text-black focus:bg-brutalYellow focus:text-black font-bold cursor-pointer">
                            <Link href={`/dashboard/organizer/events/${event.id}`}>Manage Event Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-none text-black focus:bg-brutalBlue focus:text-black font-bold cursor-pointer">
                            <Link href={`/dashboard/organizer/events/${event.id}/approvals`}>Approvals</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-none text-black focus:bg-brutalGreen focus:text-black font-bold cursor-pointer">
                            <Link href={`/dashboard/organizer/events/${event.id}/attendees`}>View Attendees</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-none text-black focus:bg-brutalYellow focus:text-black font-bold cursor-pointer">
                            <Link href={`/dashboard/organizer/events/${event.id}/reports`}>Reports & Analytics</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-none text-black focus:bg-brutalBlue focus:text-black font-bold cursor-pointer border-t-2 border-black">
                            <Link href={`/creato/${event.id}/edit`}>Edit Details</Link>
                        </DropdownMenuItem>
                        {(event.status === 'completed' || event.status === 'cancelled') && (
                            <DeleteEventItem eventId={event.id} />
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {organizerEvents.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-black font-bold text-lg">You haven't created any events yet.</p>
                    <Button asChild variant="outline" className="mt-4 rounded-none border-4 border-black bg-brutalBlue text-black font-black uppercase hover:bg-brutalBlue shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                        <Link href="/creato">Create your first event</Link>
                    </Button>
                </div>
            )}
        </CardContent>
      </Card>

      {/* Floating Trash Bin Button */}
      <Link href="/dashboard/organizer/trash" className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <Button size="icon" variant="outline" className="h-12 w-12 rounded-none border-4 border-black bg-white hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_var(--brutal-shadow)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none" title="Trash Bin">
          <Trash2 className="h-6 w-6" strokeWidth={3} />
          <span className="sr-only">Trash Bin</span>
        </Button>
      </Link>
    </div>
  );
}
