"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/event-card';
import { EventCategory } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categories: (EventCategory | 'All')[] = ['All', 'Cultural', 'Hackathon', 'Party', 'Tech', 'Sports', 'Workshop', 'AI', 'Gaming', 'Other'];

export default function ExploreClient({ allEvents }: { allEvents: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'All'>('All');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [locationQuery, setLocationQuery] = useState('');

  const publishedEvents = useMemo(() => {
    return (allEvents || []).filter(e => e.status === 'published');
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    return publishedEvents.filter((event) => {
      // Name Search
      if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Category Filter
      if (categoryFilter !== 'All' && event.category !== categoryFilter) {
        return false;
      }
      // Location Filter
      if (locationQuery && !event.venue.toLowerCase().includes(locationQuery.toLowerCase()) && !event.venueAddress.toLowerCase().includes(locationQuery.toLowerCase())) {
        return false;
      }
      // Price Filter
      if (priceFilter === 'free' && event.price > 0) return false;
      if (priceFilter === 'paid' && event.price === 0) return false;
      
      return true;
    }).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [publishedEvents, searchQuery, categoryFilter, locationQuery, priceFilter]);

  return (
    <div className="min-h-screen bg-brutalBg pb-24 relative overflow-hidden">
        {/* Wireframe Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{
               backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
             }}>
        </div>
        
        {/* Header Section */}
        <div className="bg-brutalPurple border-b-8 border-black pt-24 pb-12 relative z-10">
            <div className="container">
                <h1 className="font-headline text-5xl md:text-7xl font-black uppercase text-black drop-shadow-sm">Explore Events</h1>
                <p className="text-black font-bold text-xl mt-4 border-l-4 border-black pl-4 bg-white/50 backdrop-blur-sm p-2 w-fit">Find exactly what you're looking for.</p>
            </div>
        </div>

        <div className="container mt-8 relative z-10 flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="w-full lg:w-1/4 space-y-6">
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="font-black uppercase text-2xl flex items-center gap-2 mb-6 border-b-4 border-black pb-2 text-black"><Filter strokeWidth={3}/> Filters</h2>
                    
                    <div className="space-y-6">
                        {/* Search Name */}
                        <div className="space-y-2">
                            <label className="font-black uppercase text-sm text-black">Search Name</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black h-5 w-5" strokeWidth={3} />
                                <Input 
                                    placeholder="e.g. Hackathon..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-12 rounded-none border-4 border-black bg-brutalBg font-bold text-black focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                />
                            </div>
                        </div>

                        {/* Search Location */}
                        <div className="space-y-2">
                            <label className="font-black uppercase text-sm text-black">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-black h-5 w-5" strokeWidth={3} />
                                <Input 
                                    placeholder="City or Venue..." 
                                    value={locationQuery}
                                    onChange={(e) => setLocationQuery(e.target.value)}
                                    className="pl-10 h-12 rounded-none border-4 border-black bg-brutalBg font-bold text-black focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="font-black uppercase text-sm text-black">Category</label>
                            <Select value={categoryFilter} onValueChange={(val: any) => setCategoryFilter(val)}>
                                <SelectTrigger className="w-full rounded-none border-4 border-black bg-white h-12 font-bold text-black focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                                    <SelectValue placeholder="All Categories" />
                                </SelectTrigger>
                                <SelectContent className="rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat} className="font-bold cursor-pointer hover:bg-brutalYellow focus:bg-brutalYellow rounded-none">
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Price Type */}
                        <div className="space-y-2">
                            <label className="font-black uppercase text-sm text-black">Ticket Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                <Button 
                                    variant={priceFilter === 'all' ? 'default' : 'outline'}
                                    onClick={() => setPriceFilter('all')}
                                    className={`rounded-none border-4 border-black font-black uppercase transition-all ${priceFilter === 'all' ? 'bg-black text-white' : 'bg-white text-black hover:bg-brutalYellow hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
                                >
                                    All
                                </Button>
                                <Button 
                                    variant={priceFilter === 'free' ? 'default' : 'outline'}
                                    onClick={() => setPriceFilter('free')}
                                    className={`rounded-none border-4 border-black font-black uppercase transition-all ${priceFilter === 'free' ? 'bg-brutalGreen text-black' : 'bg-white text-black hover:bg-brutalGreen hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
                                >
                                    Free
                                </Button>
                                <Button 
                                    variant={priceFilter === 'paid' ? 'default' : 'outline'}
                                    onClick={() => setPriceFilter('paid')}
                                    className={`rounded-none border-4 border-black font-black uppercase transition-all ${priceFilter === 'paid' ? 'bg-brutalBlue text-black' : 'bg-white text-black hover:bg-brutalBlue hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'}`}
                                >
                                    Paid
                                </Button>
                            </div>
                        </div>

                        {/* Reset Filters */}
                        <Button 
                            onClick={() => {
                                setSearchQuery('');
                                setLocationQuery('');
                                setCategoryFilter('All');
                                setPriceFilter('all');
                            }}
                            className="w-full mt-4 rounded-none border-4 border-black bg-brutalRed text-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all h-12"
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="w-full lg:w-3/4">
                <div className="mb-6 flex justify-between items-center bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="font-black uppercase text-xl text-black">Results</h2>
                    <span className="font-bold text-black bg-brutalYellow border-2 border-black px-3 py-1">{filteredEvents.length} Events Found</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-20 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="font-headline text-3xl font-black uppercase mb-4 text-black">No Matches Found</h3>
                        <p className="font-bold text-lg">Try adjusting your filters to see more events.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
