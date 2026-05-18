/**
 * POST /api/meta-ads/search
 * 
 * Search for ads in Meta's Ad Library
 * 
 * Body:
 * {
 *   keyword: string (required)
 *   country: string (required) - US, UK, CA, AU, DE, FR, IT, ES, JP
 *   platform?: string - FACEBOOK, INSTAGRAM, AUDIENCE_NETWORK, MESSENGER
 *   limit?: number - 1-1000 (default: 100)
 *   after?: string - pagination cursor
 * }
 * 
 * Response:
 * {
 *   success: boolean
 *   data?: {
 *     ads: NormalizedAd[]
 *     totalCount: number
 *     hasMore: boolean
 *     nextCursor?: string
 *   }
 *   error?: string
 *   rateLimit?: {
 *     remaining: number
 *     resetInSeconds: number
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchMetaAds, SearchParams, SUPPORTED_COUNTRIES } from '@/lib/meta-api'
import { metaApiRateLimiter } from '@/lib/rate-limit'

// ============================================================================
// ERROR TYPES
// ============================================================================

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, any>,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ============================================================================
// VALIDATION
// ============================================================================

interface RequestBody {
  keyword?: string
  country?: string
  platform?: string
  limit?: number
  after?: string
}

/**
 * Validate request body
 */
function validateRequest(body: RequestBody): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!body.keyword || typeof body.keyword !== 'string' || body.keyword.trim().length === 0) {
    errors.push('Keyword is required and must be a non-empty string')
  }

  if (!body.country || typeof body.country !== 'string') {
    errors.push('Country is required')
  } else if (!SUPPORTED_COUNTRIES[body.country as keyof typeof SUPPORTED_COUNTRIES]) {
    const validCountries = Object.keys(SUPPORTED_COUNTRIES).join(', ')
    errors.push(`Invalid country. Supported: ${validCountries}`)
  }

  if (body.platform) {
    const validPlatforms = ['FACEBOOK', 'INSTAGRAM', 'AUDIENCE_NETWORK', 'MESSENGER']
    if (!validPlatforms.includes(body.platform)) {
      errors.push(`Invalid platform. Supported: ${validPlatforms.join(', ')}`)
    }
  }

  if (body.limit !== undefined) {
    if (typeof body.limit !== 'number' || body.limit < 1 || body.limit > 1000) {
      errors.push('Limit must be a number between 1 and 1000')
    }
  }

  if (body.after && typeof body.after !== 'string') {
    errors.push('Pagination cursor must be a string')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Parse request body safely
 */
async function parseRequestBody(request: NextRequest): Promise<RequestBody> {
  try {
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      throw new ApiError(400, 'Content-Type must be application/json')
    }

    const body = await request.json()
    return body as RequestBody
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(400, 'Invalid JSON in request body')
  }
}

/**
 * Get client IP from request
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
  return ip
}

// ============================================================================
// HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // ========== RATE LIMITING ==========
    const clientIp = getClientIp(request)
    const rateLimitResult = metaApiRateLimiter({ ip: clientIp })

    if (rateLimitResult.isLimited) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          rateLimit: {
            remaining: rateLimitResult.remaining,
            resetInSeconds: rateLimitResult.resetInSeconds,
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.resetInSeconds),
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetTime / 1000)),
          },
        },
      )
    }

    // ========== ENVIRONMENT VARIABLES ==========
    const accessToken = process.env.META_ACCESS_TOKEN
    if (!accessToken) {
      console.error('META_ACCESS_TOKEN environment variable is not set')
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error. Please contact support.',
        },
        { status: 500 },
      )
    }

    // ========== REQUEST PARSING ==========
    const body = await parseRequestBody(request)

    // ========== VALIDATION ==========
    const validation = validateRequest(body)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: {
            errors: validation.errors,
          },
        },
        { status: 400 },
      )
    }

    // ========== SEARCH ==========
    const searchParams: SearchParams = {
      keyword: body.keyword!.trim(),
      country: body.country!,
      platform: body.platform as any,
      limit: body.limit || 100,
      after: body.after,
    }

    const result = await searchMetaAds(searchParams, accessToken)

    // ========== ERROR HANDLING ==========
    if (result.error) {
      // Determine error status code
      let statusCode = 500
      if (result.error.includes('Invalid request')) statusCode = 400
      if (result.error.includes('Invalid or expired')) statusCode = 401
      if (result.error.includes('Access denied')) statusCode = 403
      if (result.error.includes('Rate limit')) statusCode = 429
      if (result.error.includes('not configured')) statusCode = 500

      console.error(`Meta API search error: ${result.error}`)
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: statusCode },
      )
    }

    // ========== SUCCESS RESPONSE ==========
    return NextResponse.json(
      {
        success: true,
        data: {
          ads: result.ads,
          totalCount: result.totalCount,
          hasMore: result.hasMore,
          nextCursor: result.nextCursor,
        },
        rateLimit: {
          remaining: rateLimitResult.remaining,
          resetInSeconds: rateLimitResult.resetInSeconds,
        },
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': String(rateLimitResult.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetTime / 1000)),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    )
  } catch (error) {
    // ========== UNEXPECTED ERRORS ==========
    console.error('Unexpected error in /api/meta-ads/search:', error)

    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    const statusCode = error instanceof ApiError ? error.statusCode : 500

    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === 'development' ? message : 'An error occurred. Please try again.',
        ...(process.env.NODE_ENV === 'development' && { details: { message } }),
      },
      { status: statusCode },
    )
  }
}

/**
 * Handle unsupported methods
 */
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: 'Method not allowed. Use POST instead.',
    },
    { status: 405 },
  )
}

export const runtime = 'nodejs'
export const preferredRegion = 'auto'
