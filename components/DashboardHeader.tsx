'use client'

interface DashboardHeaderProps {
  title: string
  description?: string
  actionButton?: {
    label: string
    onClick: () => void
  }
}

export default function DashboardHeader({
  title,
  description,
  actionButton,
}: DashboardHeaderProps) {
  return (
    <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {actionButton.label}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
