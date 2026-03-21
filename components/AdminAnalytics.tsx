'use client'

import React from 'react'
import AnalyticsDashboard from './AnalyticsDashboard'
import { Supporter } from '@/lib/supabaseClient'

interface AdminAnalyticsProps {
  supporters: Supporter[]
}

export default function AdminAnalytics({ supporters }: AdminAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Analytics</h2>
        <AnalyticsDashboard supporters={supporters} />
      </div>
    </div>
  )
}
