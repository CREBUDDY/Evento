"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getEvents() {
  try {
    return await prisma.event.findMany({
      orderBy: { dateTime: 'asc' }
    });
  } catch (error) {
    console.error("Failed to get events", error);
    return [];
  }
}

export async function getEventById(id: string) {
  try {
    return await prisma.event.findUnique({
      where: { id },
      include: { 
        organizer: true,
        _count: {
          select: { attendees: true }
        }
      }
    });
  } catch (error) {
    console.error("Failed to get event", error);
    return null;
  }
}

export async function getEventsByOrganizer(organizerId: string) {
  try {
    return await prisma.event.findMany({
      where: { organizerId },
      orderBy: { dateTime: 'desc' }
    });
  } catch (error) {
    console.error("Failed to get organizer events", error);
    return [];
  }
}

export async function getRelatedEvents(category: string, excludeId: string) {
  try {
    return await prisma.event.findMany({
      where: { 
        category,
        id: { not: excludeId }
      },
      take: 3,
      orderBy: { dateTime: 'asc' }
    });
  } catch (error) {
    console.error("Failed to get related events", error);
    return [];
  }
}

export async function createEvent(data: any) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user && user.id === data.organizerId) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Organizer',
          email: user.email,
        }
      });
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        dateTime: data.dateTime,
        venue: data.venue,
        venueAddress: data.venueAddress,
        capacity: Number(data.capacity),
        price: Number(data.price),
        targetAudience: data.targetAudience,
        imageUrl: data.imageUrl,
        organizerId: data.organizerId,
        status: data.status || 'published',
        requiresApproval: data.requiresApproval === true
      }
    });

    if (event.status === 'published') {
      try {
        await prisma.notification.create({
          data: {
            title: `🎉 New Event Live!`,
            message: `${user.user_metadata?.full_name || user.email?.split('@')[0] || 'Someone'} just published "${event.title}"`,
            type: "event",
            link: `/events/${event.id}`,
            userId: null // Global
          }
        });
      } catch(e) {
        console.error("Failed to create global notification", e);
      }
    }

    revalidatePath('/');
    revalidatePath('/dashboard/organizer');
    return event;
  } catch (error) {
    console.error("Failed to create event", error);
    throw error;
  }
}

import { createClient } from "@/lib/supabase/server";

export async function updateEvent(id: string, data: any) {
  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        dateTime: data.dateTime,
        venue: data.venue,
        venueAddress: data.venueAddress,
        capacity: Number(data.capacity),
        price: Number(data.price),
        targetAudience: data.targetAudience,
        imageUrl: data.imageUrl,
        status: data.status || 'published',
        requiresApproval: data.requiresApproval === true
      }
    });
    revalidatePath(`/events/${id}`);
    revalidatePath('/dashboard/organizer');
    revalidatePath('/dashboard/organizer/drafts');
    return event;
  } catch (error) {
    console.error("Failed to update event", error);
    throw error;
  }
}

export async function joinEvent(eventId: string, userId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      throw new Error("Unauthorized or user mismatch");
    }

    const result = await prisma.$transaction(async (tx) => {
      // 0. Ensure user exists in Prisma DB to prevent foreign key errors
      await tx.user.upsert({
        where: { id: userId },
        update: {},
        create: {
          id: userId,
          displayName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Attendee',
          email: user.email,
        }
      });

      // 1. Fetch event and check capacity
      const event = await tx.event.findUnique({
        where: { id: eventId },
        include: {
          _count: {
            select: { attendees: true }
          }
        }
      });

      if (!event) throw new Error("Event not found");
      if (event._count.attendees >= event.capacity) {
        throw new Error("Event is already full");
      }
      if (event.organizerId === userId) {
        throw new Error("You cannot join your own event");
      }

      // 2. Check if user already joined
      const existingAttendee = await tx.attendee.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId
          }
        }
      });

      if (existingAttendee) {
        throw new Error("You have already joined this event");
      }

      // 3. Create Attendee record with a shorter verification code
      // We generate an 8-character alphanumeric string.
      const shortCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      const initialStatus = event.requiresApproval ? 'pending_registration' : 'approved';
      
      const attendee = await tx.attendee.create({
        data: {
          userId,
          eventId,
          verificationCode: shortCode,
          status: initialStatus
        }
      });

      return attendee;
    });

    revalidatePath(`/events/${eventId}`);
    revalidatePath('/dashboard/attendee');
    return { success: true, attendee: result };

  } catch (error: any) {
    console.error("Failed to join event", error);
    return { success: false, error: error.message || "Could not join the event." };
  }
}

// Function to check if a user is an attendee of a specific event
export async function checkIsAttendee(eventId: string, userId: string) {
  try {
    const attendee = await prisma.attendee.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId
        }
      }
    });
    return !!attendee;
  } catch (error) {
    console.error("Failed to check attendee status", error);
    return false;
  }
}
