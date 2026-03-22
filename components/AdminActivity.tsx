'use client'

import React, { useEffect, useState } from 'react'
import { supabase, Supporter } from '@/lib/supabaseClient'

interface ActivityItem {
  id: string | number
  type: 'added' | 'updated' | 'deleted' | 'bulk'
  name: string
  description?: string
  timestamp: string
  icon: string
  color: string
  status?: string
}

// Function to calculate relative time
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString()
}

// Function to determine activity type based on timestamps
const getActivityType = (supporter: Supporter): 'added' | 'updated' => {
  const createdAt = new Date(supporter.created_at)
  const updatedAt = new Date(supporter.updated_at)
  const timeDiffMs = updatedAt.getTime() - createdAt.getTime()
  return timeDiffMs < 5000 ? 'added' : 'updated'
}

export default function AdminActivity() {
  const [filter, setFilter] = React.useState<'all' | 'added' | 'updated' | 'deleted' | 'bulk'>(
    'all'
  )
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real activity data from last 24 hours
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true)
        
        // Calculate 24 hours ago
        const oneDayAgo = new Date()
        oneDayAgo.setHours(oneDayAgo.getHours() - 24)
        const oneDayAgoISO = oneDayAgo.toISOString()

        // Fetch supporters modified in the last 24 hours
        const { data: supporters, error } = await supabase
          .from('supporters')
          .select('*')
          .or(`created_at.gte.${oneDayAgoISO},updated_at.gte.${oneDayAgoISO}`)
          .order('updated_at', { ascending: false })

        if (error) {
          console.error('Error fetching activity:', error)
          setActivity([])
          setLoading(false)
          return
        }

        // Convert supporter data to activity items
        const activityItems: ActivityItem[] = (supporters || []).map((supporter: Supporter) => {
          const activityType = getActivityType(supporter)
          const timestamp = 
            activityType === 'added' 
              ? getRelativeTime(supporter.created_at)
              : getRelativeTime(supporter.updated_at)

          return {
            id: supporter.id,
            type: activityType,
            name: supporter.name,
            description: 
              activityType === 'added'
                ? supporter.status || 'New'
                : `→ ${supporter.status || 'Updated'}`,
            timestamp,
            icon: activityType === 'added' ? '✅' : '✏️',
            color:
              activityType === 'added'
                ? 'bg-green-50 border-green-300'
                : 'bg-blue-50 border-blue-300',
            status: supporter.status || 'Unknown',
          }
        })

        setActivity(activityItems)
      } catch (err) {
        console.error('Failed to fetch activity:', err)
        setActivity([])
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
    
    // Refresh activity every 30 seconds
    const interval = setInterval(fetchActivity, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredActivity =
    filter === 'all' ? activity : activity.filter((item) => item.type === filter)

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity (Last 24h)</h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'added', 'updated'] as const).map((type) => (
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

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin text-3xl mb-4">⏳</div>
            <p className="text-gray-600">Loading activity...</p>
          </div>
        ) : filteredActivity.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📭</div>
            <p className="text-gray-600">No activity in the last 24 hours</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredActivity.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200"
              >
                {/* Icon Column */}
                <div className="flex-shrink-0 text-2xl pt-1">{item.icon}</div>

                {/* Content Column */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-600">{item.description}</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{item.timestamp}</p>
                </div>

                {/* Status Badge Column */}
                <div className="flex-shrink-0">
                  {item.status && (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        item.status.toLowerCase().includes('strong')
                          ? 'bg-green-100 text-green-800'
                          : item.status.toLowerCase().includes('lean')
                            ? 'bg-blue-100 text-blue-800'
                            : item.status.toLowerCase().includes('undecided') ||
                              item.status.toLowerCase().includes('pending')
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm text-gray-600">Added (24h)</p>
          <p className="text-2xl font-bold text-gray-900">
            {activity.filter((a) => a.type === 'added').length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl mb-2">✏️</div>
          <p className="text-sm text-gray-600">Updated (24h)</p>
          <p className="text-2xl font-bold text-gray-900">
            {activity.filter((a) => a.type === 'updated').length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-sm text-gray-600">Total Changes</p>
          <p className="text-2xl font-bold text-gray-900">
            {activity.length}
          </p>
        </div>
      </div>
    </div>
  )
}
