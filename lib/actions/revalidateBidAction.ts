"use server";
import { revalidatePath, revalidateTag } from "next/cache";

// Called from the client right after a real-time (SSE) message arrives —
// e.g. a payment success/failure notification — so the relevant cached data
// is invalidated immediately instead of waiting out whatever window the
// underlying fetch's own revalidate/tag was given. Pass whichever of path/tag
// applies; both may be set at once (they invalidate independent cache
// layers — the route segment vs. the underlying fetch's Data Cache entry).
export async function revalidateBidsAction(target: { path?: string; tag?: string }) {
    if (target.path) {
        revalidatePath(target.path);
    }
    if (target.tag) {
        revalidateTag(target.tag, { expire: 0 });
    }
}