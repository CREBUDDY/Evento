"use server";

import { prisma } from "@/lib/prisma";

export async function fetchNotifications(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastNotificationReadAt: true }
    });

    // Fetch notifications meant for this user OR global broadcasts (userId = null)
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { userId: userId },
          { userId: null }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const lastReadAt = user?.lastNotificationReadAt || new Date(0);
    const unreadCount = notifications.filter(n => n.createdAt > lastReadAt).length;

    return { notifications, unreadCount, lastReadAt };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return { notifications: [], unreadCount: 0, lastReadAt: new Date(0) };
  }
}

export async function markNotificationsAsRead(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { lastNotificationReadAt: new Date() }
    });
    return { success: true };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false };
  }
}

export async function createGlobalNotification(title: string, message: string, link?: string) {
  try {
    await prisma.notification.create({
      data: {
        title,
        message,
        link,
        type: "event",
        userId: null // Global broadcast
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating global notification:", error);
    return { success: false };
  }
}
