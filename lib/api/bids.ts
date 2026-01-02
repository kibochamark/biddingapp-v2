// Bids API functions with caching and revalidation

import { Bid } from "../types";
import { apiFetch } from "../api";

// Cache tags for revalidation
export const BID_TAGS = {
  all: "bids",
  product: (productId: string) => `bids-product-${productId}`,
  user: (userId: string) => `bids-user-${userId}`,
  detail: (id: string) => `bid-${id}`,
};

// Mock bids for development
function getMockUserBids(userId: string): Bid[] {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

  return [
    // Two bids on the same product (Apple Watch)
    {
      id: "bid-1",
      productId: "prod-watch-ultra-2",
      bidderId: userId,
      bidderName: "John Doe",
      bidderEmail: "john@example.com",
      amount: 10,
      status: "CONFIRMED",
      isWinner: false,
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    {
      id: "bid-2",
      productId: "prod-watch-ultra-2",
      bidderId: userId,
      bidderName: "John Doe",
      bidderEmail: "john@example.com",
      amount: 10,
      status: "CONFIRMED",
      isWinner: false,
      createdAt: yesterday,
      updatedAt: yesterday,
    },
    // Won bid on iPhone 15 Pro
    {
      id: "bid-3",
      productId: "prod-iphone-15-pro",
      bidderId: userId,
      bidderName: "John Doe",
      bidderEmail: "john@example.com",
      amount: 5,
      status: "CONFIRMED",
      isWinner: true,
      createdAt: twoDaysAgo,
      updatedAt: twoDaysAgo,
    },
    // Lost bid on MacBook Pro
    {
      id: "bid-4",
      productId: "prod-macbook-pro-m3",
      bidderId: userId,
      bidderName: "John Doe",
      bidderEmail: "john@example.com",
      amount: 15,
      status: "LOST",
      isWinner: false,
      createdAt: threeDaysAgo,
      updatedAt: threeDaysAgo,
    },
    // Active bid on AirPods Pro
    {
      id: "bid-5",
      productId: "prod-airpods-pro",
      bidderId: userId,
      bidderName: "John Doe",
      bidderEmail: "john@example.com",
      amount: 10,
      status: "CONFIRMED",
      isWinner: false,
      createdAt: now,
      updatedAt: now,
    },
    // Another lost bid on iPad Air
    {
      id: "bid-6",
      productId: "prod-ipad-air",
      bidderId: userId,
      bidderName: "John Doe",
      bidderEmail: "john@example.com",
      amount: 8,
      status: "LOST",
      isWinner: false,
      createdAt: fourDaysAgo,
      updatedAt: fourDaysAgo,
    },
  ];
}

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

// Fetch user's bids
export async function fetchUserBids(userId: string): Promise<Bid[]> {
  try {
    const data = await apiFetch<Bid[]>(
      `/bids/my-bids?userId=${userId}`,
      { tags: [BID_TAGS.all, BID_TAGS.user(userId)] }
    );
    return data;
  } catch (error) {
    console.warn("API failed, returning mock bids:", error);
    return getMockUserBids(userId);
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
