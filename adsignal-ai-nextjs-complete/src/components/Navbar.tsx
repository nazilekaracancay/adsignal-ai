'use client'

import Link from 'next/link'
import { BarChart3, Settings, User } from 'lucide-react'

export function Navbar() {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-40">
      <div className="container-main py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white hidden sm:block">
            Ad Intelligence
          </h1>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition">
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition">
            <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
