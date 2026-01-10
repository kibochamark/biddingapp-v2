"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Approve a KYC submission
 */
export async function approveKYC(kycId: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canApproveKYC = await getPermission("approve:kyc");
    if (!canApproveKYC?.isGranted) {
      return { success: false, error: "Unauthorized: Missing approve:kyc permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/kyc/${kycId}/approve`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to approve KYC" };
    }

    const data = await response.json();

    // Revalidate the KYC page
    revalidatePath("/admin/kyc");

    return { success: true, data };
  } catch (error) {
    console.error("Error approving KYC:", error);
    return { success: false, error: "An error occurred while approving KYC" };
  }
}

/**
 * Reject a KYC submission with reason
 */
export async function rejectKYC(kycId: string, reason: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canRejectKYC = await getPermission("reject:kyc");
    if (!canRejectKYC?.isGranted) {
      return { success: false, error: "Unauthorized: Missing reject:kyc permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/kyc/${kycId}/reject`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to reject KYC" };
    }

    const data = await response.json();

    // Revalidate the KYC page
    revalidatePath("/admin/kyc");

    return { success: true, data };
  } catch (error) {
    console.error("Error rejecting KYC:", error);
    return { success: false, error: "An error occurred while rejecting KYC" };
  }
}

/**
 * Fetch all KYC submissions with optional filter
 */
export async function fetchKYCSubmissions(status?: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageKYC = await getPermission("approve:kyc");
    if (!canManageKYC?.isGranted) {
      return { success: false, error: "Unauthorized: Missing approve:kyc permission" };
    }

    const accessToken = await getAccessTokenRaw();
    const queryParam = status ? `?status=${status}` : "";

    const response = await fetch(`${API_URL}/admin/kyc${queryParam}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 }, // Don't cache
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch KYC submissions" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching KYC submissions:", error);
    return { success: false, error: "An error occurred while fetching KYC submissions" };
  }
}
