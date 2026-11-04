import Redis from "ioredis";

// Single source of truth for where Redis lives — both the publisher and
// every subscriber connect here. (A `host`/`port` override used to be passed
// alongside this URL on the publisher below; ioredis's `defaults()` merge
// resolves the URL string first, so those options were always silently
// discarded — removed rather than left as misleading dead code. Make sure
// REDIS_URL in your actual deployment env matches the real Redis host and
// includes credentials if that instance requires auth.)
const redisUrl = process.env.REDIS_URL || "redis://bidding-redis:6379";

/**
 * Singleton publisher instance — used by the webhook to publish payment events.
 */
let publisher: Redis | null = null;

export function getPublisher(): Redis {
  if (!publisher) {
    publisher = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
    });
  }
  return publisher;
}

/**
 * Factory for subscriber instances — each SSE connection needs its own
 * Redis connection because a subscribed client can't issue other commands.
 */
export function createSubscriber(): Redis {
  return new Redis(redisUrl, { maxRetriesPerRequest: 3 });
}
