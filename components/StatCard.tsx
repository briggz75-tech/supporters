'use client'

interface StatCardProps {
  icon: string
  label: string
  value: number
  color: 'blue' | 'green' | 'yellow' | 'gray'
  trend?: number
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    bar: 'bg-blue-500',
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    bar: 'bg-green-500',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    bar: 'bg-yellow-500',
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    icon: 'text-gray-600',
    bar: 'bg-gray-500',
  },
}

export default function StatCard({
  icon,
  label,
  value,
  color,
  trend,
}: StatCardProps) {
  const colors = colorClasses[color]

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-6`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={`${colors.icon} text-3xl`}>{icon}</div>
      </div>
      <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`${colors.bar} h-full rounded-full`}
          style={{ width: `${Math.min((value / 100) * 100, 100)}%` }}
        ></div>
      </div>
    </div>
  )
}
