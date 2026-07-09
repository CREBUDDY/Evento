"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { fetchNotifications, markNotificationsAsRead } from "@/actions/notifications";
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
import { createClient } from "@/lib/supabase/client";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  link: string | null;
  createdAt: Date;
};

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { soundEnabled, triggerHaptic, playNotificationSound, pushNotificationsEnabled } = useSettings();
  
  const fetchedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const loadNotifications = async (isInitialLoad = false) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || "";
      if (user?.id) setCurrentUserId(user.id);
      
      const { notifications: fetchedNotifs, unreadCount: fetchedUnread } = await fetchNotifications(userId);
      
      if (fetchedNotifs) {
        setNotifications(fetchedNotifs);
        setUnreadCount(fetchedUnread);
        
        if (!isInitialLoad) {
          // Check for strictly new notifications that weren't in the previous fetch
          const newNotifs = fetchedNotifs.filter(n => !fetchedIds.current.has(n.id) && new Date(n.createdAt).getTime() > Date.now() - 60000);
          
          if (newNotifs.length > 0) {
             const latest = newNotifs[0];
             // Play sounds and haptics
             if (soundEnabled) playNotificationSound();
             triggerHaptic();
             
             // Native Push Notification
             if (pushNotificationsEnabled && "Notification" in window && Notification.permission === "granted") {
               if ('serviceWorker' in navigator) {
                 navigator.serviceWorker.ready.then(registration => {
                   registration.showNotification(latest.title, {
                     body: latest.message,
                     icon: '/favicon.ico',
                   });
                 });
               } else {
                 new Notification(latest.title, {
                   body: latest.message,
                   icon: '/favicon.ico',
                 });
               }
             }

             // In-app toast
             toast({
               title: latest.title,
               description: latest.message,
               className: "bg-brutalPurple text-white border-4 border-black",
             });
          }
        }
        
        // Update known IDs
        fetchedIds.current = new Set(fetchedNotifs.map(n => n.id));
      }
    };

    loadNotifications(true); // Initial load

    intervalId = setInterval(() => {
      loadNotifications(false);
    }, 15000); // Poll every 15 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [soundEnabled, triggerHaptic, playNotificationSound, pushNotificationsEnabled, toast]);

  const handleOpenChange = async (open: boolean) => {
    if (open) {
      if (unreadCount > 0) {
        setUnreadCount(0);
        if (currentUserId) {
           await markNotificationsAsRead(currentUserId);
        }
      }
    } else {
      // Immediately clear visual cache when dropdown closes
      setNotifications([]);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-none border-2 border-black bg-brutalYellow hover:bg-brutalYellow shadow-[2px_2px_0px_0px_var(--brutal-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all p-0">
          <Bell className="h-5 w-5 text-black" strokeWidth={3} />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-brutalRed text-xs font-black text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 rounded-none border-4 border-black bg-white shadow-[4px_4px_0px_0px_var(--brutal-shadow)] p-0" align="end" forceMount>
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
                  <Link href={notif.link || "#"}>
                    <p className="font-black uppercase text-black mb-1 line-clamp-1">{notif.title}</p>
                    <p className="text-sm text-gray-700 font-bold mb-2 line-clamp-2">
                        {notif.message}
                    </p>
                    <p className="text-xs text-gray-500 font-bold">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
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
