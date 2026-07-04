"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserProfile(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Failed to get user profile", error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: any) {
  try {
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {
        displayName: data.displayName,
        email: data.email,
        photoURL: data.photoURL,
        college: data.college,
        profession: data.profession,
        gender: data.gender,
      },
      create: {
        id: userId,
        displayName: data.displayName,
        email: data.email,
        photoURL: data.photoURL,
        college: data.college,
        profession: data.profession,
        gender: data.gender,
      }
    });
    revalidatePath('/profile');
    return user;
  } catch (error) {
    console.error("Failed to update user profile", error);
    throw error;
  }
}
