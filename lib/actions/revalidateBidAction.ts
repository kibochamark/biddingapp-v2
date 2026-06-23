"use server";
import { revalidatePath } from "next/cache";

export async function revalidateBidsAction(path: string) {
    revalidatePath(path);
}