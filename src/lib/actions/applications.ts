/*"use server";

import { db } from "@/lib/db/db";
import { applications } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";

export async function createApplication({
  name,
  logo,
  userId,
}: {
  name: string;
  logo: string;
  userId: number;
}) {
  try {
    await db.insert(applications).values({
      name,
      logo,
      userId,
      views: 0,
      updatesCount: 0,
    });

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("FULL DATABASE ERROR:");
    console.error(error);
    throw error;
  }
}

export async function getApplications() {
  try {
    const apps = await db.select().from(applications);

    return apps;
  } catch (error) {
    console.error(error);
    return [];
  }
}*/