export interface Brand {
  id: string
  name: string
  adCount: number
  averageAdAge: number
  oldestAdDate: number
  newestAdDate: number
  status: 'active' | 'growing' | 'stable' | 'declining'
  totalEstimatedSpend: number
  avgCPC?: number
}

export interface Hook {
  id: string
  name: string
  prevalence: number
  emoji: string
  example: string
  triggerType: 'social_proof' | 'urgency' | 'guarantee' | 'transformation' | 'scarcity'
}

export interface CreativeAngle {
  id: string
  name: string
  prevalence: number
  description: string
  example: string
}

export interface AdInsight {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  prevalence: number
  recommendation: string
}

export interface DashboardData {
  keyword: string
  country: string
  totalAds: number
  uniqueBrands: number
  averageAdAge: number
  mostActiveBrand: string
  brands: Brand[]
  hooks: Hook[]
  angles: CreativeAngle[]
  insights: AdInsight[]
}

export interface BrandDetail extends Brand {
  recentAds: Array<{
    id: string
    copy: string
    daysActive: number
    hooks: string[]
    primaryAngle: string
    sentiment: 'positive' | 'neutral' | 'fear-based'
  }>
  topHooks: Hook[]
  commonAngles: CreativeAngle[]
  estimatedPerformance: {
    engagement: number
    reach: number
    ctr: number
  }
}

// Mock data generators
export const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'MyBrand Co.',
    adCount: 23,
    averageAdAge: 45,
    oldestAdDate: 180,
    newestAdDate: 2,
    status: 'active',
    totalEstimatedSpend: 45000,
    avgCPC: 0.82,
  },
  {
    id: '2',
    name: 'Competitor XYZ',
    adCount: 19,
    averageAdAge: 38,
    oldestAdDate: 156,
    newestAdDate: 5,
    status: 'growing',
    totalEstimatedSpend: 38000,
    avgCPC: 0.95,
  },
  {
    id: '3',
    name: 'NewPlayer Inc',
    adCount: 17,
    averageAdAge: 28,
    oldestAdDate: 92,
    newestAdDate: 1,
    status: 'growing',
    totalEstimatedSpend: 32000,
    avgCPC: 0.71,
  },
  {
    id: '4',
    name: 'EstablishedBrand',
    adCount: 15,
    averageAdAge: 62,
    oldestAdDate: 245,
    newestAdDate: 12,
    status: 'stable',
    totalEstimatedSpend: 28000,
    avgCPC: 1.12,
  },
  {
    id: '5',
    name: 'TrendCo',
    adCount: 13,
    averageAdAge: 19,
    oldestAdDate: 67,
    newestAdDate: 3,
    status: 'growing',
    totalEstimatedSpend: 24000,
    avgCPC: 0.68,
  },
  {
    id: '6',
    name: 'HealthFirst',
    adCount: 11,
    averageAdAge: 51,
    oldestAdDate: 178,
    newestAdDate: 8,
    status: 'active',
    totalEstimatedSpend: 20000,
    avgCPC: 0.88,
  },
  {
    id: '7',
    name: 'NatureWorks',
    adCount: 9,
    averageAdAge: 35,
    oldestAdDate: 128,
    newestAdDate: 6,
    status: 'stable',
    totalEstimatedSpend: 17000,
    avgCPC: 0.76,
  },
  {
    id: '8',
    name: 'ProduceMax',
    adCount: 8,
    averageAdAge: 41,
    oldestAdDate: 152,
    newestAdDate: 10,
    status: 'declining',
    totalEstimatedSpend: 15000,
    avgCPC: 0.91,
  },
]

export const mockHooks: Hook[] = [
  {
    id: '1',
    name: 'Proven Results',
    prevalence: 87,
    emoji: '🎯',
    example: '"Trusted by 100K+ customers. See results in 30 days"',
    triggerType: 'social_proof',
  },
  {
    id: '2',
    name: 'Money-Back Guarantee',
    prevalence: 76,
    emoji: '💰',
    example: '"Try risk-free. Return it if not 100% satisfied"',
    triggerType: 'guarantee',
  },
  {
    id: '3',
    name: 'Time-Limited Offer',
    prevalence: 69,
    emoji: '⏰',
    example: '"Limited time: 40% off + free shipping"',
    triggerType: 'scarcity',
  },
  {
    id: '4',
    name: 'Transformation Story',
    prevalence: 64,
    emoji: '🌟',
    example: '"See how Sarah went from tired to energized in weeks"',
    triggerType: 'transformation',
  },
  {
    id: '5',
    name: 'Social Proof',
    prevalence: 58,
    emoji: '👥',
    example: '"Join 50K+ women who ditched bloat for vitality"',
    triggerType: 'social_proof',
  },
]

export const mockAngles: CreativeAngle[] = [
  {
    id: '1',
    name: 'Problem-Agitate-Solve',
    prevalence: 76,
    description: 'Identify problem, show consequences, present solution.',
    example: '"Tired of bloating? Your body deserves better. Try our formula."',
  },
  {
    id: '2',
    name: 'Before/After Transformation',
    prevalence: 64,
    description: 'Visual or narrative journey showing product impact.',
    example: '"See how customers transformed their health in 90 days"',
  },
  {
    id: '3',
    name: 'Social Proof & Testimonials',
    prevalence: 71,
    description: 'Feature customer stories, reviews, ratings, or experts.',
    example: '"4.9★ from 50,000+ verified customers"',
  },
  {
    id: '4',
    name: 'You Deserve It',
    prevalence: 58,
    description: 'Self-care and permission-giving messaging.',
    example: '"You deserve to feel confident in your own skin"',
  },
  {
    id: '5',
    name: 'Comparative Advantage',
    prevalence: 45,
    description: 'Direct or indirect comparison to competitors.',
    example: '"3x more bioavailable than other brands"',
  },
  {
    id: '6',
    name: 'Preventative/Wellness',
    prevalence: 52,
    description: 'Focus on prevention and long-term health.',
    example: '"Prevent issues before they start with daily wellness"',
  },
]

export const mockInsights: AdInsight[] = [
  {
    id: '1',
    title: 'Sustainability Messaging Underutilized',
    description: 'Only 8% of ads emphasize environmental responsibility',
    impact: 'high',
    prevalence: 8,
    recommendation: 'Differentiate with eco-conscious messaging and sustainable sourcing story. Appeals to growing eco-aware demographic.',
  },
  {
    id: '2',
    title: 'Clinical Backing Is Rare',
    description: 'Only 15% reference clinical trials or scientific validation',
    impact: 'medium',
    prevalence: 15,
    recommendation: 'Lead with research: "Clinically shown to..." or "Published in Journal of..." Links to studies build trust with skeptical buyers.',
  },
  {
    id: '3',
    title: 'Premium Positioning Untapped',
    description: 'Most competitors compete on value. Only 12% position as premium',
    impact: 'high',
    prevalence: 12,
    recommendation: 'Price at premium level and justify with superior ingredients/sourcing. Allows better margins and attracts less price-sensitive buyers.',
  },
  {
    id: '4',
    title: 'Lifestyle Integration Scarce',
    description: 'Few ads show product in actual daily use context',
    impact: 'medium',
    prevalence: 19,
    recommendation: 'Show product as part of daily routine: "My morning ritual" not just "Product benefits." Creates stronger emotional connection.',
  },
  {
    id: '5',
    title: 'Male Appeal Missing',
    description: 'Even in male-friendly categories, almost no ads target men',
    impact: 'medium',
    prevalence: 3,
    recommendation: 'Develop male-focused messaging: "For guys who care about..." Different angles, triggers, and pain points. Adjacent market.',
  },
  {
    id: '6',
    title: 'Exclusivity Angle Underutilized',
    description: 'Only 14% of ads use insider/exclusive positioning',
    impact: 'low',
    prevalence: 14,
    recommendation: 'Position as expert-only or exclusive formula. Appeals to early adopters and creates scarcity perception.',
  },
  {
    id: '7',
    title: 'Community Building Minimal',
    description: 'Few ads emphasize joining a community or movement',
    impact: 'medium',
    prevalence: 11,
    recommendation: 'Create belonging feeling: "Join our community of X" or "Be part of the movement." Builds loyalty and word-of-mouth.',
  },
  {
    id: '8',
    title: 'Long-Form Content Strategy Absent',
    description: 'Almost all ads are short-form focused',
    impact: 'low',
    prevalence: 5,
    recommendation: 'Consider long-form storytelling ads on YouTube. Share deeper origin story, education, or authority positioning.',
  },
]

export function getMockDashboardData(keyword: string, country: string): DashboardData {
  return {
    keyword,
    country,
    totalAds: 247,
    uniqueBrands: mockBrands.length,
    averageAdAge: 34,
    mostActiveBrand: mockBrands[0].name,
    brands: mockBrands,
    hooks: mockHooks,
    angles: mockAngles,
    insights: mockInsights,
  }
}

export function getMockBrandDetail(brandId: string): BrandDetail | null {
  const brand = mockBrands.find(b => b.id === brandId)
  if (!brand) return null

  return {
    ...brand,
    recentAds: [
      {
        id: '1',
        copy: 'This 1 trick eliminates bloating in 24 hours. See before/after photos. Join 100K+ satisfied customers. Money-back guarantee.',
        daysActive: 45,
        hooks: ['Proven Results', 'Social Proof', 'Guarantee'],
        primaryAngle: 'Problem-Agitate-Solve',
        sentiment: 'positive',
      },
      {
        id: '2',
        copy: 'Join 50K women who ditched bloat. Get 50% off today. Limited time: Ships free + bonus guide included.',
        daysActive: 12,
        hooks: ['Community', 'Urgency', 'Risk Reversal'],
        primaryAngle: 'Social Proof & Testimonials',
        sentiment: 'positive',
      },
      {
        id: '3',
        copy: 'Recommended by 3,000+ doctors. The original formula. Proven safe and effective. Transform in 30 days or get 100% refunded.',
        daysActive: 28,
        hooks: ['Authority', 'Proven Results', 'Guarantee'],
        primaryAngle: 'Before/After Transformation',
        sentiment: 'positive',
      },
    ],
    topHooks: mockHooks.slice(0, 3),
    commonAngles: mockAngles.slice(0, 3),
    estimatedPerformance: {
      engagement: 4.2,
      reach: 125000,
      ctr: 2.8,
    },
  }
}

export function getSearchSuggestions(): string[] {
  return [
    'protein powder',
    'collagen supplement',
    'fitness app',
    'skincare',
    'nootropic supplements',
    'energy drink',
    'weight loss pill',
    'sleep aid',
    'hair growth serum',
    'anti-aging cream',
  ]
}
