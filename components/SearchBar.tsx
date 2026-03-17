'use client'

import { useCallback, useState } from 'react'
import { Supporter, supabase, validateSupabaseConfig } from '@/lib/supabaseClient'

interface SearchBarProps {
  onSearch: (supporters: Supporter[], loading: boolean) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      onSearch([], false)
      return
    }

    setIsLoading(true)
    try {
      validateSupabaseConfig()
      const { data, error } = await supabase
        .from('supporters')
        .select('*')
        .or(
          `name.ilike.%${query}%,phone.ilike.%${query}%,ward.ilike.%${query}%,llg.ilike.%${query}%,title.ilike.%${query}%,district.ilike.%${query}%,coordinator_notes.ilike.%${query}%`
        )
        .limit(50)

      if (error) {
        console.error('Search error:', error)
        onSearch([], false)
      } else {
        onSearch(data as Supporter[], false)
      }
    } catch (err) {
      console.error('Search exception:', err)
      onSearch([], false)
    } finally {
      setIsLoading(false)
    }
  }, [onSearch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Set new timer for debounced search
    setIsLoading(true)
    const timer = setTimeout(() => {
      performSearch(value)
    }, 300)

    setDebounceTimer(timer)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    performSearch(searchQuery)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
          🔍
        </div>
        <input
          type="text"
          placeholder="Search by name, phone, ward, or LLG..."
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full pl-14 pr-6 py-4 text-lg bg-white border-2 border-transparent rounded-xl shadow-lg focus:outline-none focus:border-purple-500 focus:shadow-xl transition-all duration-300 placeholder-gray-400 text-gray-900"
          autoFocus
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
    </form>
  )
}
