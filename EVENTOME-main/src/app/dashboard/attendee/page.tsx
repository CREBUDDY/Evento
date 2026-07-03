import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, CheckCircle, MapPin, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getJoinedEvents } from "@/actions/attendee";
import CopyCodeButton from "./CopyCodeButton";

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
      <div className="border-l-8 border-brutalPurple pl-6">
        <h1 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-5xl flex items-center gap-2 text-black"><Ticket className="h-10 w-10" strokeWidth={3}/> My Tickets</h1>
        <p className="text-black font-bold text-lg mt-2">Your upcoming events and digital entry tickets.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {enrichedEvents.map((event) => {
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=${event.attendeeInfo?.verificationCode}&bgcolor=23152E&color=ffffff&qzone=1`;
            const verificationCode = event.attendeeInfo?.verificationCode;
            return (
          <Card key={event.id} className="rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row overflow-hidden text-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
            <div className="p-6 flex-1 flex flex-col min-w-0">
              <CardHeader className="p-0 mb-4">
                <Badge variant="outline" className="w-fit mb-2 rounded-none border-2 border-black bg-brutalBlue text-black font-black uppercase">{event.category}</Badge>
                <CardTitle className="hover:bg-brutalYellow transition-colors w-fit text-2xl font-black uppercase tracking-tight">
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
                 {verificationCode && (
                    <div className="mt-4">
                        <p className="text-sm font-black uppercase">Your Verification Code:</p>
                        <div className="flex items-center gap-2 mt-2">
                             <Badge variant="secondary" className="text-sm sm:text-base tracking-wider font-mono truncate rounded-none border-2 border-black bg-brutalGreen text-black py-1 px-3" title={verificationCode}>{verificationCode}</Badge>
                             <CopyCodeButton code={verificationCode} />
                        </div>
                    </div>
                )}
              </CardContent>
            </div>
            <div className="p-6 bg-brutalYellow flex flex-col items-center justify-center border-t-4 border-black md:border-t-0 md:border-l-4 border-black shrink-0">
               <div className="flex items-center gap-2 text-black font-black uppercase text-lg border-2 border-black bg-white px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {event.attendeeInfo?.verified ? <CheckCircle className="h-5 w-5" strokeWidth={3}/> : <Ticket className="h-5 w-5" strokeWidth={3} />}
                    <span>{event.attendeeInfo?.verified ? 'Verified' : 'Not Verified'}</span>
                </div>
                <p className="text-sm text-black font-bold mt-2 mb-3 bg-white border-2 border-black px-2">{event.price > 0 ? `₹${event.price} (Paid)` : "Free (Confirmed)"}</p>
              <div className="relative h-32 w-32 rounded-none border-4 border-black overflow-hidden bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <img src={qrCodeUrl} alt="QR Code" className="w-full h-full object-contain" />
              </div>
              <p className="mt-3 text-xs font-black uppercase tracking-wider text-black">Scan for entry</p>
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
