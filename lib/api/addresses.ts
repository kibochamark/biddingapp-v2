// Address API functions with caching and revalidation
"use server"
import { Address } from "../types";
import { apiFetch } from "../api";
import axios from "axios";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ADDRESS_TAGS } from "../revalidatetags";
import { revalidatePath, revalidateTag } from "next/cache";



interface CreateAddressResponse {
  status: number;
  address: Address;
}

// Fetch all addresses for a user
export async function fetchUserAddresses(userId: string): Promise<Address[]> {
  try {
    const data = await apiFetch<Address[]>(
      `/addresses?accountId=${userId}`,
      { tags: ["addresses"] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, returning empty addresses:", error);
    return [];
  }
}

// Fetch single address by ID
export async function fetchAddressById(id: string): Promise<Address | null> {
  try {
    const data = await apiFetch<Address>(
      `/addresses/${id}`,
      { tags: [ADDRESS_TAGS.all, ADDRESS_TAGS.detail(id)] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, returning null:", error);
    return null;
  }
}

// Create new address
export async function createAddress(addressData: Omit<Address, "id" | "createdAt" | "updatedAt">): Promise<CreateAddressResponse> {
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
    addressData.accountId = user.id;
 

    console.log("Creating address with data:", addressData);

    // using axios instead
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/addresses`, addressData);
    if (!res || res.status !== 201) {
      throw new Error("Failed to create address");
    }

    console.log("Create address response data:", res.data);

    // Revalidate cache after creating (using revalidateTag from next/cache instead)
    revalidatePath("/profile/addresses");

    console.log("Address created successfully:", res.data);

    return {
      status: res.status,
      address: {
        ...res.data
      }
    }
  } catch (error) {
    console.error("Failed to create address:", error);
    throw error;
  }
}

// Update existing address
export async function updateAddress(id: string, addressData: Partial<Address>): Promise<Address> {
  try {
    const {isAuthenticated} = getKindeServerSession();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      throw new Error("User is not authenticated");
    }

    console.log("Updating address with data:", addressData);

    // Using axios instead
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/addresses/${id}`,
      addressData
    );

    if (!res || res.status !== 200) {
      throw new Error("Failed to update address");
    }

    console.log("Address updated successfully:", res.data);

    // Revalidate cache after updating
    revalidateTag("addresses", "max");


    return res.data;
  } catch (error) {
    console.error("Failed to update address:", error);
    throw error;
  }
}

// Delete address
export async function deleteAddress(id: string): Promise<void> {
  try {
    const {isAuthenticated, getUser} = getKindeServerSession();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      throw new Error("User is not authenticated");
    }

    const user = await getUser();
    if (!user?.id) {
      throw new Error("User ID is missing");
    }

    console.log("Deleting address:", id);

    // Using axios instead
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/addresses/${id}`
    );

    if (!res || res.status !== 200) {
      throw new Error("Failed to delete address");
    }

    console.log("Address deleted successfully");

    // Revalidate cache after deleting
    revalidateTag("addresses", "max");

  } catch (error) {
    console.error("Failed to delete address:", error);
    throw error;
  }
}

// Set primary address
export async function setPrimaryAddress(id: string): Promise<Address> {
  try {
    const {isAuthenticated, getUser} = getKindeServerSession();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      throw new Error("User is not authenticated");
    }

    const user = await getUser();
    if (!user?.id) {
      throw new Error("User ID is missing");
    }

    console.log("Setting primary address:", id);

    // Using axios to set primary address
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/addresses/${id}`,
      {
        isPrimary: true
      }
    );

    if (!res || res.status !== 200) {
      throw new Error("Failed to set primary address");
    }

    console.log("Primary address set successfully:", res.data);

    revalidatePath("/profile/addresses");


    return res.data;
  } catch (error) {
    console.error("Failed to set primary address:", error);
    throw error;
  }
}
