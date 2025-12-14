// KYC API functions with caching and revalidation

import { KYCVerification } from "../types";
import { apiFetch } from "../api";

// Cache tags for revalidation
export const KYC_TAGS = {
  all: "kyc",
  user: (userId: string) => `kyc-user-${userId}`,
};

// Fetch KYC status for a user
export async function fetchKYCStatus(userId: string): Promise<KYCVerification | null> {
  try {
    const data = await apiFetch<KYCVerification>(
      `/kyc/${userId}`,
      { tags: [KYC_TAGS.all, KYC_TAGS.user(userId)] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, returning null KYC status:", error);
    return null;
  }
}

// Submit KYC verification
export async function submitKYC(kycData: {
  userId: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  idType: "passport" | "drivers_license" | "national_id";
  idNumber: string;
  idExpiryDate: string;
  idFrontImage: string;
  idBackImage?: string;
  selfieImage: string;
  addressProofImage: string;
}): Promise<KYCVerification> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/kyc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(kycData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();

    // Revalidate cache after submission
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: KYC_TAGS.user(kycData.userId) }),
    });

    return data;
  } catch (error) {
    console.error("Failed to submit KYC:", error);
    throw error;
  }
}

// Update KYC verification (resubmit if rejected)
export async function updateKYC(
  userId: string,
  kycData: {
    fullName?: string;
    dateOfBirth?: string;
    nationality?: string;
    idType?: "passport" | "drivers_license" | "national_id";
    idNumber?: string;
    idExpiryDate?: string;
    idFrontImage?: string;
    idBackImage?: string;
    selfieImage?: string;
    addressProofImage?: string;
  }
): Promise<KYCVerification> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/kyc/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(kycData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();

    // Revalidate cache after update
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tag: KYC_TAGS.user(userId) }),
    });

    return data;
  } catch (error) {
    console.error("Failed to update KYC:", error);
    throw error;
  }
}

// Upload KYC document helper function
export async function uploadKYCDocument(file: File, documentType: string): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("documentType", documentType);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/kyc/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.url; // Returns the uploaded file URL
  } catch (error) {
    console.error("Failed to upload KYC document:", error);
    throw error;
  }
}
