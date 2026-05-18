'use client'

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { mockBrands, mockHooks, mockAngles, Hook, CreativeAngle } from '@/lib/mock-data'

const COLORS = ['#2563eb', '#9333ea', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

export function TopBrandsChart() {
  const data = mockBrands.slice(0, 8).map(brand => ({
    name: brand.name.split(' ')[0],
    ads: brand.adCount,
    fullName: brand.name,
  }))

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="heading-3">Top advertiser brands</h2>
        <p className="text-muted text-sm mt-1">Ranked by number of active ads</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#f1f5f9' }}
            formatter={(value) => [`${value} ads`, 'Active']}
          />
          <Bar dataKey="ads" fill="#2563eb" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Top brands list */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {mockBrands.slice(0, 4).map((brand, index) => (
          <div key={brand.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                #{index + 1}
              </span>
            </div>
            <p className="text-xs text-muted truncate mb-1">{brand.name}</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{brand.adCount}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HookDistributionChart() {
  const data = mockHooks.map(hook => ({
    name: hook.name,
    value: hook.prevalence,
    emoji: hook.emoji,
  }))

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="heading-3">Copy hooks & patterns</h2>
        <p className="text-muted text-sm mt-1">Most common persuasion tactics in ads</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ emoji, value }) => `${emoji} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hook Details List */}
        <div className="space-y-3">
          {mockHooks.map((hook, index) => (
            <div key={hook.id} className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{hook.emoji}</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {hook.name}
                  </p>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 ml-auto">
                    {hook.prevalence}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${hook.prevalence}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function CreativeAnglesGrid() {
  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="heading-3">Creative angles & positioning</h2>
        <p className="text-muted text-sm mt-1">Primary strategies competitors use to sell</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockAngles.map((angle, index) => (
          <div
            key={angle.id}
            className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                {angle.name}
              </h3>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {angle.prevalence}%
              </span>
            </div>
            <p className="text-xs text-muted mb-3">{angle.description}</p>
            <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${angle.prevalence}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-3 italic">Example: {angle.example}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AdLongevityChart() {
  const data = [
    { name: 'Recent (0-30d)', ads: 45 },
    { name: 'Mid-term (31-90d)', ads: 78 },
    { name: 'Evergreen (90d+)', ads: 124 },
  ]

  return (
    <div className="card p-6">
      <div className="mb-6">
        <h2 className="heading-3">Ad longevity distribution</h2>
        <p className="text-muted text-sm mt-1">How long ads stay active (proxy for performance)</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#f1f5f9' }}
          />
          <Line
            type="monotone"
            dataKey="ads"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ fill: '#2563eb', r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function SummaryStats({ totalAds, uniqueBrands, averageAdAge, mostActiveBrand }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard label="Total Ads Found" value={totalAds} trend="up" />
      <StatCard label="Unique Brands" value={uniqueBrands} trend="up" />
      <StatCard label="Average Ad Age" value={`${averageAdAge}d`} />
      <StatCard label="Most Active Brand" value={mostActiveBrand} />
    </div>
  )
}

function StatCard({
  label,
  value,
  trend,
}: {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
}) {
  return (
    <div className="metric-card">
      <p className="text-sm text-muted mb-2">{label}</p>
      <div className="flex items-baseline justify-between">
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        {trend === 'up' && <div className="text-green-600 text-sm font-semibold">↑</div>}
      </div>
    </div>
  )
}
