'use client'

import React from 'react'

export type TabType = 'overview' | 'supporters' | 'analytics' | 'activity' | 'settings'

interface AdminTabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  children: React.ReactNode
}

const tabs: { id: TabType; label: string; icon: string; description: string }[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: '📊',
    description: 'Dashboard overview and statistics',
  },
  {
    id: 'supporters',
    label: 'Supporters',
    icon: '👥',
    description: 'Manage all supporters',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '📈',
    description: 'Advanced analytics and reports',
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: '📋',
    description: 'Recent activity log',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: '⚙️',
    description: 'Admin settings',
  },
]

export default function AdminTabs({ activeTab, onTabChange, children }: AdminTabsProps) {
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg sticky top-0 z-20">
        <div className="flex items-center overflow-x-auto gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              title={tab.description}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn">{children}</div>
    </div>
  )
}

// Export tab type for use in parent components
export { tabs }
