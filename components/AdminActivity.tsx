'use client'

import React from 'react'

interface ActivityItem {
  id: string | number
  type: 'added' | 'updated' | 'deleted' | 'bulk'
  name: string
  description?: string
  timestamp: string
  icon: string
  color: string
}

// Mock activity data - in real app would come from API
const mockActivity: ActivityItem[] = [
  {
    id: 1,
    type: 'added',
    name: 'John Doe',
    description: 'Added as Strong supporter',
    timestamp: '2 hours ago',
    icon: '✅',
    color: 'bg-green-50 border-green-300',
  },
  {
    id: 2,
    type: 'updated',
    name: 'Jane Smith',
    description: 'Status changed from Undecided to Leaning',
    timestamp: '4 hours ago',
    icon: '✏️',
    color: 'bg-blue-50 border-blue-300',
  },
  {
    id: 3,
    type: 'deleted',
    name: 'Peter Johnson',
    description: 'Removed from supporters',
    timestamp: '6 hours ago',
    icon: '❌',
    color: 'bg-red-50 border-red-300',
  },
  {
    id: 4,
    type: 'bulk',
    name: 'Bulk Import',
    description: 'Imported 25 supporters from CSV',
    timestamp: 'Today',
    icon: '📊',
    color: 'bg-purple-50 border-purple-300',
  },
  {
    id: 5,
    type: 'added',
    name: 'Sarah Wilson',
    description: 'Added as Leaning supporter',
    timestamp: 'Yesterday',
    icon: '✅',
    color: 'bg-green-50 border-green-300',
  },
]

export default function AdminActivity() {
  const [filter, setFilter] = React.useState<'all' | 'added' | 'updated' | 'deleted' | 'bulk'>(
    'all'
  )

  const filteredActivity =
    filter === 'all' ? mockActivity : mockActivity.filter((item) => item.type === filter)

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'added', 'updated', 'deleted', 'bulk'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type === 'all' ? 'All Activity' : `${type.charAt(0).toUpperCase()}${type.slice(1)}`}
            </button>
          ))}
        </div>

        {filteredActivity.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-600">No activity found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivity.map((activity) => (
              <div
                key={activity.id}
                className={`border-l-4 px-4 py-3 rounded-r-lg ${activity.color} flex items-start gap-4 hover:bg-opacity-75 transition-all`}
              >
                <div className="text-2xl flex-shrink-0">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                  {activity.description && (
                    <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{activity.timestamp}</p>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      activity.type === 'added'
                        ? 'bg-green-200 text-green-800'
                        : activity.type === 'updated'
                          ? 'bg-blue-200 text-blue-800'
                          : activity.type === 'deleted'
                            ? 'bg-red-200 text-red-800'
                            : 'bg-purple-200 text-purple-800'
                    }`}
                  >
                    {activity.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm text-gray-600">Total Added</p>
          <p className="text-2xl font-bold text-gray-900">
            {mockActivity.filter((a) => a.type === 'added').length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl mb-2">✏️</div>
          <p className="text-sm text-gray-600">Total Updated</p>
          <p className="text-2xl font-bold text-gray-900">
            {mockActivity.filter((a) => a.type === 'updated').length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl mb-2">❌</div>
          <p className="text-sm text-gray-600">Total Deleted</p>
          <p className="text-2xl font-bold text-gray-900">
            {mockActivity.filter((a) => a.type === 'deleted').length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm text-gray-600">Bulk Operations</p>
          <p className="text-2xl font-bold text-gray-900">
            {mockActivity.filter((a) => a.type === 'bulk').length}
          </p>
        </div>
      </div>
    </div>
  )
}
