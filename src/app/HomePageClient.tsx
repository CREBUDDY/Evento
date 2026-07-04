"use client";
import Link from 'next/link';
import InteractiveBlock from '@/components/interactive-block';
import {
  ArrowRight,
  Filter,
  Search,
  Ticket,
  Users,
  CalendarPlus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EventCard from '@/components/event-card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useMemo } from 'react';

const featureCards = [
  {
    icon: <CalendarPlus className="w-10 h-10 text-black" />,
    title: 'Effortless Event Creation',
    description: 'Create and publish your events in minutes. No technical skills required.',
    color: 'bg-brutalRed'
  },
  {
    icon: <Ticket className="w-10 h-10 text-black" />,
    title: 'Seamless Tickets',
    description: 'Manage attendees, track ticket sales, and handle check-ins effortlessly.',
    color: 'bg-brutalYellow'
  },
  {
    icon: <Users className="w-10 h-10 text-black" />,
    title: 'Engage Community',
    description: 'Connect with your audience, send updates, and gather feedback.',
    color: 'bg-brutalBlue'
  }
];

export default function HomePageClient({ allEvents }: { allEvents: any[] }) {

  const publishedEvents = useMemo(() => {
    if (!allEvents) return [];
    return allEvents
      .filter(event => event.status === 'published')
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [allEvents]);

  const freeEvents = useMemo(() => {
    return publishedEvents.filter(event => event.price === 0);
  }, [publishedEvents]);

  const paidEvents = useMemo(() => {
    return publishedEvents.filter(event => event.price > 0);
  }, [publishedEvents]);

  return (
    <div className="flex flex-col mb-16 md:mb-24 w-full">
      {/* Brutalist Hero Section with Grid */}
      <section className="relative w-full border-b-4 border-black overflow-hidden bg-brutalBg pt-20 pb-32 md:pt-32 md:pb-48">
        {/* Wireframe Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{
               backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
        
        {/* Floating Colored Blocks */}
        <InteractiveBlock initialColorClass="bg-brutalBlue" className="absolute top-[20%] right-[15%] w-[40px] h-[40px] z-0" />
        <InteractiveBlock initialColorClass="bg-brutalYellow" className="absolute top-[40%] right-[25%] w-[40px] h-[40px] z-0" />
        <InteractiveBlock initialColorClass="bg-brutalPurple" className="absolute top-[10%] right-[5%] w-[40px] h-[40px] z-0 hidden md:block" />
        <InteractiveBlock initialColorClass="bg-brutalOrange" className="absolute bottom-[20%] right-[35%] w-[40px] h-[40px] z-0" />
        <InteractiveBlock initialColorClass="bg-brutalRed" className="absolute bottom-[10%] right-[20%] w-[40px] h-[40px] z-0" />

        <div className="container relative z-10 flex flex-col items-start text-left">
           <h1 className="font-display font-black text-5xl sm:text-7xl md:text-[9rem] leading-[0.85] tracking-tighter text-black uppercase mb-6 drop-shadow-sm break-words hyphens-auto w-full">
            evento.
          </h1>
          <p className="max-w-xl text-lg md:text-2xl font-bold text-black border-l-4 border-black pl-4 mb-10 bg-white/50 backdrop-blur-sm p-4 w-full">
            The ultimate platform for college societies and organizations to create, manage, and experience events in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto pr-2 pb-2">
             <Button size="lg" className="w-full sm:w-auto text-xl h-16 px-6 sm:px-10 rounded-none bg-brutalRed hover:bg-brutalRed text-black border-4 border-black shadow-brutal transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none uppercase font-black" asChild>
                <Link href="/explore">Explore Events</Link>
             </Button>
             <Button size="lg" className="w-full sm:w-auto text-xl h-16 px-6 sm:px-10 rounded-none bg-brutalYellow hover:bg-brutalYellow text-black border-4 border-black shadow-brutal transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none uppercase font-black" asChild>
                <Link href="/creato">Create Event</Link>
             </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 border-b-4 border-black">
         <div className="mb-16">
            <h2 className="font-headline text-5xl md:text-7xl font-black uppercase text-black mb-6">
              Your Vision,<br/>Our Platform.
            </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featureCards.map((feature, i) => (
                <Card key={feature.title} className={`h-full ${feature.color} rounded-none border-4 border-black text-black shadow-brutal transition-all hover:translate-x-[6px] hover:translate-y-[6px] hover:shadow-none`}>
                  <CardHeader className="border-b-4 border-black bg-white">
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-black">0{i+1}</span>
                        {feature.icon}
                    </div>
                    <CardTitle className="text-2xl font-black uppercase mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 font-bold text-lg leading-tight">
                    {feature.description}
                  </CardContent>
                </Card>
            ))}
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="container py-20 bg-white">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
            <h2 className="font-headline text-5xl md:text-7xl font-black uppercase text-black">
              Upcoming<br/>Events
            </h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-[300px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black h-5 w-5 font-black" />
                <Input placeholder="Search events..." className="pl-12 h-14 rounded-none border-4 border-black bg-brutalBg text-black font-bold focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" />
              </div>
              <Button asChild className="h-14 rounded-none border-4 border-black bg-brutalPurple hover:bg-brutalPurple text-black shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all hidden sm:flex font-black uppercase">
                <Link href="/explore">
                    <Filter className="mr-2 h-5 w-5" />
                    Filters
                </Link>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <div className="mb-12 border-b-4 border-black pb-4 overflow-x-auto">
              <TabsList className="bg-transparent flex w-max space-x-2 sm:space-x-4 p-0">
                <TabsTrigger value="all" className="rounded-none border-4 border-black bg-white px-6 py-2 sm:px-8 sm:py-3 font-black uppercase text-black data-[state=active]:bg-brutalGreen data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm sm:text-base">All</TabsTrigger>
                <TabsTrigger value="free" className="rounded-none border-4 border-black bg-white px-6 py-2 sm:px-8 sm:py-3 font-black uppercase text-black data-[state=active]:bg-brutalGreen data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm sm:text-base">Free</TabsTrigger>
                <TabsTrigger value="paid" className="rounded-none border-4 border-black bg-white px-6 py-2 sm:px-8 sm:py-3 font-black uppercase text-black data-[state=active]:bg-brutalGreen data-[state=active]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm sm:text-base">Paid</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all" className="mt-0 outline-none">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {publishedEvents && publishedEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {publishedEvents?.length === 0 && <p className="text-black font-bold text-center py-12 border-4 border-black bg-brutalBg text-2xl uppercase">No events found.</p>}
            </TabsContent>
            
            <TabsContent value="free" className="mt-0 outline-none">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {freeEvents && freeEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {freeEvents?.length === 0 && <p className="text-black font-bold text-center py-12 border-4 border-black bg-brutalBg text-2xl uppercase">No free events found.</p>}
            </TabsContent>
            
            <TabsContent value="paid" className="mt-0 outline-none">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paidEvents && paidEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
              {paidEvents?.length === 0 && <p className="text-black font-bold text-center py-12 border-4 border-black bg-brutalBg text-2xl uppercase">No paid events found.</p>}
            </TabsContent>
          </Tabs>
      </section>
      
    </div>
  );
}
