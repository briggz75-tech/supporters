'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import SupporterCard from '@/components/SupporterCard'
import Sidebar from '@/components/Sidebar'
import DashboardHeader from '@/components/DashboardHeader'
import StatCard from '@/components/StatCard'
import { Supporter, supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [supporters, setSupporters] = useState<Supporter[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    strong: 0,
    leaning: 0,
    pending: 0,
  })

  // Load statistics and all supporters on mount
  useEffect(() => {
    loadStats()
    loadAllSupporters()
  }, [])

  // Load all supporters
  const loadAllSupporters = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('supporters')
        .select('*')
        .limit(100)
      if (error) {
        console.error('Load supporters error:', error)
        setIsLoading(false)
        return
      }
      setSupporters(data as Supporter[])
      setIsLoading(false)
    } catch (err) {
      console.error('Load supporters exception:', err)
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('supporters')
        .select('status', { count: 'exact' })

      if (error) {
        console.error('Stats error:', error)
        return
      }

      if (data) {
        const total = data.length
        const strong = data.filter((d) =>
          (d.status || '').toLowerCase().includes('strong')
        ).length
        const leaning = data.filter((d) =>
          (d.status || '').toLowerCase().includes('lean')
        ).length
        const pending = data.filter((d) =>
          (d.status || '').toLowerCase().includes('pending')
        ).length

        setStats({
          total,
          strong,
          leaning,
          pending,
        })
      }
    } catch (err) {
      console.error('Stats exception:', err)
    }
  }

  const handleSearch = (results: Supporter[], loading: boolean) => {
    setSupporters(results)
    setIsLoading(loading)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar - responsive */}
      <div className="md:block fixed md:static z-40">
        <Sidebar stats={stats} />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          title="Supporter Management"
          description="Search, manage, and view all supporters in one place"
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8">
            {/* Statistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <StatCard
                icon="👥"
                label="Total Supporters"
                value={stats.total}
                color="blue"
              />
              <StatCard
                icon="🟢"
                label="Strong"
                value={stats.strong}
                color="green"
              />
              <StatCard
                icon="🟡"
                label="Leaning"
                value={stats.leaning}
                color="yellow"
              />
              <StatCard
                icon="⚫"
                label="Pending"
                value={stats.pending}
                color="gray"
              />
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Search Supporters
              </h2>
              <p className="text-gray-600 mb-6">
                Find supporters by name, phone, title, district, ward, or LLG
              </p>
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Results Section - Always show supporters */}
            <div>
              {isLoading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md p-6 animate-pulse"
                    >
                      <div className="h-40 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : supporters.length > 0 ? (
                <div>
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-900">
                      Showing {supporters.length} supporter{supporters.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {supporters.map((supporter) => (
                      <SupporterCard
                        key={supporter.id}
                        supporter={supporter}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                  <p className="text-4xl mb-4">🔍</p>
                  <p className="text-xl font-semibold text-gray-900">
                    No supporters found
                  </p>
                  <p className="text-gray-600 mt-2">
                    Try searching with different keywords
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
