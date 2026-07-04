"use server";

import { prisma } from "@/lib/prisma";

export async function getJoinedEvents(userId: string) {
  try {
    // Lazy cleanup: Automatic delete from db for canceled event tickets 
    // if the event was cancelled (updatedAt) more than 1 day ago.
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await prisma.attendee.deleteMany({
      where: {
        userId,
        event: {
          status: 'cancelled',
          updatedAt: {
            lt: oneDayAgo
          }
        }
      }
    });

    const attendees = await prisma.attendee.findMany({
      where: { 
        userId,
        event: {
          status: {
            not: 'draft' // Show both published and cancelled events so users know what happened
          }
        }
      },
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

export async function getEventAttendees(eventId: string, organizerId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });
    
    if (!event || event.organizerId !== organizerId) {
      throw new Error("Unauthorized");
    }

    return await prisma.attendee.findMany({
      where: { eventId },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error("Failed to get event attendees", error);
    return [];
  }
}

import { revalidatePath } from "next/cache";

export async function removeAttendee(attendeeId: string, eventId: string) {
  try {
    await prisma.attendee.delete({
      where: { id: attendeeId }
    });
    revalidatePath(`/dashboard/organizer/events/${eventId}/attendees`);
    revalidatePath('/dashboard/organizer');
    return { success: true };
  } catch (error) {
    console.error("Failed to remove attendee", error);
    return { success: false, error: "Failed to remove attendee" };
  }
}
