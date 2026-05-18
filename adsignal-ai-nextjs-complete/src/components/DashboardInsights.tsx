'use client'

import { Lightbulb, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { mockInsights, mockBrands, AdInsight } from '@/lib/mock-data'

const impactColors = {
  high: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  medium: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700',
  low: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
}

const impactBadgeColors = {
  high: 'bg-green-600 text-white',
  medium: 'bg-amber-600 text-white',
  low: 'bg-blue-600 text-white',
}

export function OpportunitiesSection() {
  return (
    <div className="card-premium p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="heading-3">Market opportunities</h2>
          <p className="text-muted text-sm">Gaps where competitors aren't focusing</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {mockInsights.slice(0, 3).map((insight) => (
          <OpportunityCard key={insight.id} insight={insight} />
        ))}
      </div>

      <button className="w-full px-4 py-3 border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition">
        See all {mockInsights.length} opportunities
      </button>
    </div>
  )
}

function OpportunityCard({ insight }: { insight: AdInsight }) {
  return (
    <div
      className={`p-4 rounded-xl border ${impactColors[insight.impact]}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
          {insight.title}
        </h3>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${impactBadgeColors[insight.impact]}`}
        >
          {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)} Impact
        </span>
      </div>
      <p className="text-xs text-slate-700 dark:text-slate-300 mb-2">
        {insight.description}
      </p>
      <div className="flex items-center gap-2">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Only <span className="font-bold">{insight.prevalence}%</span> of ads mention this
        </div>
        <TrendingUp className="w-3 h-3 text-green-600" />
      </div>
    </div>
  )
}

export function BrandsTable() {
  const statusColors = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    growing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    stable: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    declining: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  }

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="heading-3">All brands</h2>
        <p className="text-muted text-sm mt-1">Complete advertiser list in this market</p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="text-left py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Brand
              </th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Active ads
              </th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Avg age
              </th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">
                Status
              </th>
              <th className="text-center py-3 px-4 font-semibold text-slate-900 dark:text-white">
              </th>
            </tr>
          </thead>
          <tbody>
            {mockBrands.map((brand) => (
              <tr
                key={brand.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
              >
                <td className="py-4 px-4 font-medium text-slate-900 dark:text-white">
                  {brand.name}
                </td>
                <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400">
                  {brand.adCount}
                </td>
                <td className="py-4 px-4 text-center text-slate-600 dark:text-slate-400">
                  {brand.averageAdAge}d
                </td>
                <td className="py-4 px-4 text-center">
                  <span
                    className={`badge ${statusColors[brand.status]}`}
                  >
                    {brand.status.charAt(0).toUpperCase() + brand.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <Link
                    href={`/brand/${brand.id}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {mockBrands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brand/${brand.id}`}
            className="block p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                {brand.name}
              </h3>
              <span className={`badge ${statusColors[brand.status]}`}>
                {brand.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <p className="text-muted mb-1">Active ads</p>
                <p className="font-bold text-slate-900 dark:text-white">{brand.adCount}</p>
              </div>
              <div>
                <p className="text-muted mb-1">Avg age</p>
                <p className="font-bold text-slate-900 dark:text-white">{brand.averageAdAge}d</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function BrandCard({ brandId }: { brandId: string }) {
  const brand = mockBrands.find(b => b.id === brandId)
  if (!brand) return null

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="heading-2">{brand.name}</h1>
          <p className="text-muted mt-1">Active in this market with {brand.adCount} ads</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-muted text-sm mb-1">Active Ads</p>
          <p className="heading-3">{brand.adCount}</p>
        </div>
        <div>
          <p className="text-muted text-sm mb-1">Avg Age</p>
          <p className="heading-3">{brand.averageAdAge}d</p>
        </div>
        <div>
          <p className="text-muted text-sm mb-1">Newest</p>
          <p className="heading-3">{brand.newestAdDate}d</p>
        </div>
        <div>
          <p className="text-muted text-sm mb-1">Status</p>
          <p className="heading-3 capitalize text-blue-600">{brand.status}</p>
        </div>
      </div>
    </div>
  )
}
