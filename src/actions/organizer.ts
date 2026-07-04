"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function endEvent(eventId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });
    
    if (!event) throw new Error("Event not found");
    if (event.organizerId !== user.id) throw new Error("Unauthorized to end this event");

    await prisma.event.update({
      where: { id: eventId },
      data: { status: 'completed' }
    });

    revalidatePath(`/dashboard/organizer/events/${eventId}`);
    revalidatePath('/dashboard/organizer');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to end event", error);
    return { success: false, error: error.message || "Failed to end event" };
  }
}

export async function cancelEvent(eventId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });
    
    if (!event) throw new Error("Event not found");
    if (event.organizerId !== user.id) throw new Error("Unauthorized to cancel this event");

    await prisma.event.update({
      where: { id: eventId },
      data: { status: 'cancelled' }
    });

    revalidatePath(`/dashboard/organizer/events/${eventId}`);
    revalidatePath('/dashboard/organizer');
    return { success: true };
  } catch (error: any) {
    console.error("Failed to cancel event", error);
    return { success: false, error: error.message || "Failed to cancel event" };
  }
}

export async function verifyAttendee(eventId: string, verificationCode: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) throw new Error("Event not found");
    if (event.organizerId !== user.id) throw new Error("Unauthorized to verify attendees for this event");

    const attendee = await prisma.attendee.findUnique({
      where: { verificationCode },
      include: { user: true }
    });

    if (!attendee) throw new Error("Invalid verification code");
    if (attendee.eventId !== eventId) throw new Error("Verification code is not for this event");
    if (attendee.verified) throw new Error("Attendee is already verified");
    if (attendee.status === 'rejected') throw new Error("Attendee registration was rejected");
    if (attendee.status === 'pending_registration') throw new Error("Attendee registration has not been approved yet");

    await prisma.attendee.update({
      where: { verificationCode },
      data: { verified: true, status: 'checked_in' }
    });

    revalidatePath(`/dashboard/organizer/events/${eventId}`);
    revalidatePath('/dashboard/organizer');
    return { success: true, attendeeName: attendee.user.displayName || attendee.user.email };
  } catch (error: any) {
    console.error("Failed to verify attendee", error);
    return { success: false, error: error.message || "Failed to verify attendee" };
  }
}

export async function updateAttendeeStatus(attendeeId: string, status: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
      include: { event: true }
    });

    if (!attendee) throw new Error("Attendee not found");
    if (attendee.event.organizerId !== user.id) throw new Error("Unauthorized");

    await prisma.attendee.update({
      where: { id: attendeeId },
      data: { status }
    });

    revalidatePath(`/dashboard/organizer/events/${attendee.eventId}`);
    revalidatePath(`/dashboard/organizer/events/${attendee.eventId}/approvals`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update attendee status", error);
    return { success: false, error: error.message || "Failed to update attendee status" };
  }
}

export async function bulkDeleteTickets(eventId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) throw new Error("Event not found");
    if (event.organizerId !== user.id) throw new Error("Unauthorized");
    
    if (event.status !== 'completed' && event.status !== 'cancelled') {
        throw new Error("Can only cleanup tickets for completed or cancelled events");
    }

    const result = await prisma.attendee.deleteMany({
      where: { eventId: eventId }
    });

    revalidatePath(`/dashboard/organizer/events/${eventId}`);
    return { success: true, count: result.count };
  } catch (error: any) {
    console.error("Failed to bulk delete tickets", error);
    return { success: false, error: error.message || "Failed to bulk delete tickets" };
  }
}
