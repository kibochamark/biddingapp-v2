"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export enum KycStatus {
  NOT_SUBMITTED = "NOT_SUBMITTED",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  NEEDS_MORE_INFO = "NEEDS_MORE_INFO",
}

/**
 * Fetch all KYC submissions with optional filter
 * GET /kyc?status=PENDING
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

    const response = await fetch(`${API_URL}/kyc${queryParam}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
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

/**
 * Fetch single KYC submission by ID
 * GET /kyc/:id
 */
export async function fetchKYCById(kycId: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageKYC = await getPermission("approve:kyc");
    if (!canManageKYC?.isGranted) {
      return { success: false, error: "Unauthorized: Missing approve:kyc permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/kyc/${kycId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch KYC submission" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching KYC submission:", error);
    return { success: false, error: "An error occurred while fetching KYC submission" };
  }
}

/**
 * Update KYC status (approve or reject)
 * PATCH /kyc/:id
 */
export async function updateKYCStatus(
  kycId: string,
  status: KycStatus,
  rejectionReason?: string
) {
  try {
    const { getPermission, getAccessTokenRaw, getUser } = getKindeServerSession();

    // Check permission
    const canManageKYC = await getPermission("approve:kyc");
    if (!canManageKYC?.isGranted) {
      return { success: false, error: "Unauthorized: Missing approve:kyc permission" };
    }

    const user = await getUser();
    if (!user || !user.id) {
      return { success: false, error: "User not authenticated" };
    }

    const accessToken = await getAccessTokenRaw();

    const updateData: {
      status: KycStatus;
      reviewedBy: string;
      rejectionReason?: string;
    } = {
      status,
      reviewedBy: user.id, // Kinde ID of the admin
    };

    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const response = await fetch(`${API_URL}/kyc/${kycId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update KYC status" };
    }

    const data = await response.json();

    // Revalidate the KYC page
    revalidatePath("/admin/kyc");

    return { success: true, data };
  } catch (error) {
    console.error("Error updating KYC status:", error);
    return { success: false, error: "An error occurred while updating KYC status" };
  }
}

/**
 * Approve a KYC submission
 */
export async function approveKYC(kycId: string) {
  return updateKYCStatus(kycId, KycStatus.APPROVED);
}

/**
 * Reject a KYC submission with reason
 */
export async function rejectKYC(kycId: string, reason: string) {
  if (!reason || !reason.trim()) {
    return { success: false, error: "Rejection reason is required" };
  }
  return updateKYCStatus(kycId, KycStatus.REJECTED, reason);
}

/**
 * Request more information from user with reason
 */
export async function requestMoreInfo(kycId: string, reason: string) {
  if (!reason || !reason.trim()) {
    return { success: false, error: "Reason for requesting more info is required" };
  }
  return updateKYCStatus(kycId, KycStatus.NEEDS_MORE_INFO, reason);
}

/**
 * Delete a KYC submission
 * DELETE /kyc/:id
 */
export async function deleteKYC(kycId: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageKYC = await getPermission("approve:kyc");
    if (!canManageKYC?.isGranted) {
      return { success: false, error: "Unauthorized: Missing approve:kyc permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/kyc/${kycId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to delete KYC submission" };
    }

    // Revalidate the KYC page
    revalidatePath("/admin/kyc");

    return { success: true };
  } catch (error) {
    console.error("Error deleting KYC submission:", error);
    return { success: false, error: "An error occurred while deleting KYC submission" };
  }
}

/**
 * Calculate KYC statistics from submissions
 */
export async function fetchKYCStats() {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageKYC = await getPermission("approve:kyc");
    if (!canManageKYC?.isGranted) {
      return { success: false, error: "Unauthorized: Missing approve:kyc permission" };
    }

    const accessToken = await getAccessTokenRaw();

    // Fetch all KYC submissions
    const response = await fetch(`${API_URL}/kyc`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch KYC stats" };
    }

    const data = await response.json();

    // Calculate stats from submissions
    const stats = {
      pending: data.filter((kyc: any) => kyc.status === "PENDING").length,
      approved: data.filter((kyc: any) => kyc.status === "APPROVED").length,
      rejected: data.filter((kyc: any) => kyc.status === "REJECTED").length,
      notSubmitted: data.filter((kyc: any) => kyc.status === "NOT_SUBMITTED").length,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching KYC stats:", error);
    return { success: false, error: "An error occurred while fetching KYC stats" };
  }
}
