"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function cancelEvent(eventId: string, organizerId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });
    
    if (!event) throw new Error("Event not found");
    if (event.organizerId !== organizerId) throw new Error("Unauthorized to cancel this event");

    await prisma.event.update({
      where: { id: eventId },
      data: { status: 'cancelled' }
    });

    revalidatePath('/dashboard/organizer');
    revalidatePath(`/events/${eventId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Failed to cancel event", error);
    return { success: false, error: error.message || "Failed to cancel event" };
  }
}

export async function verifyAttendee(eventId: string, verificationCode: string, organizerId: string) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) throw new Error("Event not found");
    if (event.organizerId !== organizerId) throw new Error("Unauthorized to verify attendees for this event");

    const attendee = await prisma.attendee.findUnique({
      where: { verificationCode },
      include: { user: true }
    });

    if (!attendee) throw new Error("Invalid verification code");
    if (attendee.eventId !== eventId) throw new Error("Verification code is not for this event");
    if (attendee.verified) throw new Error("Attendee is already verified");

    await prisma.attendee.update({
      where: { verificationCode },
      data: { verified: true }
    });

    revalidatePath('/dashboard/organizer');
    return { success: true, attendeeName: attendee.user.displayName || attendee.user.email };
  } catch (error: any) {
    console.error("Failed to verify attendee", error);
    return { success: false, error: error.message || "Failed to verify attendee" };
  }
}
