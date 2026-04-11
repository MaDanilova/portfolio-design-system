type RateLimitKey = string;

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: number;
}

export interface RateLimitStore {
  get(key: string): RateLimitBucket | undefined;
  set(key: string, bucket: RateLimitBucket): void;
  delete(key: string): void;
  entries(): IterableIterator<[string, RateLimitBucket]>;
}

// --- In-memory store (default) ---

class InMemoryStore implements RateLimitStore {
  private buckets = new Map<RateLimitKey, RateLimitBucket>();

  get(key: string) {
    return this.buckets.get(key);
  }
  set(key: string, bucket: RateLimitBucket) {
    this.buckets.set(key, bucket);
  }
  delete(key: string) {
    this.buckets.delete(key);
  }
  entries() {
    return this.buckets.entries();
  }
  clear() {
    this.buckets.clear();
  }
}

// The active store. Swap this with a Redis-backed implementation to scale
// across multiple server instances (e.g. Upstash Redis, Vercel KV).
//
// To switch to Redis:
//   1. Create a class that implements RateLimitStore using Redis GET/SET
//   2. Replace `activeStore` with an instance of that class
//   3. No changes needed in any calling code
const activeStore: InMemoryStore = new InMemoryStore();

function getNow() {
  return Date.now();
}

function cleanupExpired(now: number) {
  for (const [key, bucket] of activeStore.entries()) {
    if (bucket.resetAt <= now) {
      activeStore.delete(key);
    }
  }
}

export function takeRateLimit(params: {
  namespace: string;
  identifier: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const { namespace, identifier, limit, windowMs } = params;
  const now = getNow();
  cleanupExpired(now);

  const safeLimit = Math.max(1, Math.floor(limit));
  const safeWindow = Math.max(1_000, Math.floor(windowMs));
  const key = `${namespace}:${identifier}`;
  const current = activeStore.get(key);

  if (!current || current.resetAt <= now) {
    const nextBucket: RateLimitBucket = { count: 1, resetAt: now + safeWindow };
    activeStore.set(key, nextBucket);
    return {
      allowed: true,
      remaining: Math.max(0, safeLimit - nextBucket.count),
      retryAfterSeconds: 0,
      resetAt: nextBucket.resetAt,
    };
  }

  if (current.count >= safeLimit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)),
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  activeStore.set(key, current);

  return {
    allowed: true,
    remaining: Math.max(0, safeLimit - current.count),
    retryAfterSeconds: 0,
    resetAt: current.resetAt,
  };
}

export function resetRateLimitsForTests() {
  activeStore.clear();
}
