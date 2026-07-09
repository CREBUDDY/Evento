"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { checkNewPublishedEvents } from "@/actions/notifications";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type NotificationEvent = {
  id: string;
  title: string;
  updatedAt: Date;
  organizer: {
    name: string | null;
    email: string;
  } | null;
};

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastCheckedRef = useRef<number>(Date.now());
  const { toast } = useToast();
  const { soundEnabled, triggerHaptic, playNotificationSound } = useSettings();

  useEffect(() => {
    // Poll every 15 seconds
    const interval = setInterval(async () => {
      const { events } = await checkNewPublishedEvents(lastCheckedRef.current);
      
      if (events && events.length > 0) {
        // Update last checked to the most recent event's timestamp + 1ms to avoid dupes
        const mostRecent = new Date(events[0].updatedAt).getTime();
        lastCheckedRef.current = mostRecent + 1;

        setNotifications((prev) => {
          const newMap = new Map([...events, ...prev].map(e => [e.id, e]));
          return Array.from(newMap.values()).slice(0, 10); // keep last 10
        });

        setUnreadCount((prev) => prev + events.length);

        // Play sounds and haptics for the new event(s)
        if (soundEnabled) {
          playNotificationSound();
        }
        triggerHaptic();

        // Trigger toasts
        events.forEach(event => {
          const organizerName = event.organizer?.name || event.organizer?.email?.split('@')[0] || "Someone";
          toast({
            title: "🎉 New Event Live!",
            description: `${organizerName} just published "${event.title}"`,
            className: "bg-brutalPurple text-white border-4 border-black",
          });
        });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [soundEnabled, playNotificationSound, triggerHaptic, toast]);

  const handleOpenChange = (open: boolean) => {
    if (open && unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-none border-2 border-black bg-brutalYellow hover:bg-brutalYellow shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all p-0">
          <Bell className="h-5 w-5 text-black" strokeWidth={3} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-brutalRed text-xs font-black text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-0" align="end" forceMount>
        <div className="p-3 bg-brutalPurple text-white border-b-4 border-black flex items-center justify-between">
          <DropdownMenuLabel className="font-black uppercase text-xl p-0">Notifications</DropdownMenuLabel>
          <Bell className="h-5 w-5" strokeWidth={3} />
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-6 text-center">
             <p className="text-black font-bold">You're all caught up!</p>
             <p className="text-sm text-gray-600 mt-1">We'll let you know when new events go live.</p>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notif, idx) => (
              <div key={notif.id}>
                <DropdownMenuItem asChild className="p-4 hover:bg-brutalYellow focus:bg-brutalYellow rounded-none cursor-pointer transition-colors block">
                  <Link href={`/events/${notif.id}`}>
                    <p className="font-black uppercase text-black mb-1 line-clamp-1">{notif.title}</p>
                    <p className="text-sm text-gray-700 font-bold mb-2">
                        Hosted by {notif.organizer?.name || notif.organizer?.email?.split('@')[0] || "Someone"}
                    </p>
                    <p className="text-xs text-gray-500 font-bold">
                        {formatDistanceToNow(new Date(notif.updatedAt), { addSuffix: true })}
                    </p>
                  </Link>
                </DropdownMenuItem>
                {idx < notifications.length - 1 && (
                  <DropdownMenuSeparator className="bg-black h-[2px] m-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
