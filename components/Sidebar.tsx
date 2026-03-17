'use client'

import { useState } from 'react'

interface SidebarProps {
  stats?: {
    total: number
    strong: number
    leaning: number
    pending: number
  }
  onClose?: () => void
}

export default function Sidebar({ stats, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Handle sidebar toggle for mobile
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed)
    if (onClose && window.innerWidth < 768) {
      onClose()
    }
  }

  // Mobile menu button
  const handleMobileMenu = () => setMobileOpen((open) => !open)

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-full shadow-lg focus:outline-none"
        onClick={handleMobileMenu}
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={handleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white transition-all duration-300 z-50 md:z-40 border-r border-gray-700
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        ${isCollapsed ? 'w-20' : 'w-64'}
        `}
        style={{ minWidth: isCollapsed ? '5rem' : '16rem' }}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-700 flex items-center justify-between px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-sm">
                🔍
              </div>
              <span className="font-bold text-lg whitespace-nowrap">Supporters</span>
            </div>
          )}
          <button
            onClick={handleToggle}
            className="p-1 hover:bg-gray-700 rounded transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <NavItem icon="🏠" label="Dashboard" isCollapsed={isCollapsed} active />
          <NavItem icon="🔍" label="Search" isCollapsed={isCollapsed} />
          <NavItem icon="👥" label="Supporters" isCollapsed={isCollapsed} />
          <NavItem icon="⚙️" label="Settings" isCollapsed={isCollapsed} />
        </nav>

        {/* Statistics */}
        {stats && !isCollapsed && (
          <div className="p-4 border-t border-gray-700 mt-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4">
              Stats
            </h3>
            <div className="space-y-3">
              <StatItem label="Total" value={stats.total} color="bg-blue-500" />
              <StatItem label="Strong" value={stats.strong} color="bg-green-500" />
              <StatItem
                label="Leaning"
                value={stats.leaning}
                color="bg-yellow-500"
              />
              <StatItem label="Pending" value={stats.pending} color="bg-gray-500" />
            </div>
          </div>
        )}

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-gray-700/50 rounded-lg text-xs text-gray-300">
            <p className="font-semibold mb-1">Need help?</p>
            <p>Check documentation or contact support</p>
          </div>
        )}
      </aside>
    </>
  )
}

function NavItem({
  icon,
  label,
  isCollapsed,
  active = false,
}: {
  icon: string
  label: string
  isCollapsed: boolean
  active?: boolean
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
        active
          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
          : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      <span className="text-lg flex-shrink-0">{icon}</span>
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
    </button>
  )
}

function StatItem({
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
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${color}`}></span>
        <span className="font-semibold">{value}</span>
      </div>
    </div>
  )
}
