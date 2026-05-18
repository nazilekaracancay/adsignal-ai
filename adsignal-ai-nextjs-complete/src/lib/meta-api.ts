/**
 * Meta Ad Library API Client
 * 
 * Handles all communication with Meta's Ad Library API
 * Includes proper error handling, typing, and request formatting
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface MetaAdLibraryResponse {
  data: MetaAd[]
  paging: {
    cursors: {
      before: string
      after: string
    }
    next?: string
    previous?: string
  }
}

export interface MetaAd {
  ad_archive_id: string
  page_name: string
  page_id: string
  ad_creative_body: string
  ad_creative_link_title?: string
  ad_creative_link_description?: string
  ad_creative_link_caption?: string
  ad_delivery_start_time: string | null
  ad_delivery_stop_time: string | null
  publisher_platforms: string[]
  ad_snapshot_url: string
  impressions?: {
    lower_bound: number
    upper_bound: number
  }
  spend?: {
    lower_bound: number
    upper_bound: number
  }
}

export interface NormalizedAd {
  id: string
  pageId: string
  pageName: string
  copy: string
  linkTitle?: string
  linkDescription?: string
  linkCaption?: string
  startDate: Date | null
  stopDate: Date | null
  platforms: string[]
  snapshotUrl: string
  isActive: boolean
  ageInDays: number
  impressions?: {
    min: number
    max: number
  }
  spend?: {
    min: number
    max: number
  }
}

export interface SearchParams {
  keyword: string
  country: string
  platform?: 'FACEBOOK' | 'INSTAGRAM' | 'AUDIENCE_NETWORK' | 'MESSENGER'
  limit?: number
  after?: string
}

export interface SearchResult {
  ads: NormalizedAd[]
  totalCount: number
  hasMore: boolean
  nextCursor?: string
  error?: string
}

// ============================================================================
// META API CONSTANTS
// ============================================================================

const META_GRAPH_API_VERSION = 'v18.0'
const META_API_BASE_URL = `https://graph.instagram.com/${META_GRAPH_API_VERSION}`

// Supported countries and their ISO codes
export const SUPPORTED_COUNTRIES = {
  US: 'US',
  UK: 'GB',
  CA: 'CA',
  AU: 'AU',
  DE: 'DE',
  FR: 'FR',
  IT: 'IT',
  ES: 'ES',
  JP: 'JP',
}

// Platform codes for Meta API
const PLATFORM_MAP: Record<string, string> = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  AUDIENCE_NETWORK: 'audience_network',
  MESSENGER: 'messenger',
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Normalize a Meta Ad Library API response into our internal format
 */
export function normalizeAd(ad: MetaAd): NormalizedAd {
  const startDate = ad.ad_delivery_start_time ? new Date(ad.ad_delivery_start_time) : null
  const stopDate = ad.ad_delivery_stop_time ? new Date(ad.ad_delivery_stop_time) : null
  
  // Calculate age in days
  const now = new Date()
  const ageInDays = startDate ? Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0
  
  // Determine if ad is currently active
  const isActive = !stopDate || stopDate > now

  return {
    id: ad.ad_archive_id,
    pageId: ad.page_id,
    pageName: ad.page_name,
    copy: ad.ad_creative_body || '',
    linkTitle: ad.ad_creative_link_title,
    linkDescription: ad.ad_creative_link_description,
    linkCaption: ad.ad_creative_link_caption,
    startDate,
    stopDate,
    platforms: ad.publisher_platforms || [],
    snapshotUrl: ad.ad_snapshot_url,
    isActive,
    ageInDays,
    impressions: ad.impressions
      ? {
          min: ad.impressions.lower_bound,
          max: ad.impressions.upper_bound,
        }
      : undefined,
    spend: ad.spend
      ? {
          min: ad.spend.lower_bound,
          max: ad.spend.upper_bound,
        }
      : undefined,
  }
}

/**
 * Format search parameters for Meta API query
 */
export function formatMetaSearchQuery(params: SearchParams): string {
  const parts: string[] = [params.keyword]

  if (params.country && SUPPORTED_COUNTRIES[params.country as keyof typeof SUPPORTED_COUNTRIES]) {
    parts.push(SUPPORTED_COUNTRIES[params.country as keyof typeof SUPPORTED_COUNTRIES])
  }

  if (params.platform && PLATFORM_MAP[params.platform]) {
    parts.push(PLATFORM_MAP[params.platform])
  }

  return parts.join(' ')
}

/**
 * Validate search parameters
 */
export function validateSearchParams(params: SearchParams): string | null {
  if (!params.keyword || params.keyword.trim().length === 0) {
    return 'Keyword is required'
  }

  if (!params.country || !SUPPORTED_COUNTRIES[params.country as keyof typeof SUPPORTED_COUNTRIES]) {
    return 'Valid country is required'
  }

  if (params.platform && !PLATFORM_MAP[params.platform]) {
    return 'Invalid platform'
  }

  if (params.limit && (params.limit < 1 || params.limit > 1000)) {
    return 'Limit must be between 1 and 1000'
  }

  return null
}

/**
 * Build Meta API request URL
 */
export function buildMetaApiUrl(params: SearchParams): string {
  const searchQuery = formatMetaSearchQuery(params)
  const queryParams = new URLSearchParams({
    search_terms: searchQuery,
    fields: [
      'ad_archive_id',
      'page_name',
      'page_id',
      'ad_creative_body',
      'ad_creative_link_title',
      'ad_creative_link_description',
      'ad_creative_link_caption',
      'ad_delivery_start_time',
      'ad_delivery_stop_time',
      'publisher_platforms',
      'ad_snapshot_url',
      'impressions',
      'spend',
    ].join(','),
    limit: String(params.limit || 100),
  })

  if (params.after) {
    queryParams.append('after', params.after)
  }

  return `${META_API_BASE_URL}/ads_archive?${queryParams.toString()}`
}

/**
 * Make request to Meta Ad Library API
 */
export async function fetchFromMetaApi(url: string, accessToken: string): Promise<MetaAdLibraryResponse> {
  const urlWithToken = `${url}&access_token=${accessToken}`

  const response = await fetch(urlWithToken, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    
    // Handle specific Meta API errors
    if (response.status === 400) {
      throw new Error(`Invalid request: ${errorData.error?.message || 'Bad request'}`)
    }
    if (response.status === 401) {
      throw new Error('Invalid or expired access token')
    }
    if (response.status === 403) {
      throw new Error('Access denied. Check token permissions.')
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.')
    }
    if (response.status === 500) {
      throw new Error('Meta API server error. Please try again later.')
    }

    throw new Error(`Meta API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * Search for ads in Meta Ad Library
 */
export async function searchMetaAds(params: SearchParams, accessToken: string): Promise<SearchResult> {
  try {
    // Validate parameters
    const validationError = validateSearchParams(params)
    if (validationError) {
      return {
        ads: [],
        totalCount: 0,
        hasMore: false,
        error: validationError,
      }
    }

    // Check access token
    if (!accessToken) {
      return {
        ads: [],
        totalCount: 0,
        hasMore: false,
        error: 'Access token not configured',
      }
    }

    // Build API URL
    const url = buildMetaApiUrl(params)

    // Fetch from Meta API
    const response = await fetchFromMetaApi(url, accessToken)

    // Normalize ads
    const normalizedAds = response.data.map(normalizeAd)

    return {
      ads: normalizedAds,
      totalCount: response.data.length,
      hasMore: !!response.paging?.next,
      nextCursor: response.paging?.cursors?.after,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    return {
      ads: [],
      totalCount: 0,
      hasMore: false,
      error: message,
    }
  }
}

export default {
  normalizeAd,
  formatMetaSearchQuery,
  validateSearchParams,
  buildMetaApiUrl,
  fetchFromMetaApi,
  searchMetaAds,
}
