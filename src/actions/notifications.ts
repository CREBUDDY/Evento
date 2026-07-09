"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function checkNewPublishedEvents(lastCheckedTimestamp: number) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Query for any events published after the last checked time
    // Exclude the current user's events if they are logged in
    const newEvents = await prisma.event.findMany({
      where: {
        status: "published",
        updatedAt: {
          gt: new Date(lastCheckedTimestamp)
        },
        // If user is logged in, don't notify them of their own events going live
        ...(user?.id ? { organizerId: { not: user.id } } : {})
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        organizer: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    return { events: newEvents };
  } catch (error) {
    console.error("Error checking new events:", error);
    return { events: [] };
  }
}
