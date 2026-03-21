'use client'

import React from 'react'

interface AdminSidebarProps {
  isCollapsed?: boolean
  onCollapse?: () => void
  onClose?: () => void
  stats?: {
    total: number
    strong: number
    leaning: number
    undecided: number
  }
}

interface NavItem {
  icon: string
  label: string
  href: string
  badge?: number | boolean
  active?: boolean
}

const navItems: NavItem[] = [
  { icon: '📊', label: 'Overview', href: '#overview' },
  { icon: '👥', label: 'Supporters', href: '#supporters' },
  { icon: '📈', label: 'Analytics', href: '#analytics' },
  { icon: '📋', label: 'Activity', href: '#activity' },
  { icon: '⚙️', label: 'Settings', href: '#settings' },
  { icon: '🔐', label: 'Permissions', href: '#permissions' },
]

export default function AdminSidebar({
  isCollapsed = false,
  onCollapse,
  onClose,
  stats,
}: AdminSidebarProps) {

  return (
    <aside
      className={`h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white border-r border-gray-700 flex flex-col transition-all duration-300`}
    >
      {/* Header */}
      <div className="h-16 border-b border-gray-700 flex items-center justify-between px-4 flex-shrink-0">
        {!isCollapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
              👥
            </div>
            <span className="font-bold text-lg whitespace-nowrap truncate">Admin</span>
          </div>
        )}
        <button
          onClick={onCollapse}
          className="p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0 ml-auto"
          aria-label="Toggle sidebar"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
              isCollapsed
                ? 'justify-center px-3'
                : 'justify-between group hover:bg-gray-700/50'
            } ${item.active ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-gray-300 hover:text-white'}`}
            title={item.label}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
            </div>
            {!isCollapsed && item.badge && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                {typeof item.badge === 'boolean' ? '!' : item.badge}
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* Stats Section */}
      {stats && !isCollapsed && (
        <div className="border-t border-gray-700 p-4 bg-gray-800/50">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 px-1">Stats</h3>
          <div className="space-y-2">
            <StatRow label="Total" value={stats.total} color="bg-blue-500/20 text-blue-300" />
            <StatRow
              label="Strong"
              value={stats.strong}
              color="bg-green-500/20 text-green-300"
            />
            <StatRow
              label="Leaning"
              value={stats.leaning}
              color="bg-yellow-500/20 text-yellow-300"
            />
            <StatRow
              label="Undecided"
              value={stats.undecided}
              color="bg-gray-500/20 text-gray-300"
            />
          </div>
        </div>
      )}

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t border-gray-700 p-4 bg-gray-800/30">
          <p className="text-xs text-gray-400 space-y-1">
            <span className="block font-semibold">Need Help?</span>
            <span className="block">Contact: Elton</span>
            <span className="block">📞 79750979</span>
          </p>
        </div>
      )}
    </aside>
  )
}

function StatRow({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-300">{label}</span>
      <span className={`text-xs font-bold px-2 py-1 rounded ${color}`}>{value}</span>
    </div>
  )
}
