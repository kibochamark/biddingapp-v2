import { NextRequest, NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// POST /api/bids - Place a bid
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { isAuthenticated, getUser, getAccessTokenRaw } = getKindeServerSession();
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUser();
    const accessToken = await getAccessTokenRaw();

    if (!user?.id || !accessToken) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Call backend API to place bid
    const response = await fetch(`${API_BASE_URL}/products/${productId}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        bidderId: user.id,
        bidderName: `${user.given_name || ""} ${user.family_name || ""}`.trim(),
        bidderEmail: user.email,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Failed to place bid",
      }));
      return NextResponse.json(
        { error: error.message || "Failed to place bid" },
        { status: response.status }
      );
    }

    const bid = await response.json();

    // Revalidate product and bid caches
    // Note: revalidateTag is handled by the backend or we can add it here

    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    console.error("Error placing bid:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
