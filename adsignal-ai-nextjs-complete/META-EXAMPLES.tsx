/**
 * Meta Ads API Integration Examples
 * 
 * Copy and adapt these examples for your use case
 */

// ============================================================================
// EXAMPLE 1: Simple Search Component
// ============================================================================

'use client'

import { useMetaAdsSearch } from '@/hooks/useMetaAdsSearch'

export function SimpleSearchExample() {
  const { ads, isLoading, error, search } = useMetaAdsSearch()

  return (
    <div>
      <button
        onClick={() => search({ keyword: 'fitness', country: 'US' })}
        disabled={isLoading}
      >
        {isLoading ? 'Searching...' : 'Search Ads'}
      </button>

      {error && <p className="error">{error}</p>}

      {ads.map(ad => (
        <div key={ad.id}>
          <h3>{ad.pageName}</h3>
          <p>{ad.copy}</p>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// EXAMPLE 2: Search with Filters
// ============================================================================

'use client'

import { useState } from 'react'
import { useMetaAdsSearch } from '@/hooks/useMetaAdsSearch'

export function FilteredSearchExample() {
  const [keyword, setKeyword] = useState('')
  const [country, setCountry] = useState('US')
  const [platform, setPlatform] = useState('')
  const { ads, isLoading, error, search } = useMetaAdsSearch()

  const handleSearch = () => {
    search({
      keyword,
      country,
      ...(platform && { platform: platform as any }),
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label>Keyword</label>
        <input
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="e.g., fitness app"
        />
      </div>

      <div>
        <label>Country</label>
        <select value={country} onChange={e => setCountry(e.target.value)}>
          <option value="US">United States</option>
          <option value="UK">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
        </select>
      </div>

      <div>
        <label>Platform (Optional)</label>
        <select value={platform} onChange={e => setPlatform(e.target.value)}>
          <option value="">All Platforms</option>
          <option value="FACEBOOK">Facebook</option>
          <option value="INSTAGRAM">Instagram</option>
          <option value="AUDIENCE_NETWORK">Audience Network</option>
          <option value="MESSENGER">Messenger</option>
        </select>
      </div>

      <button onClick={handleSearch} disabled={!keyword || isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>

      {error && <div className="error">{error}</div>}
      <div className="results">{ads.length} ads found</div>
    </div>
  )
}

// ============================================================================
// EXAMPLE 3: Pagination Example
// ============================================================================

'use client'

import { useMetaAdsSearch } from '@/hooks/useMetaAdsSearch'

export function PaginationExample() {
  const { ads, hasMore, isLoading, error, search, loadMore } = useMetaAdsSearch()

  const handleSearch = () => {
    search({ keyword: 'fitness', country: 'US', limit: 20 })
  }

  const handleLoadMore = () => {
    loadMore({ keyword: 'fitness', country: 'US', limit: 20 })
  }

  return (
    <div>
      <button onClick={handleSearch} disabled={isLoading}>
        Start Search
      </button>

      {error && <p className="error">{error}</p>}

      <div className="ads-grid">
        {ads.map(ad => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      {hasMore && (
        <button onClick={handleLoadMore} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load More'}
        </button>
      )}

      <p className="text-muted">Showing {ads.length} ads</p>
    </div>
  )
}

// ============================================================================
// EXAMPLE 4: Fetch Implementation (without hook)
// ============================================================================

async function searchMetaAdsDirectly(keyword: string, country: string) {
  try {
    const response = await fetch('/api/meta-ads/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword,
        country,
        limit: 50,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error)
    }

    return data.data.ads
  } catch (error) {
    console.error('Search failed:', error)
    throw error
  }
}

// Usage
async function main() {
  try {
    const ads = await searchMetaAdsDirectly('fitness', 'US')
    console.log(`Found ${ads.length} ads`)
  } catch (error) {
    console.error('Error:', error)
  }
}

// ============================================================================
// EXAMPLE 5: Error Handling
// ============================================================================

'use client'

import { useMetaAdsSearch } from '@/hooks/useMetaAdsSearch'

export function ErrorHandlingExample() {
  const { ads, isLoading, error, rateLimit, search } = useMetaAdsSearch()

  const handleSearch = async () => {
    const result = await search({
      keyword: 'fitness',
      country: 'US',
    })

    if (!result.success) {
      if (result.error?.includes('rate limit')) {
        // Handle rate limit
        const resetSeconds = rateLimit?.resetInSeconds || 60
        alert(`Too many requests. Wait ${resetSeconds} seconds.`)
      } else if (result.error?.includes('Invalid')) {
        // Handle validation error
        alert('Check your input parameters')
      } else {
        // Handle other errors
        alert(`Error: ${result.error}`)
      }
    }
  }

  return (
    <div>
      <button onClick={handleSearch} disabled={isLoading}>
        Search
      </button>

      {/* Rate Limit Warning */}
      {rateLimit && rateLimit.remaining < 10 && (
        <div className="warning">
          Only {rateLimit.remaining} requests remaining. Reset in {rateLimit.resetInSeconds}s
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error">
          <p>Search failed:</p>
          <p>{error}</p>
          {rateLimit && (
            <p>Retry after {rateLimit.resetInSeconds} seconds</p>
          )}
        </div>
      )}

      {/* Results */}
      {ads.length > 0 && (
        <div className="success">
          Found {ads.length} ads
        </div>
      )}
    </div>
  )
}

// ============================================================================
// EXAMPLE 6: Caching Results
// ============================================================================

'use client'

import { useMetaAdsSearch } from '@/hooks/useMetaAdsSearch'
import { useCallback, useState } from 'react'

export function CachingExample() {
  const [cache, setCache] = useState(new Map())
  const { search } = useMetaAdsSearch()

  const searchWithCache = useCallback(
    async (keyword: string, country: string) => {
      const key = `${keyword}:${country}`

      // Check cache
      if (cache.has(key)) {
        console.log('Returning cached result')
        return cache.get(key)
      }

      // Search
      const result = await search({ keyword, country })

      // Store in cache
      if (result.success) {
        setCache(prev => new Map(prev).set(key, result.data))
      }

      return result
    },
    [cache, search],
  )

  return (
    <div>
      <button onClick={() => searchWithCache('fitness', 'US')}>
        Search (cached)
      </button>
      <p>{cache.size} items in cache</p>
    </div>
  )
}

// ============================================================================
// EXAMPLE 7: Analytics Tracking
// ============================================================================

'use client'

import { useMetaAdsSearch } from '@/hooks/useMetaAdsSearch'

export function AnalyticsExample() {
  const { ads, isLoading, error, search } = useMetaAdsSearch()

  const handleSearch = async (keyword: string, country: string) => {
    const startTime = Date.now()

    const result = await search({ keyword, country })

    const duration = Date.now() - startTime

    // Track search
    if (window.gtag) {
      window.gtag('event', 'meta_ads_search', {
        keyword,
        country,
        duration_ms: duration,
        result_count: result.data?.ads.length || 0,
        success: result.success,
        error: result.error || null,
      })
    }

    return result
  }

  return (
    <div>
      <button onClick={() => handleSearch('fitness', 'US')}>
        Search with Analytics
      </button>
    </div>
  )
}

// ============================================================================
// EXAMPLE 8: Custom Hook with Auto-Retry
// ============================================================================

'use client'

import { useMetaAdsSearch } from '@/hooks/useMetaAdsSearch'
import { useCallback } from 'react'

export function useMetaAdsSearchWithRetry() {
  const metaSearch = useMetaAdsSearch()

  const searchWithRetry = useCallback(
    async (params: any, maxRetries = 3) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const result = await metaSearch.search(params)

        if (result.success) {
          return result
        }

        // Check if retryable error
        if (result.error?.includes('rate limit')) {
          if (attempt < maxRetries) {
            const resetSeconds = metaSearch.rateLimit?.resetInSeconds || 60
            console.log(`Retry ${attempt}/${maxRetries} after ${resetSeconds}s`)
            await new Promise(resolve => setTimeout(resolve, resetSeconds * 1000))
            continue
          }
        }

        // Non-retryable error
        return result
      }

      return { success: false, error: 'Max retries exceeded' }
    },
    [metaSearch],
  )

  return { ...metaSearch, searchWithRetry }
}

// Usage
export function RetryExample() {
  const { searchWithRetry, ads, isLoading, error } = useMetaAdsSearchWithRetry()

  return (
    <div>
      <button onClick={() => searchWithRetry({ keyword: 'fitness', country: 'US' })}>
        Search with Auto-Retry
      </button>
      {isLoading && <p>Searching (with auto-retry)...</p>}
      {error && <p>Error: {error}</p>}
      {ads.length > 0 && <p>Found {ads.length} ads</p>}
    </div>
  )
}

// ============================================================================
// EXAMPLE 9: Display Ad Card Component
// ============================================================================

'use client'

import { NormalizedAd } from '@/lib/meta-api'

export function AdCard({ ad }: { ad: NormalizedAd }) {
  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="border rounded-lg p-4">
      {/* Brand and Status */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold">{ad.pageName}</h3>
          <p className="text-xs text-gray-500">{ad.id}</p>
        </div>
        {ad.isActive && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Active
          </span>
        )}
      </div>

      {/* Copy */}
      <p className="text-sm mb-3 line-clamp-3">{ad.copy}</p>

      {/* Link Info */}
      {ad.linkTitle && (
        <div className="text-sm mb-3 p-2 bg-gray-100 rounded">
          <p className="font-semibold">{ad.linkTitle}</p>
          {ad.linkCaption && <p className="text-gray-600">{ad.linkCaption}</p>}
        </div>
      )}

      {/* Platforms and Dates */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div>
          <p className="text-gray-500">Platforms</p>
          <div className="flex flex-wrap gap-1">
            {ad.platforms.map(p => (
              <span key={p} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {p}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-500">Active</p>
          <p>{ad.ageInDays} days</p>
        </div>
      </div>

      {/* Metrics */}
      {ad.impressions && (
        <div className="text-xs mb-3 p-2 bg-gray-50 rounded">
          <p className="text-gray-500">Est. Impressions</p>
          <p className="font-semibold">
            {ad.impressions.min.toLocaleString()} - {ad.impressions.max.toLocaleString()}
          </p>
        </div>
      )}

      {/* Snapshot Link */}
      {ad.snapshotUrl && (
        <a href={ad.snapshotUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs">
          View Snapshot →
        </a>
      )}
    </div>
  )
}

// ============================================================================
// EXPORT EXAMPLES
// ============================================================================

export const EXAMPLES = {
  SimpleSearch: SimpleSearchExample,
  FilteredSearch: FilteredSearchExample,
  Pagination: PaginationExample,
  ErrorHandling: ErrorHandlingExample,
  Caching: CachingExample,
  Analytics: AnalyticsExample,
  Retry: RetryExample,
  AdCard: AdCard,
}
