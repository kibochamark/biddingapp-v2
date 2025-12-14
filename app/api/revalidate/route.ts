// API route for revalidating cache tags
import { profile } from "console";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tag } = body;

    if (!tag) {
      return NextResponse.json(
        { error: "Tag is required" },
        { status: 400 }
      );
    }

    revalidateTag(tag, "max");

    return NextResponse.json(
      { revalidated: true, tag, now: Date.now() },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error revalidating" },
      { status: 500 }
    );
  }
}
