/**
 * AI Analysis Display Components
 * 
 * Components for showing ad analysis and opportunity report
 * Designed to be founder-friendly and easy to understand
 */

'use client'

import { AdAnalysis, OpportunityReport } from '@/lib/ai-analysis'
import { TrendingUp, Lightbulb, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'

// ============================================================================
// AD ANALYSIS CARD
// ============================================================================

export function AdAnalysisCard({ analysis }: { analysis: AdAnalysis }) {
  const { analysis: data } = analysis

  return (
    <div className="card p-6 mb-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-bold text-slate-900 dark:text-white">{analysis.page_name}</h3>
          <p className="text-xs text-muted mt-1">ID: {analysis.ad_id}</p>
        </div>
      </div>

      {/* Ad Copy */}
      <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed line-clamp-3">
          {analysis.copy}
        </p>
      </div>

      {/* Key Elements */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <p className="text-xs text-muted font-medium mb-1">Hook Type</p>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">{data.hook_type}</p>
        </div>
        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
          <p className="text-xs text-muted font-medium mb-1">Pain Point</p>
          <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
            {data.pain_point}
          </p>
        </div>
        <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg">
          <p className="text-xs text-muted font-medium mb-1">Emotional Trigger</p>
          <p className="text-sm font-semibold text-pink-700 dark:text-pink-300">
            {data.emotional_trigger}
          </p>
        </div>
        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <p className="text-xs text-muted font-medium mb-1">Offer Type</p>
          <p className="text-sm font-semibold text-green-700 dark:text-green-300">
            {data.offer_type}
          </p>
        </div>
        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
          <p className="text-xs text-muted font-medium mb-1">Awareness Level</p>
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
            {data.awareness_level}
          </p>
        </div>
        <div className="p-2 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg">
          <p className="text-xs text-muted font-medium mb-1">Creative Angle</p>
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
            {data.creative_angle}
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mb-4 p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
        <p className="text-xs text-muted font-medium mb-1">Call-to-Action</p>
        <p className="text-sm text-slate-900 dark:text-white italic">"{data.cta}"</p>
      </div>

      {/* Why It Works */}
      <div className="p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">
              Why It Works
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-400 leading-relaxed">
              {data.why_it_may_work}
            </p>
          </div>
        </div>
      </div>

      {/* Extracted Elements */}
      {(analysis.extracted_elements.hook ||
        analysis.extracted_elements.benefit ||
        analysis.extracted_elements.proof ||
        analysis.extracted_elements.urgency) && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Extracted Elements
          </p>
          <div className="space-y-2 text-xs">
            {analysis.extracted_elements.hook && (
              <p>
                <span className="font-medium text-slate-600 dark:text-slate-400">Hook:</span>{' '}
                {analysis.extracted_elements.hook}
              </p>
            )}
            {analysis.extracted_elements.benefit && (
              <p>
                <span className="font-medium text-slate-600 dark:text-slate-400">Benefit:</span>{' '}
                {analysis.extracted_elements.benefit}
              </p>
            )}
            {analysis.extracted_elements.proof && (
              <p>
                <span className="font-medium text-slate-600 dark:text-slate-400">Proof:</span>{' '}
                {analysis.extracted_elements.proof}
              </p>
            )}
            {analysis.extracted_elements.urgency && (
              <p>
                <span className="font-medium text-slate-600 dark:text-slate-400">Urgency:</span>{' '}
                {analysis.extracted_elements.urgency}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// OPPORTUNITY REPORT DISPLAY
// ============================================================================

export function OpportunityReportDisplay({ report }: { report: OpportunityReport }) {
  return (
    <div className="space-y-8">
      {/* Market Summary */}
      <div className="card p-6">
        <h2 className="heading-2 mb-6">📊 Market Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-muted text-sm mb-1">Market</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {report.market_summary.primary_market}
            </p>
          </div>
          <div>
            <p className="text-muted text-sm mb-1">Country</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {report.market_summary.country}
            </p>
          </div>
          <div>
            <p className="text-muted text-sm mb-1">Ads Analyzed</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {report.market_summary.total_ads_analyzed}
            </p>
          </div>
          <div>
            <p className="text-muted text-sm mb-1">Analysis Date</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {new Date(report.market_summary.date_generated).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* What Brands Are Doing */}
      <div className="card p-6">
        <h2 className="heading-2 mb-6">🔍 What Brands Are Doing</h2>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Most Common Hook
            </p>
            <p className="text-slate-900 dark:text-white">{report.what_brands_are_doing.most_common_hook}</p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Most Common Angle
            </p>
            <p className="text-slate-900 dark:text-white">
              {report.what_brands_are_doing.most_common_angle}
            </p>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Emotional Trigger
            </p>
            <p className="text-slate-900 dark:text-white">
              {report.what_brands_are_doing.most_common_trigger}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Average Copy Length
              </p>
              <p className="text-slate-900 dark:text-white">
                {report.what_brands_are_doing.average_copy_length} words
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Most Common Offer
              </p>
              <p className="text-slate-900 dark:text-white">
                {report.what_brands_are_doing.most_common_offer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hook Analysis */}
      <div className="card p-6">
        <h2 className="heading-2 mb-6">🪝 Hook Analysis</h2>

        {/* Overused Hooks */}
        <div className="mb-8">
          <h3 className="heading-3 mb-4 text-red-600 dark:text-red-400">⚠️ Overused Hooks</h3>
          <div className="space-y-3">
            {report.hook_analysis.overused_hooks.map((hook, idx) => (
              <div key={idx} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{hook.hook}</h4>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    {hook.prevalence_percent}%
                  </span>
                </div>
                <p className="text-sm text-red-700 dark:text-red-300">{hook.recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Underused Hooks */}
        <div>
          <h3 className="heading-3 mb-4 text-green-600 dark:text-green-400">✨ Underused Hooks (Opportunity!)</h3>
          <div className="space-y-3">
            {report.hook_analysis.underused_hooks.map((hook, idx) => (
              <div key={idx} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{hook.hook}</h4>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {hook.gap_percent}% gap
                  </span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                  <strong>Potential Upside:</strong> {hook.potential_upside}
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Why Differentiated:</strong> {hook.why_differentiated}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Saturation */}
      <div className="card p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <h2 className="heading-2 mb-6">📈 Market Saturation Level</h2>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {report.market_saturation.saturation_level.toUpperCase()}
            </h3>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {report.market_saturation.saturation_score}/100
            </div>
          </div>
          <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
              style={{ width: `${report.market_saturation.saturation_score}%` }}
            />
          </div>
        </div>
        <p className="text-slate-900 dark:text-white mb-4">
          {report.market_saturation.explanation}
        </p>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">White Space Opportunities:</p>
          {report.market_saturation.white_space_opportunities.map((opp, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-900 dark:text-white">{opp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Entry Angle */}
      <div className="card p-6 border-2 border-green-400 dark:border-green-600">
        <h2 className="heading-2 mb-6 text-green-700 dark:text-green-400">🎯 Recommended Entry Angle</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {report.recommended_entry_angle.primary_angle}
            </h3>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              {report.recommended_entry_angle.why_it_works}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Differentiation Factors:
            </p>
            {report.recommended_entry_angle.differentiation_factors.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-2 mb-2">
                <ArrowRight className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-900 dark:text-white">{factor}</p>
              </div>
            ))}
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Audience Gap
            </p>
            <p className="text-sm text-slate-900 dark:text-white">
              {report.recommended_entry_angle.target_audience_gap}
            </p>
          </div>

          <div className="p-4 bg-slate-900 dark:bg-slate-800 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">POSITIONING BRIEF</p>
            <p className="text-white font-semibold">"{report.recommended_entry_angle.positioning_brief}"</p>
          </div>
        </div>
      </div>

      {/* Recommended Hooks */}
      <div className="card p-6">
        <h2 className="heading-2 mb-6">🪝 5 Recommended Ad Hooks</h2>
        <div className="space-y-4">
          {report.recommended_hooks.map((hook) => (
            <div
              key={hook.rank}
              className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  #{hook.rank}: {hook.hook}
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    WHY IT WORKS
                  </p>
                  <p className="text-sm text-slate-900 dark:text-white">{hook.why_effective}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    WHEN TO USE
                  </p>
                  <p className="text-sm text-slate-900 dark:text-white">{hook.when_to_use}</p>
                </div>

                <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    EXAMPLE COPY
                  </p>
                  <p className="text-sm text-slate-900 dark:text-white italic">"{hook.example_copy}"</p>
                </div>

                <div className="flex items-center gap-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                    Est. CTR Boost: {hook.estimated_ctr_boost}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Landing Page Positioning */}
      <div className="card p-6">
        <h2 className="heading-2 mb-6">🎨 3 Landing Page Positioning Ideas</h2>
        <div className="space-y-6">
          {report.landing_page_positioning.map((positioning) => (
            <div
              key={positioning.position_number}
              className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Option {positioning.position_number}: {positioning.positioning}
              </h3>

              <div className="space-y-4 mb-4">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    HEADLINE
                  </p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    {positioning.headline_example}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    SUBHEADLINE
                  </p>
                  <p className="text-sm text-slate-900 dark:text-white">
                    {positioning.subheadline_example}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-purple-200 dark:border-purple-800">
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    WHY RESONATES
                  </p>
                  <p className="text-sm text-slate-900 dark:text-white">
                    {positioning.why_resonates}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    COMPETITIVE ADVANTAGE
                  </p>
                  <p className="text-sm text-slate-900 dark:text-white">
                    {positioning.competitive_advantage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="card p-6">
        <h2 className="heading-2 mb-6">✅ Action Items</h2>
        <div className="space-y-6">
          <div>
            <h3 className="heading-3 mb-3 text-red-600 dark:text-red-400">🔥 Do This Today</h3>
            <ul className="space-y-2">
              {report.action_items.immediate.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400 mt-2 flex-shrink-0" />
                  <p className="text-sm text-slate-900 dark:text-white">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="heading-3 mb-3 text-amber-600 dark:text-amber-400">📅 Next 30 Days</h3>
            <ul className="space-y-2">
              {report.action_items.short_term_30_days.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 mt-2 flex-shrink-0" />
                  <p className="text-sm text-slate-900 dark:text-white">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="heading-3 mb-3 text-blue-600 dark:text-blue-400">🎯 Next 90 Days</h3>
            <ul className="space-y-2">
              {report.action_items.long_term_90_days.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2 flex-shrink-0" />
                  <p className="text-sm text-slate-900 dark:text-white">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
