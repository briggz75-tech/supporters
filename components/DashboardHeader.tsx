'use client'

import { User } from '@supabase/supabase-js'

interface DashboardHeaderProps {
  title: string
  description?: string
  actionButton?: {
    label: string
    onClick: () => void
  }
  user?: User | null
}

function getInitials(email: string): string {
  return email
    .split('@')[0]
    .split('.')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function DashboardHeader({
  title,
  description,
  actionButton,
  user,
}: DashboardHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm">
      <div className="px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{title}</h1>
            </div>
            {description && (
              <p className="text-gray-600 text-sm ml-11">{description}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(user.email || '')}
                </div>
              </div>
            )}

            {actionButton && (
              <button
                onClick={actionButton.onClick}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              >
                {actionButton.label}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
