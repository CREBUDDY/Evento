"use server";

import { prisma } from "@/lib/prisma";

export async function getJoinedEvents(userId: string) {
  try {
    const attendees = await prisma.attendee.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            organizer: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return attendees.map(a => ({
      ...a.event,
      attendeeInfo: {
        id: a.id,
        verificationCode: a.verificationCode,
        verified: a.verified,
        createdAt: a.createdAt
      }
    }));
  } catch (error) {
    console.error("Failed to get joined events", error);
    return [];
  }
}
