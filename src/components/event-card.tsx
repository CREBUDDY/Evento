import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, MapPin, Ticket } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: any;
  className?: string;
}

export default function EventCard({ event, className }: EventCardProps) {
  // Randomly assign one of the brutal colors for the card background
  const colors = ['bg-brutalRed', 'bg-brutalYellow', 'bg-brutalBlue', 'bg-brutalGreen', 'bg-brutalPurple', 'bg-brutalOrange'];
  const hash = event.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const color = colors[hash % colors.length];

  return (
    <Link href={`/events/${event.id}`}>
      <Card className={cn(`rounded-none h-full flex flex-col group transition-all duration-200 border-4 border-black shadow-brutal hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none ${color}`, className)}>
        <CardHeader className="p-0 border-b-4 border-black bg-white">
          <div className="relative h-48 w-full overflow-hidden">
            {event.imageUrl ? (
                <img
                src={event.imageUrl}
                alt={event.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
            ) : (
                <div className="w-full h-full bg-brutalBg flex items-center justify-center">
                    <span className="text-black font-black uppercase tracking-widest opacity-50">evento.</span>
                </div>
            )}
            <div className="absolute top-4 right-4">
              <Badge className="rounded-none border-2 border-black bg-white text-black font-black uppercase text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {event.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <CardTitle className="text-2xl font-black uppercase text-black mb-4 line-clamp-2">{event.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-black font-bold mb-2 text-sm uppercase">
              <Calendar className="h-4 w-4" />
              {format(new Date(event.dateTime), "MMM d, yyyy")}
            </CardDescription>
            <CardDescription className="flex items-center gap-2 text-black font-bold text-sm uppercase">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{event.venue}</span>
            </CardDescription>
          </div>
        </CardContent>
        <CardFooter className="p-0 border-t-4 border-black bg-white">
            <div className="w-full flex items-center justify-between p-4">
                <span className="font-black text-xl text-black">
                    {event.price === 0 ? "FREE" : `₹${event.price}`}
                </span>
                <span className="font-bold flex items-center gap-2 text-black uppercase text-sm group-hover:underline">
                    View Details <Ticket className="w-4 h-4"/>
                </span>
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
