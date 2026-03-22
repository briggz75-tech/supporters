'use client'

import React, { useState } from 'react'
import SearchBar from './SearchBar'
import SupporterCard from './SupporterCard'
import AddSupporterForm from './AddSupporterForm'
import { Supporter } from '@/lib/supabaseClient'

interface AdminSupportersProps {
  supporters: Supporter[]
  isLoading?: boolean
  onSearch?: (results: Supporter[]) => void
  onSupporterAdded?: () => void
  onSupporterDeleted?: (id: string) => void
  onBulkDelete?: (ids: string[]) => void | Promise<void>
  onBulkStatusUpdate?: (ids: string[], status: string) => void | Promise<void>
  onApproveSupporter?: (id: string) => void | Promise<void>
  onRejectSupporter?: (id: string) => void | Promise<void>
}

export default function AdminSupporters({
  supporters,
  onSearch,
  onSupporterAdded,
  onSupporterDeleted,
  onBulkDelete,
  onBulkStatusUpdate,
  onApproveSupporter,
  onRejectSupporter,
}: AdminSupportersProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedSupporters, setSelectedSupporters] = useState<Set<string>>(new Set())
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterDistrict, setFilterDistrict] = useState<string>('')
  const [filterApproval, setFilterApproval] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest')

  // Get unique districts
  const districts = Array.from(new Set(supporters.map((s) => s.district).filter(Boolean) as string[]))
  const statuses = ['Strong', 'Leaning', 'Undecided']

  // Filter and sort supporters
  let filteredSupporters = supporters
  if (filterStatus) {
    filteredSupporters = filteredSupporters.filter((s) =>
      s.status?.toLowerCase().includes(filterStatus.toLowerCase())
    )
  }
  if (filterDistrict) {
    filteredSupporters = filteredSupporters.filter((s) => s.district === filterDistrict)
  }
  if (filterApproval === 'approved') {
    filteredSupporters = filteredSupporters.filter((s) => s.approval_status === 'approved')
  } else if (filterApproval === 'pending') {
    filteredSupporters = filteredSupporters.filter((s) => s.approval_status === 'pending')
  }

  // Apply sorting
  filteredSupporters = [...filteredSupporters].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'oldest') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const toggleAllSelection = () => {
    if (selectedSupporters.size === filteredSupporters.length) {
      setSelectedSupporters(new Set())
    } else {
      setSelectedSupporters(new Set(filteredSupporters.map((s) => s.id)))
    }
  }

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedSupporters)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedSupporters(newSelected)
  }

  const handleBulkDelete = async () => {
    if (selectedSupporters.size === 0) return
    if (confirm(`Delete ${selectedSupporters.size} supporter(s)? This action cannot be undone.`)) {
      await onBulkDelete?.(Array.from(selectedSupporters))
      setSelectedSupporters(new Set())
    }
  }

  const handleBulkStatusUpdate = async (_status: string) => {
    if (selectedSupporters.size === 0) return
    await onBulkStatusUpdate?.(Array.from(selectedSupporters), _status)
    setSelectedSupporters(new Set())
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h2>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSearch={(results) => {
              onSearch?.(results)
            }}
          />
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All Districts</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Approval</label>
            <select
              value={filterApproval}
              onChange={(e) => setFilterApproval(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(filterStatus || filterDistrict || filterApproval) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filterStatus && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                Status: {filterStatus}
                <button
                  onClick={() => setFilterStatus('')}
                  className="hover:text-indigo-900"
                >
                  ✕
                </button>
              </span>
            )}
            {filterDistrict && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                District: {filterDistrict}
                <button
                  onClick={() => setFilterDistrict('')}
                  className="hover:text-indigo-900"
                >
                  ✕
                </button>
              </span>
            )}
            {filterApproval && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                Approval: {filterApproval === 'approved' ? 'Approved' : 'Pending'}
                <button
                  onClick={() => setFilterApproval('')}
                  className="hover:text-indigo-900"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedSupporters.size > 0 && (
        <div className="bg-indigo-50 border border-indigo-300 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-indigo-900">
              {selectedSupporters.size} supporter{selectedSupporters.size !== 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <select
              onChange={(e) => handleBulkStatusUpdate(e.target.value)}
              className="px-3 py-1 text-sm border border-indigo-300 rounded-lg bg-white text-gray-700"
              defaultValue=""
            >
              <option value="">Update Status...</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedSupporters(new Set())}
              className="px-3 py-1 text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Supporter Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Add New Supporter</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <AddSupporterForm
            onSupporterAdded={() => {
              setShowAddForm(false)
              onSupporterAdded?.()
            }}
            onError={() => {}}
            onSuccess={() => {}}
          />
        </div>
      )}

      {/* Pending Approvals Section */}
      {!filterApproval && supporters.some((s) => s.approval_status === 'pending') && (
        <div className="bg-white rounded-lg shadow-sm border border-yellow-300 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="text-2xl">⏳</div>
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
            <span className="ml-auto inline-flex items-center justify-center w-6 h-6 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">
              {supporters.filter((s) => s.approval_status === 'pending').length}
            </span>
          </div>

          {/* Pending Supporters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supporters
              .filter((s) => s.approval_status === 'pending')
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((supporter) => (
                <div key={supporter.id} className="relative bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {supporter.image_url && (
                      <img
                        src={supporter.image_url}
                        alt={supporter.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{supporter.name}</h3>
                      <p className="text-sm text-gray-600">{supporter.title || 'No title'}</p>
                      {supporter.district && (
                        <p className="text-xs text-gray-500">{supporter.district}</p>
                      )}
                    </div>
                  </div>

                  {/* Approval Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApproveSupporter?.(supporter.id)}
                      className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => onRejectSupporter?.(supporter.id)}
                      className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Supporters List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Supporters ({filteredSupporters.length})
          </h2>
          {filteredSupporters.length > 0 && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New
            </button>
          )}
        </div>

        {filteredSupporters.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No supporters found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add First Supporter
            </button>
          </div>
        ) : (
          <div>
            {/* Select All Bar */}
            <div className="bg-gray-100 rounded-t-lg px-4 py-3 border-b border-gray-200 flex items-center gap-3">
              <input
                type="checkbox"
                checked={selectedSupporters.size === filteredSupporters.length && selectedSupporters.size > 0}
                onChange={toggleAllSelection}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">
                {selectedSupporters.size === filteredSupporters.length && selectedSupporters.size > 0
                  ? 'All selected'
                  : `Select all (${filteredSupporters.length})`}
              </span>
            </div>

            {/* Supporters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSupporters.map((supporter) => (
                <div
                  key={supporter.id}
                  className="relative"
                  onClick={() => toggleSelection(supporter.id)}
                >
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedSupporters.has(supporter.id)}
                      onChange={() => {}}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <SupporterCard
                    supporter={supporter}
                    onDelete={() => onSupporterDeleted?.(supporter.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
