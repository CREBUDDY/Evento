import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, MapPin, Share2, Target, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import EventCard from '@/components/event-card';
import { getEventById, getRelatedEvents, checkIsAttendee } from '@/actions/events';
import { createClient } from '@/lib/supabase/server';
import JoinButton from './JoinButton';

export const revalidate = 0; // Ensures data is fresh

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params); // Next.js 15 requires awaiting params
  
  // 1. Fetch Event from Prisma
  const event = await getEventById(id);

  if (!event) {
    return (
        <div className="text-center py-20 flex flex-col items-center justify-center min-h-[50vh] bg-brutalBg">
            <h1 className="text-8xl font-black uppercase tracking-tighter text-black border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">404</h1>
            <p className="text-black font-bold mt-8 text-xl bg-brutalYellow border-2 border-black px-4 py-2">Event not found. It might have been moved or deleted.</p>
            <Button asChild variant="outline" className="mt-8 rounded-none border-4 border-black h-14 px-8 bg-brutalBlue text-black font-black uppercase hover:bg-brutalBlue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all">
                <Link href="/">Go Back to Events</Link>
            </Button>
        </div>
     );
  }

  // 2. Fetch User from Supabase Server Client
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Check if current user is attending
  let hasJoined = false;
  if (user) {
    hasJoined = await checkIsAttendee(id, user.id);
  }

  // 4. Fetch related events
  const relatedEvents = await getRelatedEvents(event.category, event.id);

  const attendeesCount = event._count?.attendees || 0;
  const isFull = attendeesCount >= event.capacity;

  return (
    <div className="container py-12 md:py-16 bg-brutalBg min-h-screen">
        <Button variant="outline" asChild className="mb-8 rounded-none border-4 border-black bg-white text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none hover:bg-brutalYellow transition-all">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={3} />
                Back to Events
            </Link>
        </Button>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2 space-y-8">
          <div className="relative w-full h-[400px] rounded-none overflow-hidden shadow-brutal border-4 border-black bg-white group">
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
                <h1 className="font-headline text-4xl font-black uppercase text-white md:text-5xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{event.title}</h1>
            </div>
          </div>
          
          <Card className="rounded-none border-4 border-black bg-brutalBlue shadow-brutal text-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
            <CardContent className="p-8">
              <h2 className="font-headline text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2 inline-block">About this Event</h2>
              <p className="text-black font-bold leading-relaxed whitespace-pre-wrap mt-4">{event.description}</p>
            </CardContent>
          </Card>

          <Card className="rounded-none border-4 border-black bg-brutalGreen shadow-brutal text-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
            <CardContent className="p-8">
              <h2 className="font-headline text-2xl font-black uppercase mb-4 border-b-4 border-black pb-2 inline-block">Organizer</h2>
              <div className="flex items-center gap-4 mt-4 bg-white p-4 border-4 border-black">
                 <Avatar className="h-16 w-16 rounded-none border-2 border-black">
                    <AvatarImage src={event.organizer.photoURL || ''} alt={event.organizer.displayName} />
                    <AvatarFallback className="bg-brutalBg rounded-none text-black font-black uppercase text-xl">{event.organizer.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="text-lg font-black uppercase">{event.organizer.displayName}</h3>
                    <p className="text-sm font-bold bg-brutalYellow border-2 border-black px-2 inline-block">Host of this event</p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        <div className="md:col-span-1 space-y-6">
            <Card className="rounded-none border-4 border-black bg-white shadow-brutal text-black">
                <CardContent className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                        <Calendar className="h-6 w-6 text-black mt-1" strokeWidth={3}/>
                        <div>
                            <p className="font-black uppercase">{format(new Date(event.dateTime), 'EEEE, MMMM d, yyyy')}</p>
                            <p className="text-sm font-bold">{format(new Date(event.dateTime), 'p')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-black mt-1" strokeWidth={3}/>
                        <div>
                            <p className="font-black uppercase">{event.venue}</p>
                            <p className="text-sm font-bold">{event.venueAddress}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <DollarSign className="h-6 w-6 text-black mt-1" strokeWidth={3}/>
                        <div>
                            <p className="font-black uppercase text-xl bg-brutalYellow px-2 border-2 border-black inline-block">{event.price === 0 ? 'Free Event' : `₹${event.price}`}</p>
                            <p className="text-sm font-bold mt-1">Entry Fee</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Users className="h-6 w-6 text-black mt-1" strokeWidth={3}/>
                        <div>
                            <p className="font-black uppercase text-lg">{event.capacity - attendeesCount} spots left</p>
                            <p className="text-sm font-bold bg-brutalGreen border-2 border-black px-2 mt-1">{attendeesCount} already joined</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Target className="h-6 w-6 text-black mt-1" strokeWidth={3}/>
                        <div>
                            <p className="font-black uppercase bg-brutalBlue border-2 border-black px-2 inline-block text-white">{event.targetAudience}</p>
                            <p className="text-sm font-bold mt-1">Audience</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-2">
                 <JoinButton 
                    eventId={event.id}
                    isLoggedIn={!!user}
                    userId={user?.id}
                    hasJoined={hasJoined}
                    isFull={isFull}
                    price={event.price}
                 />
                <p className="text-center text-sm font-bold text-black border-2 border-black bg-brutalYellow py-1 uppercase mt-2">Secure your spot now!</p>
            </div>
            
            <div className="flex items-center gap-2">
                <Button variant="outline" className="w-full rounded-none border-4 border-black bg-brutalBlue text-black font-black uppercase hover:bg-brutalBlue shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all h-12"><Share2 className="mr-2 h-5 w-5" strokeWidth={3}/> Share</Button>
            </div>
        </div>
      </div>
       
       {relatedEvents && relatedEvents.length > 0 && (
        <div className="mt-16 border-t-8 border-black pt-16">
            <h2 className="font-headline text-3xl font-black uppercase tracking-tighter sm:text-5xl mb-12 text-black bg-brutalRed inline-block px-4 py-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2">Related Events</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {relatedEvents.map(e => (
                    <EventCard key={e.id} event={e as any} />
                ))}
            </div>
        </div>
       )}
    </div>
  );
}