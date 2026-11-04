// Stripe metadata values are capped at 500 chars each (and ~50 keys total per
// object), so a per-entry bid-amounts array can't always fit in one field —
// chunk the JSON-encoded array across numbered keys and reassemble on read.
// Shared by both bidding flows (Checkout Session + PaymentIntent) so the
// encoding never drifts between them.

const STRIPE_METADATA_VALUE_LIMIT = 500;

export function encodeBidAmountsMetadata(bidAmounts: number[]): Record<string, string> {
  const json = JSON.stringify(bidAmounts);
  const chunks: string[] = [];
  for (let i = 0; i < json.length; i += STRIPE_METADATA_VALUE_LIMIT) {
    chunks.push(json.slice(i, i + STRIPE_METADATA_VALUE_LIMIT));
  }

  const metadata: Record<string, string> = {
    bidAmountsChunkCount: chunks.length.toString(),
  };
  chunks.forEach((chunk, index) => {
    metadata[`bidAmounts_${index}`] = chunk;
  });

  return metadata;
}

export function decodeBidAmountsMetadata(
  metadata: Record<string, string | undefined>
): number[] {
  const chunkCount = parseInt(metadata.bidAmountsChunkCount || "0", 10);
  if (!chunkCount) return [];

  let json = "";
  for (let i = 0; i < chunkCount; i++) {
    json += metadata[`bidAmounts_${i}`] || "";
  }

  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
