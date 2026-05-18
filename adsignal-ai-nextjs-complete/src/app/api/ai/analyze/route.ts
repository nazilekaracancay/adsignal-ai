/**
 * POST /api/ai/analyze
 * 
 * Analyze ad copy using Claude AI and generate opportunity reports
 * 
 * Body:
 * {
 *   ads: Array<{
 *     id: string
 *     page_name: string
 *     copy: string
 *     platforms?: string[]
 *   }>
 *   market_name: string
 *   country?: string
 *   generate_report?: boolean
 * }
 * 
 * Response:
 * {
 *   success: boolean
 *   data?: {
 *     analyses: AdAnalysis[]
 *     report?: OpportunityReport
 *   }
 *   error?: string
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { analyzeAds, generateOpportunityReport, type AnalysisInput } from '@/lib/ai-analysis'

// ============================================================================
// VALIDATION
// ============================================================================

interface RequestBody {
  ads?: Array<{ id?: string; page_name?: string; copy?: string; platforms?: string[] }>
  market_name?: string
  country?: string
  generate_report?: boolean
}

function validateRequest(body: RequestBody): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!body.ads || !Array.isArray(body.ads) || body.ads.length === 0) {
    errors.push('ads array is required and must contain at least 1 ad')
  } else {
    body.ads.forEach((ad, index) => {
      if (!ad.id || typeof ad.id !== 'string') {
        errors.push(`ad[${index}].id is required and must be a string`)
      }
      if (!ad.page_name || typeof ad.page_name !== 'string') {
        errors.push(`ad[${index}].page_name is required and must be a string`)
      }
      if (!ad.copy || typeof ad.copy !== 'string' || ad.copy.trim().length === 0) {
        errors.push(`ad[${index}].copy is required and must be a non-empty string`)
      }
    })
  }

  if (!body.market_name || typeof body.market_name !== 'string') {
    errors.push('market_name is required and must be a string')
  }

  if (body.country && typeof body.country !== 'string') {
    errors.push('country must be a string')
  }

  if (body.generate_report !== undefined && typeof body.generate_report !== 'boolean') {
    errors.push('generate_report must be a boolean')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// ============================================================================
// HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // ========== ENVIRONMENT CHECK ==========
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error: ANTHROPIC_API_KEY not set',
        },
        { status: 500 },
      )
    }

    // ========== REQUEST PARSING ==========
    let body: RequestBody
    try {
      const contentType = request.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        return NextResponse.json(
          { success: false, error: 'Content-Type must be application/json' },
          { status: 400 },
        )
      }
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 },
      )
    }

    // ========== VALIDATION ==========
    const validation = validateRequest(body)
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: { errors: validation.errors },
        },
        { status: 400 },
      )
    }

    // ========== ANALYSIS ==========
    const input: AnalysisInput = {
      ads: body.ads!.map(ad => ({
        id: ad.id!,
        page_name: ad.page_name!,
        copy: ad.copy!,
        platforms: ad.platforms,
      })),
      market_name: body.market_name!,
      country: body.country || 'US',
    }

    // Analyze all ads
    console.log(`Analyzing ${input.ads.length} ads for market: ${input.market_name}`)
    const analyses = await analyzeAds(input)

    if (analyses.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to analyze any ads',
        },
        { status: 500 },
      )
    }

    // ========== GENERATE REPORT ==========
    let report = undefined
    if (body.generate_report !== false) {
      // Generate report by default unless explicitly disabled
      try {
        console.log('Generating opportunity report...')
        report = await generateOpportunityReport(analyses, input.market_name, input.country)
      } catch (error) {
        console.error('Error generating report:', error)
        // Continue even if report generation fails - return analyses only
      }
    }

    // ========== RESPONSE ==========
    return NextResponse.json(
      {
        success: true,
        data: {
          analyses,
          report,
          summary: {
            total_ads_analyzed: analyses.length,
            analysis_timestamp: new Date().toISOString(),
            market: input.market_name,
            country: input.country,
          },
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    )
  } catch (error) {
    // ========== ERROR HANDLING ==========
    const message = error instanceof Error ? error.message : 'Unknown error'

    console.error('Error in /api/ai/analyze:', message)

    // Check if it's an API error
    if (message.includes('Claude API error') || message.includes('Could not extract JSON')) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI analysis service error. Please try again.',
          details: process.env.NODE_ENV === 'development' ? { message } : undefined,
        },
        { status: 503 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred during analysis',
        details: process.env.NODE_ENV === 'development' ? { message } : undefined,
      },
      { status: 500 },
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
export const maxDuration = 60 // 60 second timeout for analysis
