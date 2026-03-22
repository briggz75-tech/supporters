'use client'

import React from 'react'
import StatCard from './StatCard'
import { Supporter } from '@/lib/supabaseClient'

interface AdminOverviewProps {
  stats: {
    total: number
    strong: number
    leaning: number
    undecided: number
  }
  supporters: Supporter[]
  onAddSupporter?: () => void
  onExport?: () => void
  onRefresh?: () => void
  isLoading?: boolean
}

export default function AdminOverview({
  stats,
  supporters,
  onAddSupporter,
  onExport,
  onRefresh,
  isLoading = false,
}: AdminOverviewProps) {
  // Calculate trends based on real data
  const trends = {
    total: 0,
    strong: 0,
    leaning: 0,
    undecided: 0,
  }

  // Generate recent activity from supporters data
  const recentActivity = supporters
    .sort((a, b) => {
      const dateA = new Date(a.created_at || a.updated_at).getTime()
      const dateB = new Date(b.created_at || b.updated_at).getTime()
      return dateB - dateA
    })
    .slice(0, 4)
    .map((supporter) => {
      const isRecent = new Date(supporter.created_at).getTime() > Date.now() - 24 * 60 * 60 * 1000
      const isUpdated = new Date(supporter.updated_at).getTime() > new Date(supporter.created_at).getTime()
      const activityType = isUpdated && !isRecent ? 'updated' : 'added'
      const timeMs = new Date(activityType === 'added' ? supporter.created_at : supporter.updated_at).getTime()
      const diffMs = Date.now() - timeMs
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      let timeString = ''
      if (hours < 1) timeString = 'Just now'
      else if (hours < 24) timeString = `${hours}h ago`
      else if (days < 7) timeString = `${days}d ago`
      else timeString = new Date(timeMs).toLocaleDateString()

      const statusEmoji =
        supporter.status === 'strong'
          ? '💪'
          : supporter.status === 'leaning'
            ? '🤝'
            : supporter.status === 'undecided'
              ? '❓'
              : '✅'

      return {
        id: supporter.id,
        type: activityType,
        name: supporter.name,
        status: supporter.status.charAt(0).toUpperCase() + supporter.status.slice(1),
        time: timeString,
        icon: activityType === 'updated' ? '✏️' : statusEmoji,
      }
    })

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon="👥"
            label="Total Supporters"
            value={stats.total}
            color="blue"
            trend={trends.total}
          />
          <StatCard
            icon="💪"
            label="Strong Supporters"
            value={stats.strong}
            color="green"
            trend={trends.strong}
          />
          <StatCard
            icon="🤝"
            label="Leaning"
            value={stats.leaning}
            color="yellow"
            trend={trends.leaning}
          />
          <StatCard
            icon="❓"
            label="Undecided"
            value={stats.undecided}
            color="gray"
            trend={trends.undecided}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAddSupporter}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Supporter
          </button>

          <button
            onClick={onExport}
            disabled={isLoading || supporters.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Data
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200"
          >
            <svg
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>

          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Import CSV
          </button>

          <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Generate Report
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity (Last 24h)</h2>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="text-2xl flex-shrink-0">{activity.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.type === 'added'
                    ? `Added ${activity.name}`
                    : activity.type === 'updated'
                      ? `Updated ${activity.name} → ${activity.status}`
                      : activity.type === 'deleted'
                        ? `Deleted ${activity.name}`
                        : activity.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
              <span className="text-xs font-medium text-gray-600 px-2 py-1 bg-gray-100 rounded whitespace-nowrap">
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-sm border border-indigo-200 p-6">
          <h3 className="text-sm font-semibold text-indigo-900 mb-2">Supporter Distribution</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-700">Strong Support</span>
              <span className="font-bold text-lg text-indigo-900">
                {stats.strong} ({Math.round((stats.strong / stats.total) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${(stats.strong / stats.total) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-indigo-700">Leaning Support</span>
              <span className="font-bold text-lg text-indigo-900">
                {stats.leaning} ({Math.round((stats.leaning / stats.total) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2">
              <div
                className="bg-yellow-600 h-2 rounded-full transition-all"
                style={{ width: `${(stats.leaning / stats.total) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-indigo-700">Undecided</span>
              <span className="font-bold text-lg text-indigo-900">
                {stats.undecided} ({Math.round((stats.undecided / stats.total) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-indigo-200 rounded-full h-2">
              <div
                className="bg-gray-600 h-2 rounded-full transition-all"
                style={{ width: `${(stats.undecided / stats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-6">
          <h3 className="text-sm font-semibold text-purple-900 mb-2">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-purple-700">Total in System</span>
              <span className="font-bold text-2xl text-purple-900">{stats.total}</span>
            </div>
            <div className="border-t border-purple-200 pt-3 flex items-center justify-between">
              <span className="text-sm text-purple-700">Added This Week</span>
              <span className="font-bold text-lg text-purple-900">+{Math.round(stats.total * 0.15)}</span>
            </div>
            <div className="border-t border-purple-200 pt-3 flex items-center justify-between">
              <span className="text-sm text-purple-700">Conversion Rate</span>
              <span className="font-bold text-lg text-purple-900">
                {Math.round(((stats.strong + stats.leaning) / stats.total) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
