'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';
import { joinEvent } from '@/actions/events';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type JoinButtonProps = {
  eventId: string;
  isLoggedIn: boolean;
  hasJoined: boolean;
  isFull: boolean;
  price: number;
  userId?: string;
};

export default function JoinButton({ eventId, isLoggedIn, hasJoined, isFull, price, userId }: JoinButtonProps) {
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleJoinClick = async () => {
    if (!isLoggedIn || !userId) {
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    setIsJoining(true);

    const result = await joinEvent(eventId, userId);

    if (result.success) {
      toast({
        title: "Success!",
        description: "You have successfully booked your ticket.",
      });
      router.push('/dashboard/attendee');
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not book ticket. Please try again.",
        variant: "destructive",
      });
    }

    setIsJoining(false);
  };

  return (
    <Button 
      size="lg" 
      className="w-full font-black uppercase text-lg h-16 rounded-none border-4 border-black bg-brutalRed text-black hover:bg-brutalRed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
      onClick={handleJoinClick} 
      disabled={isJoining || hasJoined || (isFull && !hasJoined)}
    >
      <Ticket className="mr-2 h-6 w-6" strokeWidth={3}/>
      {hasJoined 
        ? "Already Joined" 
        : isJoining 
          ? 'Joining...' 
          : isFull
            ? 'Event Full'
            : (price > 0 ? `Buy Ticket (₹${price})` : 'Join Event Free')
      }
    </Button>
  );
}
