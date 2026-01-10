"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const KINDE_DOMAIN = process.env.KINDE_ISSUER_URL?.replace("https://", "") || "";
const KINDE_M2M_CLIENT_ID = process.env.KINDE_M2M_CLIENT_ID;
const KINDE_M2M_CLIENT_SECRET = process.env.KINDE_M2M_CLIENT_SECRET;

/**
 * Get Kinde Management API access token
 */
async function getKindeManagementToken() {
  if (!KINDE_M2M_CLIENT_ID || !KINDE_M2M_CLIENT_SECRET) {
    throw new Error("Kinde M2M credentials not configured");
  }

  const response = await fetch(`https://${KINDE_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: KINDE_M2M_CLIENT_ID,
      client_secret: KINDE_M2M_CLIENT_SECRET,
      audience: `https://${KINDE_DOMAIN}/api`,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get Kinde management token");
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Fetch all user accounts
 */
export async function fetchAccounts(filters?: {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageAccounts = await getPermission("manage:accounts");
    if (!canManageAccounts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:accounts permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const params = new URLSearchParams();
    if (filters?.status) params.set("status", filters.status);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.page) params.set("page", filters.page.toString());
    if (filters?.limit) params.set("limit", filters.limit.toString());

    const response = await fetch(
      `${API_URL}/admin/accounts${params.toString() ? `?${params}` : ""}`,
      {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch accounts" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return { success: false, error: "An error occurred while fetching accounts" };
  }
}

/**
 * Fetch single account details
 */
export async function fetchAccountById(accountId: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageAccounts = await getPermission("manage:accounts");
    if (!canManageAccounts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:accounts permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/accounts/${accountId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to fetch account" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching account:", error);
    return { success: false, error: "An error occurred while fetching account" };
  }
}

/**
 * Suspend/Terminate a user account
 */
export async function terminateAccount(accountId: string, reason: string, permanent: boolean = false) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canTerminateAccounts = await getPermission("terminate:accounts");
    if (!canTerminateAccounts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing terminate:accounts permission" };
    }

    const accessToken = await getAccessTokenRaw();

    // Step 1: Terminate in our backend
    const response = await fetch(`${API_URL}/admin/accounts/${accountId}/terminate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason, permanent }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to terminate account" };
    }

    const data = await response.json();
    const kindeUserId = data.kindeId;

    // Step 2: Delete/Suspend user in Kinde if we have their Kinde ID
    if (kindeUserId && permanent) {
      try {
        const managementToken = await getKindeManagementToken();

        // Delete user from Kinde (permanent termination)
        await fetch(`https://${KINDE_DOMAIN}/api/v1/user?id=${kindeUserId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${managementToken}`,
            "Accept": "application/json",
          },
        });
      } catch (kindeError) {
        console.error("Error deleting user from Kinde:", kindeError);
        // Don't fail the whole operation if Kinde deletion fails
        // The user is already marked as terminated in our system
      }
    } else if (kindeUserId && !permanent) {
      try {
        const managementToken = await getKindeManagementToken();

        // Suspend user in Kinde (can be reactivated later)
        await fetch(`https://${KINDE_DOMAIN}/api/v1/user`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${managementToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            id: kindeUserId,
            is_suspended: true,
          }),
        });
      } catch (kindeError) {
        console.error("Error suspending user in Kinde:", kindeError);
        // Don't fail the whole operation if Kinde suspension fails
      }
    }

    // Revalidate accounts pages
    revalidatePath("/admin/accounts");
    revalidatePath(`/admin/accounts/${accountId}`);

    return { success: true, data };
  } catch (error) {
    console.error("Error terminating account:", error);
    return { success: false, error: "An error occurred while terminating account" };
  }
}

/**
 * Reactivate a suspended account
 */
export async function reactivateAccount(accountId: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageAccounts = await getPermission("manage:accounts");
    if (!canManageAccounts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:accounts permission" };
    }

    const accessToken = await getAccessTokenRaw();

    // Step 1: Reactivate in our backend
    const response = await fetch(`${API_URL}/admin/accounts/${accountId}/reactivate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to reactivate account" };
    }

    const data = await response.json();
    const kindeUserId = data.kindeId;

    // Step 2: Unsuspend user in Kinde if we have their Kinde ID
    if (kindeUserId) {
      try {
        const managementToken = await getKindeManagementToken();

        // Unsuspend user in Kinde
        await fetch(`https://${KINDE_DOMAIN}/api/v1/user`, {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${managementToken}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            id: kindeUserId,
            is_suspended: false,
          }),
        });
      } catch (kindeError) {
        console.error("Error unsuspending user in Kinde:", kindeError);
        // Don't fail the whole operation if Kinde unsuspension fails
      }
    }

    // Revalidate accounts pages
    revalidatePath("/admin/accounts");
    revalidatePath(`/admin/accounts/${accountId}`);

    return { success: true, data };
  } catch (error) {
    console.error("Error reactivating account:", error);
    return { success: false, error: "An error occurred while reactivating account" };
  }
}

/**
 * Update account details
 */
export async function updateAccount(accountId: string, updates: any) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    // Check permission
    const canManageAccounts = await getPermission("manage:accounts");
    if (!canManageAccounts?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:accounts permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/accounts/${accountId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || "Failed to update account" };
    }

    const data = await response.json();

    // Revalidate accounts pages
    revalidatePath("/admin/accounts");
    revalidatePath(`/admin/accounts/${accountId}`);

    return { success: true, data };
  } catch (error) {
    console.error("Error updating account:", error);
    return { success: false, error: "An error occurred while updating account" };
  }
}
