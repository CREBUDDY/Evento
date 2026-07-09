"use server";

import { prisma } from "@/lib/prisma";

export async function getEventNotificationDetails(eventId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
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
      }
    });

    return { event };
  } catch (error) {
    console.error("Error getting event notification details:", error);
    return { event: null };
  }
}
