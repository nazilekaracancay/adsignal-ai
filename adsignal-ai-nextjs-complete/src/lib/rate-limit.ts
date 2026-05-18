/**
 * Rate Limiting Utility
 * 
 * Simple in-process rate limiter using sliding window algorithm
 * For production, use Redis or similar distributed cache
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuration
export interface RateLimitConfig {
  maxRequests: number // Maximum requests
  windowMs: number // Time window in milliseconds
  keyGenerator?: (req: { ip?: string; userId?: string }) => string
}

// Default configuration
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100, // 100 requests
  windowMs: 60 * 1000, // per minute
  keyGenerator: (req) => req.ip || 'unknown',
}

/**
 * Create a rate limiter middleware
 */
export function createRateLimiter(config?: Partial<RateLimitConfig>) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  return function rateLimiter(req: { ip?: string; headers?: Record<string, any> }) {
    const key = finalConfig.keyGenerator?.(req) || DEFAULT_CONFIG.keyGenerator!(req)
    const now = Date.now()

    // Get or create entry
    let entry = rateLimitStore.get(key)

    // Reset if window has passed
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + finalConfig.windowMs,
      }
      rateLimitStore.set(key, entry)
    }

    // Increment counter
    entry.count++

    // Check if limit exceeded
    const isLimited = entry.count > finalConfig.maxRequests
    const remaining = Math.max(0, finalConfig.maxRequests - entry.count)
    const resetTime = entry.resetTime

    return {
      isLimited,
      current: entry.count,
      limit: finalConfig.maxRequests,
      remaining,
      resetTime,
      resetInSeconds: Math.ceil((resetTime - now) / 1000),
    }
  }
}

/**
 * Default Meta API rate limiter
 * 100 requests per minute per IP
 */
export const metaApiRateLimiter = createRateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: (req) => req.ip || 'unknown',
})

/**
 * Cleanup old entries periodically
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  const keysToDelete: string[] = []

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      keysToDelete.push(key)
    }
  }

  keysToDelete.forEach(key => rateLimitStore.delete(key))
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000)

export default {
  createRateLimiter,
  metaApiRateLimiter,
  cleanupRateLimitStore,
}
