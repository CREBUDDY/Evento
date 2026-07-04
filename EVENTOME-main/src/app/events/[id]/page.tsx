import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, DollarSign, MapPin, Users, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import EventCard from '@/components/event-card';
import { getEventById, getRelatedEvents, checkIsAttendee } from '@/actions/events';
import { createClient } from '@/lib/supabase/server';
import JoinButton from './JoinButton';
import ShareButton from './ShareButton';

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
    <div className="bg-brutalBg min-h-screen pb-24 overflow-x-hidden">
        {/* Marquee Banner */}
        <div className="bg-black text-white py-3 border-b-8 border-black flex whitespace-nowrap w-[200%] overflow-hidden relative">
            <div className="animate-marquee font-black uppercase tracking-widest text-xl inline-block w-full">
                <span>⚡ SECURE YOUR TICKETS NOW ⚡ {event.title} ⚡ DON'T MISS OUT ⚡ SECURE YOUR TICKETS NOW ⚡ {event.title} ⚡ DON'T MISS OUT ⚡ </span>
                <span>⚡ SECURE YOUR TICKETS NOW ⚡ {event.title} ⚡ DON'T MISS OUT ⚡ SECURE YOUR TICKETS NOW ⚡ {event.title} ⚡ DON'T MISS OUT ⚡ </span>
                <span>⚡ SECURE YOUR TICKETS NOW ⚡ {event.title} ⚡ DON'T MISS OUT ⚡ SECURE YOUR TICKETS NOW ⚡ {event.title} ⚡ DON'T MISS OUT ⚡ </span>
            </div>
        </div>

        <div className="container pt-8 md:pt-12">
            <Button variant="outline" asChild className="mb-12 rounded-none border-4 border-black bg-white text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none hover:bg-brutalYellow transition-all">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={3} />
                    Back to Events
                </Link>
            </Button>
            
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-16">
                    
                    {/* Hero Image Block */}
                    <div className="relative rounded-none border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-brutalBlue p-2 group">
                        <div className="relative w-full h-[350px] md:h-[500px] border-4 border-black overflow-hidden bg-white">
                            {event.imageUrl ? (
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <span className="font-black text-4xl text-gray-400">NO IMAGE</span>
                                </div>
                            )}
                            {/* Decorative Tape */}
                            <div className="absolute -top-4 -left-4 w-24 h-8 bg-white/80 rotate-[-15deg] border border-gray-300 backdrop-blur-sm shadow-sm"></div>
                            <div className="absolute -bottom-4 -right-4 w-24 h-8 bg-white/80 rotate-[-15deg] border border-gray-300 backdrop-blur-sm shadow-sm"></div>
                        </div>
                        
                        {/* Overlapping Title Badge */}
                        <div className="absolute -bottom-10 md:-bottom-12 -right-4 md:-right-8 z-10 max-w-[95%]">
                            <div className="bg-brutalYellow border-8 border-black p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 group-hover:rotate-0 transition-transform duration-300">
                                <h1 className="font-headline text-3xl md:text-5xl lg:text-6xl font-black uppercase text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)] leading-none tracking-tight">{event.title}</h1>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 md:pt-12"></div> {/* Spacing for the overlapping title */}

                    {/* About Block */}
                    <Card className="relative rounded-none border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
                        {/* Target Audience Badge overlapping top left */}
                        <div className="absolute -top-5 -left-5 bg-brutalBlue text-white font-black uppercase px-4 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-3 flex items-center">
                            <Target className="w-5 h-5 mr-2" strokeWidth={3} /> {event.targetAudience}
                        </div>
                        <CardContent className="p-8 md:p-12 mt-4">
                            <h2 className="font-headline text-3xl font-black uppercase mb-6 bg-black text-white inline-block px-4 py-2 border-2 border-transparent rotate-1">About this Event</h2>
                            <p className="text-black font-bold text-lg md:text-xl leading-relaxed whitespace-pre-wrap">{event.description}</p>
                        </CardContent>
                    </Card>

                    {/* Organizer Block */}
                    <Card className="rounded-none border-4 border-black bg-brutalGreen shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none relative overflow-hidden">
                        {/* Decorative background shape */}
                        <div className="absolute -right-10 -top-10 text-9xl text-black opacity-10 font-black rotate-12 select-none pointer-events-none">HOST</div>
                        <CardContent className="p-8 md:p-12 relative z-10">
                            <h2 className="font-headline text-3xl font-black uppercase mb-8 border-b-8 border-black pb-2 inline-block">Presented By</h2>
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 bg-white p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-none border-4 border-black">
                                    <AvatarImage src={event.organizer.photoURL || ''} alt={event.organizer.displayName} />
                                    <AvatarFallback className="bg-brutalYellow rounded-none text-black font-black uppercase text-4xl">{event.organizer.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="text-center sm:text-left flex flex-col justify-center h-full pt-2">
                                    <h3 className="text-3xl font-black uppercase">{event.organizer.displayName}</h3>
                                    <div className="mt-4">
                                        <p className="text-sm font-bold bg-black text-white px-3 py-1 inline-block uppercase tracking-widest border-2 border-transparent">Official Organizer</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Ticket Stub Area */}
                <div className="lg:col-span-4 space-y-8 mt-16 lg:mt-0">
                    
                    {/* The Ticket Stub */}
                    <div className="relative bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all hover:-translate-y-2 hover:shadow-[12px_20px_0px_0px_rgba(0,0,0,1)] duration-300">
                        
                        {/* Top Cutout details */}
                        <div className="bg-brutalRed text-black border-b-4 border-black border-dashed p-6 text-center relative">
                            {/* Circle cutouts for ticket look */}
                            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-brutalBg rounded-full border-4 border-black border-l-0"></div>
                            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-brutalBg rounded-full border-4 border-black border-r-0"></div>
                            
                            <h3 className="font-headline font-black uppercase text-3xl tracking-widest text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">ADMIT ONE</h3>
                            <p className="font-bold text-sm mt-2 uppercase bg-black text-white px-2 py-1 inline-block">General Admission</p>
                        </div>
                        
                        <div className="p-8 space-y-8 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]">
                            
                            <div className="flex items-start gap-5">
                                <div className="bg-brutalYellow border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-3deg]">
                                    <Calendar className="h-8 w-8 text-black" strokeWidth={3}/>
                                </div>
                                <div className="pt-1">
                                    <p className="font-black uppercase text-xl leading-none">{format(new Date(event.dateTime), 'EEEE, MMM d')}</p>
                                    <p className="text-base font-bold text-gray-700 mt-2">{format(new Date(event.dateTime), 'h:mm a')}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-5">
                                <div className="bg-brutalBlue border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[2deg] text-white">
                                    <MapPin className="h-8 w-8" strokeWidth={3}/>
                                </div>
                                <div className="pt-1">
                                    <p className="font-black uppercase text-xl leading-none">{event.venue}</p>
                                    <p className="text-sm font-bold text-gray-600 mt-2">{event.venueAddress}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-5">
                                <div className="bg-brutalGreen border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg]">
                                    <DollarSign className="h-8 w-8 text-black" strokeWidth={3}/>
                                </div>
                                <div className="pt-1">
                                    <p className="font-black uppercase text-3xl leading-none">{event.price === 0 ? 'FREE' : `₹${event.price}`}</p>
                                    <p className="text-sm font-bold uppercase mt-2 text-gray-600 tracking-wider">Entry Fee</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-5">
                                <div className="bg-brutalOrange border-4 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[3deg]">
                                    <Users className="h-8 w-8 text-black" strokeWidth={3}/>
                                </div>
                                <div className="w-full pt-1">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <p className="font-black uppercase text-2xl leading-none">{event.capacity - attendeesCount}</p>
                                        <p className="text-xs font-bold uppercase text-gray-600">Spots Left</p>
                                    </div>
                                    <div className="w-full bg-gray-200 border-2 border-black h-4 rounded-none overflow-hidden">
                                        <div 
                                            className="bg-brutalRed h-full border-r-2 border-black transition-all duration-1000" 
                                            style={{ width: `${Math.min(100, (attendeesCount / event.capacity) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom section */}
                        <div className="border-t-4 border-black border-dashed p-8 bg-gray-100 flex flex-col items-center relative">
                            {/* Circle cutouts for ticket look */}
                            <div className="absolute -left-4 top-0 -translate-y-1/2 w-8 h-8 bg-brutalBg rounded-full border-4 border-black border-l-0 border-t-0 -rotate-45"></div>
                            <div className="absolute -right-4 top-0 -translate-y-1/2 w-8 h-8 bg-brutalBg rounded-full border-4 border-black border-r-0 border-t-0 rotate-45"></div>

                            {/* Fake Barcode */}
                            <div className="flex h-16 w-full justify-center gap-[2px] opacity-80 mb-8 px-4">
                                <div className="w-1 bg-black"></div><div className="w-2 bg-black"></div><div className="w-1 bg-black"></div><div className="w-3 bg-black"></div><div className="w-1 bg-black"></div><div className="w-4 bg-black"></div><div className="w-1 bg-black"></div><div className="w-2 bg-black"></div><div className="w-1 bg-black"></div><div className="w-2 bg-black"></div><div className="w-3 bg-black"></div><div className="w-1 bg-black"></div><div className="w-2 bg-black"></div><div className="w-1 bg-black"></div><div className="w-4 bg-black"></div><div className="w-2 bg-black"></div><div className="w-1 bg-black"></div><div className="w-2 bg-black"></div><div className="w-3 bg-black"></div>
                            </div>
                            
                            <div className="w-full space-y-4">
                                <JoinButton 
                                    eventId={event.id}
                                    isLoggedIn={!!user}
                                    userId={user?.id}
                                    hasJoined={hasJoined}
                                    isFull={isFull}
                                    price={event.price}
                                    isOrganizer={user?.id === event.organizerId}
                                />
                                <ShareButton title={event.title} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

           {relatedEvents && relatedEvents.length > 0 && (
            <div className="mt-32 border-t-8 border-black pt-16">
                <h2 className="font-headline text-4xl font-black uppercase tracking-tighter sm:text-6xl mb-16 text-black bg-brutalYellow inline-block px-6 py-3 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2">You Might Also Like</h2>
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedEvents.map(e => (
                        <EventCard key={e.id} event={e as any} />
                    ))}
                </div>
            </div>
           )}
        </div>
    </div>
  );
}