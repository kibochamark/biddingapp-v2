"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import type { AuctionDetail } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Fetch a single auction's full admin detail — product inline, lifecycle
 * dates, and every current bidder with their bid amount.
 *
 * NOTE: the backing endpoint (`/admin/auctions/:id`) doesn't exist yet. This
 * is written against the planned shape so the UI is ready to wire in the
 * moment it ships — swap nothing here, just remove the catch's mock fallback.
 */
export async function fetchAuctionDetail(
  auctionId: string
): Promise<{ success: boolean; data?: AuctionDetail; error?: string }> {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    const canManageBids = await getPermission("manage:bids");
    if (!canManageBids?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:bids permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/auctions/${auctionId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      return { success: false, error: error?.message || "Failed to fetch auction" };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching auction:", error);
    return { success: false, error: "An error occurred while fetching the auction" };
  }
}

/**
 * End an active auction early. Sets status to CANCELLED rather than ENDED,
 * so it's distinguishable from an auction that ran its natural course.
 */
export async function terminateAuction(auctionId: string, reason: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    const canTerminate = await getPermission("terminate:auctions");
    if (!canTerminate?.isGranted) {
      return { success: false, error: "Unauthorized: Missing terminate:auctions permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/auctions/${auctionId}/terminate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      return { success: false, error: error?.message || "Failed to terminate auction" };
    }

    const data = await response.json();

    revalidatePath("/admin/bids");
    revalidatePath(`/admin/bids/${auctionId}`);
    // The public product page (/product/[id]) is fully dynamic (no-store),
    // so this isn't load-bearing for freshness — it's just a safety net for
    // the client router cache. Only fires if the backend echoes the product id.
    const terminatedProductId = data?.product?.id || data?.productId;
    if (terminatedProductId) {
      revalidatePath(`/product/${terminatedProductId}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error terminating auction:", error);
    return { success: false, error: "An error occurred while terminating the auction" };
  }
}

/**
 * Push an active auction's end date back.
 */
export async function extendAuction(auctionId: string, newEndDate: string) {
  try {
    const { getPermission, getAccessTokenRaw } = getKindeServerSession();

    const canManageBids = await getPermission("manage:bids");
    if (!canManageBids?.isGranted) {
      return { success: false, error: "Unauthorized: Missing manage:bids permission" };
    }

    const accessToken = await getAccessTokenRaw();

    const response = await fetch(`${API_URL}/admin/auctions/${auctionId}/extend`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endDate: newEndDate }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      return { success: false, error: error?.message || "Failed to extend auction" };
    }

    const data = await response.json();

    revalidatePath("/admin/bids");
    revalidatePath(`/admin/bids/${auctionId}`);
    // See the matching note in terminateAuction — safety net only.
    const extendedProductId = data?.product?.id || data?.productId;
    if (extendedProductId) {
      revalidatePath(`/product/${extendedProductId}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error extending auction:", error);
    return { success: false, error: "An error occurred while extending the auction" };
  }
}
