import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Lock, BarChart2, PieChart, Users, DollarSign, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ExportButtons from "./ExportButtons";

export default async function ReportsPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const event = await prisma.event.findUnique({
    where: { id, organizerId: user.id },
    include: {
      attendees: { include: { user: true } },
      _count: {
        select: { attendees: true }
      }
    }
  });

  if (!event) {
    redirect('/dashboard/organizer');
  }

  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost" className="mb-4 text-black hover:bg-brutalYellow rounded-none border-2 border-transparent hover:border-black transition-all">
          <Link href={`/dashboard/organizer/events/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to {event.title}
          </Link>
        </Button>
        <div className="border-l-8 border-brutalGreen pl-6">
          <h1 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-4xl text-black">Event Reports & Analytics</h1>
          <p className="text-black font-bold text-lg mt-2">Detailed statistics and data exports for your event.</p>
        </div>
      </div>

      {event.status !== 'completed' ? (
        <Card className="rounded-none border-4 border-black bg-brutalBg shadow-brutal text-center py-20 px-4 text-black">
            <CardContent className="flex flex-col items-center justify-center space-y-6">
                <div className="h-24 w-24 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center rounded-full mb-2">
                    <Lock className="h-10 w-10 text-black" />
                </div>
                <CardTitle className="font-black uppercase text-3xl">Reports Locked</CardTitle>
                <CardDescription className="font-bold text-xl text-black max-w-md mx-auto">
                    Full analytics and exportable reports are only available after an event has been marked as <strong>Completed</strong>.
                </CardDescription>
                <Button asChild className="rounded-none border-4 border-black bg-brutalYellow text-black font-black uppercase hover:bg-brutalYellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all mt-4">
                    <Link href={`/dashboard/organizer/events/${id}`}>
                        Return to Dashboard
                    </Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <>
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                    <CardHeader className="border-b-4 border-black bg-brutalBlue">
                        <CardTitle className="font-black uppercase text-xl flex items-center gap-2"><Users className="h-5 w-5" /> Attendance Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                            <span className="font-bold">Total Registrations</span>
                            <span className="font-black text-xl">{event._count.attendees}</span>
                        </div>
                        <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                            <span className="font-bold">Checked In</span>
                            <span className="font-black text-xl">{event.attendees.filter(a => a.status === 'checked_in').length}</span>
                        </div>
                        <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                            <span className="font-bold">No-Shows</span>
                            <span className="font-black text-xl">{event.attendees.filter(a => a.status === 'absent').length}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                            <span className="font-bold">Rejected</span>
                            <span className="font-black text-xl">{event.attendees.filter(a => a.status === 'rejected').length}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                    <CardHeader className="border-b-4 border-black bg-brutalGreen">
                        <CardTitle className="font-black uppercase text-xl flex items-center gap-2"><DollarSign className="h-5 w-5" /> Revenue Analytics</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                            <span className="font-bold">Ticket Price</span>
                            <span className="font-black text-xl">₹{event.price.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                            <span className="font-bold">Paid Tickets</span>
                            <span className="font-black text-xl">{event._count.attendees}</span>
                        </div>
                        <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                            <span className="font-bold text-brutalRed">Refunds (Cancelled/Rejected)</span>
                            <span className="font-black text-xl">₹0</span>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                            <span className="font-bold">Gross Revenue</span>
                            <span className="font-black text-xl">₹{(event._count.attendees * event.price).toLocaleString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">
                    <CardHeader className="border-b-4 border-black bg-brutalYellow">
                        <CardTitle className="font-black uppercase text-xl flex items-center gap-2"><Activity className="h-5 w-5" /> Engagement Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                            <span className="font-bold">Attendance Rate</span>
                            <span className="font-black text-xl">
                                {event._count.attendees > 0 ? Math.round((event.attendees.filter(a => a.status === 'checked_in').length / event._count.attendees) * 100) : 0}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b-2 border-dashed border-gray-300 pb-2">
                            <span className="font-bold">Capacity Filled</span>
                            <span className="font-black text-xl">
                                {Math.round((event._count.attendees / event.capacity) * 100)}%
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card className="rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
                <CardHeader className="border-b-4 border-black pb-4">
                    <CardTitle className="font-black uppercase text-2xl">Export Data</CardTitle>
                    <CardDescription className="font-bold text-black">Download full attendee rosters and financial data in your preferred format.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ExportButtons event={event as any} />
                </CardContent>
            </Card>
        </>
      )}
    </div>
  );
}
