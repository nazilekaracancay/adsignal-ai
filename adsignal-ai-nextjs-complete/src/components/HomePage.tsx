'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Sparkles } from 'lucide-react'
import { getSearchSuggestions } from '@/lib/mock-data'

export function HomePage() {
  const router = useRouter()
  const [keyword, setKeyword] = useState('')
  const [country, setCountry] = useState('US')
  const [isLoading, setIsLoading] = useState(false)

  const suggestions = getSearchSuggestions()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setIsLoading(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const params = new URLSearchParams({
      keyword: keyword.trim(),
      country,
    })
    router.push(`/dashboard?${params.toString()}`)
  }

  const handleSuggestion = (suggestion: string) => {
    setKeyword(suggestion)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-blue-950 dark:to-purple-950">
      <div className="container-main py-20 sm:py-32">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              AI-powered ad intelligence
            </span>
          </div>

          <h1 className="heading-1 mb-6 max-w-3xl mx-auto">
            Discover Winning{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ad Strategies
            </span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
            Analyze competitor ads on Meta, uncover copy patterns, emotional triggers, and market opportunities with AI-powered insights.
          </p>
        </div>

        {/* Search Card */}
        <div className="card max-w-2xl mx-auto p-8 mb-16">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Keyword Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What market do you want to analyze?
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g., protein powder, skincare, fitness app..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="input-base pl-12"
                  autoFocus
                />
              </div>
            </div>

            {/* Country Select */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input-base"
              >
                <option value="US">🇺🇸 United States</option>
                <option value="UK">🇬🇧 United Kingdom</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="AU">🇦🇺 Australia</option>
                <option value="DE">🇩🇪 Germany</option>
                <option value="FR">🇫🇷 France</option>
                <option value="IT">🇮🇹 Italy</option>
                <option value="ES">🇪🇸 Spain</option>
                <option value="JP">🇯🇵 Japan</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !keyword.trim()}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Ads
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Suggested Keywords */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-3 uppercase tracking-wide">
              Try searching for
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 6).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestion(suggestion)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <FeatureCard
            icon="📊"
            title="Brand Analysis"
            description="See which brands dominate your market and how they structure their ads"
          />
          <FeatureCard
            icon="🎯"
            title="Copy Patterns"
            description="Discover the most effective hooks, guarantees, and messaging strategies"
          />
          <FeatureCard
            icon="💡"
            title="Opportunity Gaps"
            description="Find untapped messaging angles competitors aren't using"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="card p-6 text-center hover:border-slate-300 dark:hover:border-slate-700 transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="heading-3 mb-2">{title}</h3>
      <p className="text-muted text-sm">{description}</p>
    </div>
  )
}
