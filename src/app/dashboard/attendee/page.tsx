import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, CheckCircle, MapPin, Ticket, AlertCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getJoinedEvents } from "@/actions/attendee";
import CopyCodeButton from "./CopyCodeButton";
import DeleteTicketButton from "./DeleteTicketButton";

export const revalidate = 0;

export default async function AttendeeDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const enrichedEvents = await getJoinedEvents(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-8 border-brutalPurple pl-6">
        <div>
            <h1 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-5xl flex items-center gap-2 text-black"><Ticket className="h-10 w-10" strokeWidth={3}/> My Tickets</h1>
            <p className="text-black font-bold text-lg mt-2">Your upcoming events and digital entry tickets.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {enrichedEvents.map((event) => {
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${event.attendeeInfo?.verificationCode}&bgcolor=23152E&color=ffffff&qzone=1`;
            const verificationCode = event.attendeeInfo?.verificationCode;
            const status = event.attendeeInfo?.status;
            const ticketId = event.attendeeInfo?.id;
            
            return (
          <Card key={event.id} className="rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row overflow-hidden text-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
            <div className="p-6 flex-1 flex flex-col min-w-0">
              <CardHeader className="p-0 mb-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="w-fit rounded-none border-2 border-black bg-brutalBlue text-black font-black uppercase">{event.category}</Badge>
                        {event.status === 'cancelled' && (
                            <Badge variant="outline" className="w-fit rounded-none border-2 border-black bg-brutalRed text-white font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-dashed rotate-2 scale-105">EVENT CANCELLED</Badge>
                        )}
                        {event.status === 'completed' && (
                            <Badge variant="outline" className="w-fit rounded-none border-2 border-black bg-brutalGreen text-black font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2 scale-105">COMPLETED</Badge>
                        )}
                    </div>
                    {ticketId && <DeleteTicketButton attendeeId={ticketId} />}
                </div>
                <CardTitle className={`transition-colors w-fit text-2xl font-black uppercase tracking-tight ${event.status === 'cancelled' ? 'line-through opacity-70' : 'hover:bg-brutalYellow'}`}>
                  <Link href={`/events/${event.id}`}>{event.title}</Link>
                </CardTitle>
                <CardDescription className="flex items-center gap-2 pt-2 text-black font-bold">
                  <Calendar className="h-5 w-5" strokeWidth={3} />
                  {format(new Date(event.dateTime), "EEEE, MMM d, yyyy 'at' p")}
                </CardDescription>
                <CardDescription className="flex items-center gap-2 text-black font-bold mt-1">
                  <MapPin className="h-5 w-5" strokeWidth={3} />
                  {event.venue}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 mt-auto">
                 {verificationCode && status === 'approved' && event.status !== 'cancelled' && (
                    <div className="mt-4">
                        <p className="text-sm font-black uppercase">Your Verification Code:</p>
                        <div className="flex items-center gap-2 mt-2">
                             <Badge variant="secondary" className="text-sm sm:text-base tracking-wider font-mono truncate rounded-none border-2 border-black bg-brutalGreen text-black py-1 px-3" title={verificationCode}>{verificationCode}</Badge>
                             <CopyCodeButton code={verificationCode} />
                        </div>
                    </div>
                )}
                {status === 'pending_registration' && (
                    <div className="mt-4 p-3 bg-brutalYellow border-2 border-black font-bold text-sm">
                        <AlertCircle className="inline h-4 w-4 mr-1" /> Your registration is pending approval from the organizer.
                    </div>
                )}
                {status === 'rejected' && (
                    <div className="mt-4 p-3 bg-brutalRed border-2 border-black font-bold text-sm text-white">
                        <XCircle className="inline h-4 w-4 mr-1" /> Your registration was not approved.
                    </div>
                )}
              </CardContent>
            </div>
            <div className={`p-6 flex flex-col items-center justify-center border-t-4 border-black md:border-t-0 md:border-l-4 border-black shrink-0 ${event.status === 'cancelled' || status === 'rejected' ? 'bg-muted' : status === 'pending_registration' ? 'bg-orange-300' : 'bg-brutalYellow'}`}>
               <div className={`flex items-center gap-2 font-black uppercase text-lg border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                    event.status === 'cancelled' ? 'bg-brutalRed text-white rotate-2 border-dashed scale-105' : 
                    status === 'rejected' ? 'bg-brutalRed text-white rotate-2 border-dashed scale-105' :
                    status === 'checked_in' ? 'bg-gray-300 text-black' : 
                    status === 'approved' ? 'bg-brutalGreen text-black -rotate-2 scale-105' : 
                    'bg-brutalYellow text-black -rotate-2 scale-105'
               }`}>
                    {event.status === 'cancelled' ? <span>CANCELLED</span> : 
                     status === 'rejected' ? <span>REJECTED</span> :
                     status === 'checked_in' ? <><CheckCircle className="h-5 w-5 text-black" strokeWidth={3}/><span>Checked In</span></> : 
                     status === 'approved' ? <><CheckCircle className="h-5 w-5" strokeWidth={3} /><span>CONFIRMED</span></> : 
                     <><AlertCircle className="h-5 w-5" strokeWidth={3}/><span>PENDING</span></>}
                </div>
                <p className="text-sm text-black font-bold mt-2 mb-3 bg-white border-2 border-black px-2">
                    {event.price > 0 
                        ? (status === 'approved' || status === 'checked_in' ? `₹${event.price} (Paid)` : `₹${event.price} (Pending)`)
                        : (status === 'approved' || status === 'checked_in' ? "Free (Confirmed)" : "Free (Pending)")}
                </p>
                {event.status !== 'cancelled' && (status === 'approved' || status === 'checked_in') ? (
                  <>
                      <div className="relative h-32 w-32 rounded-none border-4 border-black overflow-hidden bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <img src={qrCodeUrl} alt="QR Code" loading="lazy" decoding="async" className="w-full h-full object-contain" />
                        {status === 'checked_in' && (
                           <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                               <span className="font-black uppercase text-gray-800 rotate-[-15deg] text-xl border-4 border-gray-800 p-1">USED</span>
                           </div>
                        )}
                      </div>
                      <p className="mt-3 text-xs font-black uppercase tracking-wider text-black">Scan for entry</p>
                  </>
                ) : (
                  <div className="h-32 w-32 flex flex-col items-center justify-center border-4 border-black bg-gray-200 p-2 text-center">
                      <span className="font-black uppercase text-gray-500 text-sm">
                          {status === 'pending_registration' ? 'Awaiting Approval' : status === 'rejected' ? 'Rejected' : 'INVALID'}
                      </span>
                  </div>
                )}
            </div>
          </Card>
        )})}
      </div>
      
      {enrichedEvents.length === 0 && (
        <Card className="rounded-none border-4 border-black bg-white p-12 shadow-brutal text-center">
            <CardContent>
                <Ticket className="h-16 w-16 text-black mx-auto mb-4" strokeWidth={3}/>
                <h3 className="text-2xl font-black uppercase text-black">No upcoming events</h3>
                <p className="text-black font-bold mt-2 max-w-sm mx-auto">You haven't joined any events yet. When you do, your tickets will appear here.</p>
                <Button asChild className="mt-8 rounded-none border-4 border-black bg-brutalGreen text-black font-black uppercase hover:bg-brutalGreen hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all h-12 px-8">
                    <Link href="/#events">Explore Events</Link>
                </Button>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
