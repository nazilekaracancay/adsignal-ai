/**
 * useAiAnalysis Hook
 * 
 * Client-side hook for analyzing ads with Claude AI
 * Returns structured analysis and opportunity report
 */

'use client'

import { useState, useCallback } from 'react'
import { type AdAnalysis, type OpportunityReport } from '@/lib/ai-analysis'

interface AnalysisRequest {
  ads: Array<{
    id: string
    page_name: string
    copy: string
    platforms?: string[]
  }>
  market_name: string
  country?: string
  generate_report?: boolean
}

interface AnalysisResponse {
  success: boolean
  data?: {
    analyses: AdAnalysis[]
    report?: OpportunityReport
    summary: {
      total_ads_analyzed: number
      analysis_timestamp: string
      market: string
      country: string
    }
  }
  error?: string
  details?: Record<string, any>
}

interface AnalysisState {
  analyses: AdAnalysis[]
  report: OpportunityReport | null
  isLoading: boolean
  error: string | null
  progress: {
    current: number
    total: number
  }
  summary: {
    total_ads_analyzed: number
    analysis_timestamp: string
    market: string
    country: string
  } | null
}

const initialState: AnalysisState = {
  analyses: [],
  report: null,
  isLoading: false,
  error: null,
  progress: {
    current: 0,
    total: 0,
  },
  summary: null,
}

export function useAiAnalysis() {
  const [state, setState] = useState<AnalysisState>(initialState)

  /**
   * Analyze ads
   */
  const analyze = useCallback(async (request: AnalysisRequest) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      progress: { current: 0, total: request.ads.length },
    }))

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...request,
          generate_report: request.generate_report !== false, // Default to true
        }),
      })

      const data: AnalysisResponse = await response.json()

      if (!data.success) {
        const errorMessage = data.error || 'Failed to analyze ads'
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }))
        return { success: false, error: errorMessage }
      }

      setState({
        analyses: data.data?.analyses || [],
        report: data.data?.report || null,
        isLoading: false,
        error: null,
        progress: {
          current: request.ads.length,
          total: request.ads.length,
        },
        summary: data.data?.summary || null,
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
   * Reset state
   */
  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    // State
    analyses: state.analyses,
    report: state.report,
    isLoading: state.isLoading,
    error: state.error,
    progress: state.progress,
    summary: state.summary,

    // Methods
    analyze,
    reset,
  }
}

export default useAiAnalysis
