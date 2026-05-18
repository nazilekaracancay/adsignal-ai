/**
 * useMetaAdsSearch Hook
 * 
 * Client-side hook for searching Meta ads via the API
 * Handles loading, error, and success states
 */

'use client'

import { useState, useCallback } from 'react'
import { NormalizedAd } from '@/lib/meta-api'

interface SearchRequest {
  keyword: string
  country: string
  platform?: string
  limit?: number
  after?: string
}

interface SearchResponse {
  success: boolean
  data?: {
    ads: NormalizedAd[]
    totalCount: number
    hasMore: boolean
    nextCursor?: string
  }
  error?: string
  rateLimit?: {
    remaining: number
    resetInSeconds: number
  }
}

interface SearchState {
  ads: NormalizedAd[]
  isLoading: boolean
  error: string | null
  totalCount: number
  hasMore: boolean
  nextCursor?: string
  rateLimit?: {
    remaining: number
    resetInSeconds: number
  }
}

const initialState: SearchState = {
  ads: [],
  isLoading: false,
  error: null,
  totalCount: 0,
  hasMore: false,
}

export function useMetaAdsSearch() {
  const [state, setState] = useState<SearchState>(initialState)

  /**
   * Search for ads
   */
  const search = useCallback(async (params: SearchRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch('/api/meta-ads/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      const data: SearchResponse = await response.json()

      if (!data.success) {
        const errorMessage = data.error || 'Failed to search ads'
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          rateLimit: data.rateLimit,
        }))
        return { success: false, error: errorMessage }
      }

      setState({
        ads: data.data?.ads || [],
        isLoading: false,
        error: null,
        totalCount: data.data?.totalCount || 0,
        hasMore: data.data?.hasMore || false,
        nextCursor: data.data?.nextCursor,
        rateLimit: data.rateLimit,
      })

      return { success: true, data: data.data }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error'
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }))
      return { success: false, error: message }
    }
  }, [])

  /**
   * Load more ads using pagination cursor
   */
  const loadMore = useCallback(
    async (params: Omit<SearchRequest, 'after'>) => {
      if (!state.nextCursor) {
        return { success: false, error: 'No more results available' }
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await fetch('/api/meta-ads/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...params, after: state.nextCursor }),
        })

        const data: SearchResponse = await response.json()

        if (!data.success) {
          const errorMessage = data.error || 'Failed to load more ads'
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: errorMessage,
            rateLimit: data.rateLimit,
          }))
          return { success: false, error: errorMessage }
        }

        setState(prev => ({
          ads: [...prev.ads, ...(data.data?.ads || [])],
          isLoading: false,
          error: null,
          totalCount: prev.totalCount + (data.data?.totalCount || 0),
          hasMore: data.data?.hasMore || false,
          nextCursor: data.data?.nextCursor,
          rateLimit: data.rateLimit,
        }))

        return { success: true, data: data.data }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Network error'
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: message,
        }))
        return { success: false, error: message }
      }
    },
    [state.nextCursor],
  )

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    // State
    ads: state.ads,
    isLoading: state.isLoading,
    error: state.error,
    totalCount: state.totalCount,
    hasMore: state.hasMore,
    nextCursor: state.nextCursor,
    rateLimit: state.rateLimit,

    // Methods
    search,
    loadMore,
    reset,
  }
}

export default useMetaAdsSearch
