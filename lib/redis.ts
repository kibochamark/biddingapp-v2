import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis-service:6379";

/**
 * Singleton publisher instance — used by the webhook to publish payment events.
 */
let publisher: Redis | null = null;

export function getPublisher(): Redis {
  if (!publisher) {
    publisher = new Redis(redisUrl, { maxRetriesPerRequest: 3 });
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
