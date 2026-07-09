import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, AlertTriangle, MoreHorizontal, BarChart } from "lucide-react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteEventItem from "../DeleteEventItem";

export const revalidate = 0;

export default async function OrganizerTrashPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1-week Auto-Delete logic
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await prisma.event.deleteMany({
    where: {
      organizerId: user.id,
      status: { in: ['completed', 'cancelled'] },
      updatedAt: { lt: sevenDaysAgo }
    }
  });

  // Fetch only completed and cancelled events
  const trashedEvents = await prisma.event.findMany({
    where: { 
      organizerId: user.id,
      status: { in: ['completed', 'cancelled'] }
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
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col gap-4 border-l-8 border-brutalRed pl-6">
        <div>
          <h1 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-5xl text-black flex items-center gap-4">
             Trash Bin
          </h1>
          <p className="text-black font-bold text-lg mt-2">View your previously completed or cancelled events.</p>
        </div>
        <Button asChild variant="outline" className="w-fit rounded-none border-4 border-black font-black uppercase hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
          <Link href="/dashboard/organizer">
            <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={3} /> Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="bg-brutalRed border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-start gap-4">
        <AlertTriangle className="h-8 w-8 text-white flex-shrink-0" strokeWidth={3} />
        <div>
          <h3 className="font-black uppercase text-xl text-white">Warning</h3>
          <p className="font-bold text-white text-lg">
            All events in the trash are automatically and permanently deleted after 1 week. You can review analytics for these events before they disappear.
          </p>
        </div>
      </div>

      <Card className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
        <CardHeader className="border-b-4 border-black pb-4">
          <CardTitle className="font-black uppercase text-2xl">Trashed Events</CardTitle>
          <CardDescription className="font-bold text-black">Events scheduled for permanent deletion.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-brutalBg">
              <TableRow className="border-b-4 border-black">
                <TableHead className="font-black uppercase text-black">Event</TableHead>
                <TableHead className="font-black uppercase text-black">Status</TableHead>
                <TableHead className="hidden md:table-cell font-black uppercase text-black">Date</TableHead>
                <TableHead className="text-right font-black uppercase text-black">Attendees</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trashedEvents.map((event) => (
                <TableRow key={event.id} className="border-b-2 border-black hover:bg-red-50 transition-colors">
                  <TableCell className="font-black text-lg">{event.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-none border-2 border-black font-black uppercase text-xs ${
                      event.status === 'completed' ? 'bg-brutalGreen text-black -rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 
                      event.status === 'cancelled' ? 'bg-brutalRed text-white rotate-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-dashed' : 
                      'bg-white text-gray-500'
                    }`}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-bold">{format(new Date(event.dateTime), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right font-bold">{event._count.attendees} / {event.capacity}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="outline" className="rounded-none border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                          <MoreHorizontal className="h-5 w-5" strokeWidth={3} />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-0 bg-white">
                        <DropdownMenuLabel className="font-black uppercase bg-brutalBg border-b-2 border-black text-black">Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="rounded-none text-black focus:bg-brutalYellow focus:text-black font-bold cursor-pointer">
                            <Link href={`/dashboard/organizer/events/${event.id}/reports`}>
                                <BarChart className="h-4 w-4 mr-2" /> View Analytics
                            </Link>
                        </DropdownMenuItem>
                        <DeleteEventItem eventId={event.id} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {trashedEvents.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-black font-bold text-lg">No events in the trash bin.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
