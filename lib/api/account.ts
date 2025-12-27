"use server"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import axios from "axios";
import { apiFetch } from "../api";


interface ProfileData {
    fullName: string;
    contact: string;
    email: string;
}

// Create new address
export async function createProfile(profileData:ProfileData): Promise<ProfileData> {
  try {
    const {isAuthenticated, getUser} = await getKindeServerSession();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      throw new Error("User is not authenticated");
    }
    const user = await getUser();
    if (!user?.id) {
      throw new Error("User ID is missing");
    }

    const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/accounts/${user.id}`, {
        ...profileData
    });

    if (!response.status || response.status !== 200) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Failed to create address:", error);
    throw error;
  }
}


// Fetch all addresses for a user
export async function fetchProfile(): Promise<ProfileData> {
  try {
    const {isAuthenticated, getUser} = await getKindeServerSession();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      throw new Error("User is not authenticated");
    }
    const user = await getUser();
    if (!user?.id) {
      throw new Error("User ID is missing");
    }
    const userId = user.id;
    const data = await apiFetch<ProfileData>(
      `/accounts/${userId}`,
      { tags: ["fetchedaccount"] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, returning empty addresses:", error);
    return {fullName:'', contact:'', email:''};
  }
}