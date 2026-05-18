/**
 * AI Ad Analysis Utility
 * 
 * Uses Claude AI to analyze ad copy and classify key elements
 * Returns structured JSON for easy integration
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AdAnalysis {
  ad_id: string
  page_name: string
  copy: string
  analysis: {
    hook_type: string
    pain_point: string
    emotional_trigger: string
    offer_type: string
    cta: string
    awareness_level: 'unaware' | 'problem_aware' | 'solution_aware' | 'product_aware' | 'brand_aware'
    creative_angle: string
    why_it_may_work: string
  }
  extracted_elements: {
    hook: string | null
    benefit: string | null
    proof: string | null
    urgency: string | null
  }
}

export interface OpportunityReport {
  market_summary: {
    total_ads_analyzed: number
    date_generated: string
    primary_market: string
    country: string
  }
  what_brands_are_doing: {
    most_common_hook: string
    most_common_angle: string
    most_common_trigger: string
    average_copy_length: number
    primary_awareness_level_targeted: string
    most_common_offer: string
  }
  hook_analysis: {
    overused_hooks: Array<{
      hook: string
      prevalence_percent: number
      recommendation: string
    }>
    underused_hooks: Array<{
      hook: string
      gap_percent: number
      potential_upside: string
      why_differentiated: string
    }>
    emerging_patterns: Array<{
      pattern: string
      found_in_percent: number
      potential: string
    }>
  }
  market_saturation: {
    saturation_score: number // 0-100
    saturation_level: 'low' | 'moderate' | 'high' | 'very_high'
    explanation: string
    white_space_opportunities: string[]
  }
  recommended_entry_angle: {
    primary_angle: string
    why_it_works: string
    differentiation_factors: string[]
    target_audience_gap: string
    positioning_brief: string
  }
  recommended_hooks: Array<{
    rank: number
    hook: string
    why_effective: string
    when_to_use: string
    example_copy: string
    estimated_ctr_boost: string
  }>
  landing_page_positioning: Array<{
    position_number: number
    positioning: string
    headline_example: string
    subheadline_example: string
    why_resonates: string
    competitive_advantage: string
  }>
  action_items: {
    immediate: string[]
    short_term_30_days: string[]
    long_term_90_days: string[]
  }
}

export interface AnalysisInput {
  ads: Array<{
    id: string
    page_name: string
    copy: string
    platforms?: string[]
  }>
  market_name: string
  country?: string
  context?: string
}

// ============================================================================
// PROMPTS
// ============================================================================

const AD_ANALYSIS_SYSTEM_PROMPT = `You are an expert advertising analyst specializing in e-commerce and DTC marketing. Your job is to analyze ad copy and classify key elements that make ads effective.

Analyze ads with precision and depth. Look for psychological triggers, marketing techniques, and positioning strategies.

Return ONLY valid JSON - no markdown, no explanations, no extra text.`

const AD_ANALYSIS_USER_PROMPT = (adCopy: string) => `Analyze this ad copy and return a JSON object with the following structure:

{
  "hook_type": "type of hook used (e.g., curiosity, benefit, social_proof, urgency, scarcity, transformation)",
  "pain_point": "the main problem/pain point being addressed",
  "emotional_trigger": "primary emotion being triggered (e.g., FOMO, aspiration, fear, belonging, empowerment, reward)",
  "offer_type": "type of offer (e.g., discount, limited_time, free_shipping, bundle, money_back_guarantee, exclusive_access)",
  "cta": "exact call-to-action text or summarized action requested",
  "awareness_level": "target awareness stage (unaware, problem_aware, solution_aware, product_aware, brand_aware)",
  "creative_angle": "main positioning angle (e.g., before_after, social_proof, premium, lifestyle, scientific, community)",
  "why_it_may_work": "2-3 sentence explanation of why this approach is effective",
  "extracted_elements": {
    "hook": "the specific hook sentence if present",
    "benefit": "main benefit statement if present",
    "proof": "proof element (testimonial, stat, etc) if present",
    "urgency": "urgency trigger if present"
  }
}

Ad copy to analyze:
${adCopy}`

const OPPORTUNITY_REPORT_SYSTEM_PROMPT = `You are a strategic marketing consultant analyzing market trends in e-commerce and DTC. You have deep expertise in:
- Market saturation analysis
- Copy and positioning strategy
- Emotional psychology in marketing
- Differentiation and white space opportunities
- Landing page positioning

Provide actionable, specific recommendations that a non-technical founder can immediately implement.

Return ONLY valid JSON - no markdown, no explanations, no extra text.`

const OPPORTUNITY_REPORT_USER_PROMPT = (
  marketName: string,
  country: string,
  analysisResults: AdAnalysis[]
) => {
  const hooks = analysisResults.map(a => a.analysis.hook_type)
  const angles = analysisResults.map(a => a.analysis.creative_angle)
  const triggers = analysisResults.map(a => a.analysis.emotional_trigger)
  const offers = analysisResults.map(a => a.analysis.offer_type)
  const awareness = analysisResults.map(a => a.analysis.awareness_level)

  return `Analyze this market data and generate a comprehensive opportunity report.

Market: ${marketName} in ${country}
Total ads analyzed: ${analysisResults.length}

Hook types distribution: ${JSON.stringify(hooks)}
Creative angles used: ${JSON.stringify(angles)}
Emotional triggers: ${JSON.stringify(triggers)}
Offer types: ${JSON.stringify(offers)}
Awareness levels: ${JSON.stringify(awareness)}

Return a JSON object with this exact structure:

{
  "market_summary": {
    "total_ads_analyzed": ${analysisResults.length},
    "date_generated": "${new Date().toISOString()}",
    "primary_market": "${marketName}",
    "country": "${country}"
  },
  "what_brands_are_doing": {
    "most_common_hook": "hook with highest prevalence and why",
    "most_common_angle": "positioning angle most brands use",
    "most_common_trigger": "emotional trigger used most",
    "average_copy_length": "estimated average words",
    "primary_awareness_level_targeted": "which stage most ads target",
    "most_common_offer": "offer type brands rely on most"
  },
  "hook_analysis": {
    "overused_hooks": [
      {
        "hook": "hook name",
        "prevalence_percent": number,
        "recommendation": "why it's overused and what to avoid"
      }
    ],
    "underused_hooks": [
      {
        "hook": "hook name that's underutilized",
        "gap_percent": number,
        "potential_upside": "why using this would differentiate",
        "why_differentiated": "how it would stand out"
      }
    ],
    "emerging_patterns": [
      {
        "pattern": "pattern name",
        "found_in_percent": number,
        "potential": "why this pattern matters"
      }
    ]
  },
  "market_saturation": {
    "saturation_score": "number 0-100",
    "saturation_level": "low/moderate/high/very_high",
    "explanation": "why the market is at this saturation level",
    "white_space_opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"]
  },
  "recommended_entry_angle": {
    "primary_angle": "the best angle to enter this market with",
    "why_it_works": "why this angle will resonate",
    "differentiation_factors": ["factor 1", "factor 2", "factor 3"],
    "target_audience_gap": "which audience segment is underserved",
    "positioning_brief": "one sentence positioning strategy"
  },
  "recommended_hooks": [
    {
      "rank": 1,
      "hook": "specific hook to use",
      "why_effective": "why this hook will work in this market",
      "when_to_use": "best context/audience for this hook",
      "example_copy": "sample ad copy using this hook (1-2 sentences)",
      "estimated_ctr_boost": "expected improvement vs market average"
    }
  ],
  "landing_page_positioning": [
    {
      "position_number": 1,
      "positioning": "positioning angle for landing page",
      "headline_example": "specific headline to test",
      "subheadline_example": "supporting subheadline",
      "why_resonates": "why this resonates with the market",
      "competitive_advantage": "how this positions against competitors"
    }
  ],
  "action_items": {
    "immediate": ["action 1", "action 2"],
    "short_term_30_days": ["action 1", "action 2"],
    "long_term_90_days": ["action 1", "action 2"]
  }
}

Generate specific, actionable, founder-friendly recommendations.`
}

// ============================================================================
// ANTHROPIC API INTEGRATION
// ============================================================================

/**
 * Call Claude API for ad analysis
 */
async function callClaudeAPI(
  systemPrompt: string,
  userPrompt: string,
  retries = 3
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set')
  }

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Claude API error: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      const content = data.content[0]?.text || ''

      if (!content) {
        throw new Error('No content in Claude response')
      }

      return content
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < retries) {
        // Wait before retry (exponential backoff)
        const delay = Math.pow(2, attempt - 1) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('Failed to call Claude API after retries')
}

/**
 * Extract JSON from Claude response (handles markdown wrapping)
 */
function extractJSON(response: string): Record<string, any> {
  try {
    // Try parsing directly first
    return JSON.parse(response)
  } catch {
    // Try extracting from markdown code blocks
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1])
    }

    // Try extracting from backticks
    const backtickMatch = response.match(/```\n?([\s\S]*?)\n?```/)
    if (backtickMatch) {
      return JSON.parse(backtickMatch[1])
    }

    // If still no luck, find the first { and last } and try that
    const start = response.indexOf('{')
    const end = response.lastIndexOf('}')
    if (start !== -1 && end !== -1) {
      return JSON.parse(response.substring(start, end + 1))
    }

    throw new Error('Could not extract JSON from response')
  }
}

// ============================================================================
// ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Analyze a single ad using Claude
 */
export async function analyzeAd(adCopy: string, adId: string, pageName: string): Promise<AdAnalysis> {
  try {
    const prompt = AD_ANALYSIS_USER_PROMPT(adCopy)
    const response = await callClaudeAPI(AD_ANALYSIS_SYSTEM_PROMPT, prompt)
    const analysisData = extractJSON(response)

    return {
      ad_id: adId,
      page_name: pageName,
      copy: adCopy,
      analysis: {
        hook_type: analysisData.hook_type || 'unknown',
        pain_point: analysisData.pain_point || 'not identified',
        emotional_trigger: analysisData.emotional_trigger || 'not identified',
        offer_type: analysisData.offer_type || 'none',
        cta: analysisData.cta || 'not specified',
        awareness_level: analysisData.awareness_level || 'unaware',
        creative_angle: analysisData.creative_angle || 'not identified',
        why_it_may_work: analysisData.why_it_may_work || 'unclear',
      },
      extracted_elements: analysisData.extracted_elements || {
        hook: null,
        benefit: null,
        proof: null,
        urgency: null,
      },
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error(`Failed to analyze ad ${adId}:`, errorMsg)
    throw error
  }
}

/**
 * Analyze multiple ads
 */
export async function analyzeAds(input: AnalysisInput): Promise<AdAnalysis[]> {
  const results: AdAnalysis[] = []

  for (const ad of input.ads) {
    try {
      const analysis = await analyzeAd(ad.copy, ad.id, ad.page_name)
      results.push(analysis)

      // Small delay between API calls to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error(`Error analyzing ad ${ad.id}:`, error)
      // Continue with next ad
    }
  }

  return results
}

/**
 * Generate opportunity report from analyzed ads
 */
export async function generateOpportunityReport(
  analyses: AdAnalysis[],
  marketName: string,
  country: string = 'US'
): Promise<OpportunityReport> {
  if (analyses.length === 0) {
    throw new Error('No analyses provided for opportunity report')
  }

  try {
    const prompt = OPPORTUNITY_REPORT_USER_PROMPT(marketName, country, analyses)
    const response = await callClaudeAPI(OPPORTUNITY_REPORT_SYSTEM_PROMPT, prompt)
    const reportData = extractJSON(response)

    // Ensure all required fields exist
    return {
      market_summary: reportData.market_summary || {
        total_ads_analyzed: analyses.length,
        date_generated: new Date().toISOString(),
        primary_market: marketName,
        country,
      },
      what_brands_are_doing: reportData.what_brands_are_doing || {
        most_common_hook: 'unknown',
        most_common_angle: 'unknown',
        most_common_trigger: 'unknown',
        average_copy_length: 0,
        primary_awareness_level_targeted: 'unknown',
        most_common_offer: 'unknown',
      },
      hook_analysis: reportData.hook_analysis || {
        overused_hooks: [],
        underused_hooks: [],
        emerging_patterns: [],
      },
      market_saturation: reportData.market_saturation || {
        saturation_score: 50,
        saturation_level: 'moderate',
        explanation: 'Unknown',
        white_space_opportunities: [],
      },
      recommended_entry_angle: reportData.recommended_entry_angle || {
        primary_angle: 'unknown',
        why_it_works: 'unknown',
        differentiation_factors: [],
        target_audience_gap: 'unknown',
        positioning_brief: 'unknown',
      },
      recommended_hooks: reportData.recommended_hooks || [],
      landing_page_positioning: reportData.landing_page_positioning || [],
      action_items: reportData.action_items || {
        immediate: [],
        short_term_30_days: [],
        long_term_90_days: [],
      },
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('Failed to generate opportunity report:', errorMsg)
    throw error
  }
}

export default {
  analyzeAd,
  analyzeAds,
  generateOpportunityReport,
}
