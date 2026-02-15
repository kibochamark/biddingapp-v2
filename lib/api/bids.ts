// Bids API functions with caching and revalidation

import { Bid, UserBid } from "../types";
import { apiFetch } from "../api";

// Cache tags for revalidation
export const BID_TAGS = {
  all: "bids",
  product: (productId: string) => `bids-product-${productId}`,
  user: (userId: string) => `bids-user-${userId}`,
  detail: (id: string) => `bid-${id}`,
};

// Fetch all bids for a product
export async function fetchProductBids(productId: string): Promise<Bid[]> {
  try {
    const data = await apiFetch<Bid[]>(
      `/products/${productId}/bids`,
      { tags: [BID_TAGS.all, BID_TAGS.product(productId)] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, returning empty bids:", error);
    return [];
  }
}

// Response type for fetchUserBids with error state
export type UserBidsResponse =
  | { success: true; bids: UserBid[] }
  | { success: false; error: string };

// Fetch user's bids using kinde_id
export async function fetchUserBids(kindeId: string): Promise<UserBidsResponse> {
  try {
    const data = await apiFetch<UserBid[]>(
      `/bids/my-bids/${kindeId}`,
      { tags: [BID_TAGS.all, BID_TAGS.user(kindeId)] }
    );
    return { success: true, bids: data };
  } catch (error) {
    console.error("Failed to fetch user bids:", error);
    const errorMessage = error instanceof Error ? error.message : "Unable to load your bids. Please try again later.";
    return { success: false, error: errorMessage };
  }
}

// Fetch single bid
export async function fetchBidById(id: string): Promise<Bid | null> {
  try {
    const data = await apiFetch<Bid>(
      `/bids/${id}`,
      { tags: [BID_TAGS.all, BID_TAGS.detail(id)] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, returning null:", error);
    return null;
  }
}
