'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Supporter, supabase } from '@/lib/supabaseClient'
import EditSupporterModal from './EditSupporterModal'
import { useToast } from './Toast'

interface SupporterCardProps {
  supporter: Supporter
  onDelete?: (id: string) => void
  onUpdate?: () => void
  readOnly?: boolean
}

// Helper function to generate initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Helper function to get avatar background color based on name
function getAvatarColor(name: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Helper to get status badge color
function getStatusStyles(status: string | null) {
  const statusLower = (status || '').toLowerCase()

  if (statusLower.includes('pending_delete')) {
    return {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      dot: 'bg-red-500',
    }
  } else if (statusLower.includes('strong')) {
    return {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      dot: 'bg-green-500',
    }
  } else if (statusLower.includes('lean')) {
    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
      dot: 'bg-yellow-500',
    }
  } else if (statusLower.includes('undecided') || statusLower.includes('pending')) {
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-300',
      dot: 'bg-gray-500',
    }
  }

  return {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    dot: 'bg-blue-500',
  }
}

export default function SupporterCard({ supporter, onDelete, onUpdate, readOnly = false }: SupporterCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { addToast } = useToast()

  const statusStyles = getStatusStyles(supporter.status)
  const initials = getInitials(supporter.name)
  const avatarColor = getAvatarColor(supporter.name)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      console.log('Marking supporter for deletion:', supporter.id, supporter.name)
      
      const { error, data } = await supabase
        .from('supporters')
        .update({ status: 'pending_delete' })
        .eq('id', supporter.id)
        .select()

      console.log('Soft delete response:', { error, data })
      
      if (error) {
        console.error('Update error:', error)
        addToast('Failed to mark supporter for deletion', 'error')
        setIsDeleting(false)
        return
      }

      addToast(`${supporter.name} marked for deletion and awaiting final confirmation`, 'success')
      if (onDelete) onDelete(supporter.id)
    } catch (err) {
      console.error('Delete exception:', err)
      addToast('Error deleting supporter', 'error')
      setIsDeleting(false)
    } finally {
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden h-full border border-transparent hover:border-purple-200">
        {/* Image/Avatar Section */}
        <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative">
          {supporter.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={supporter.image_url}
              alt={supporter.name}
              className="w-32 h-32 rounded-full object-cover mx-auto"
              onError={(e) => {
                // Fallback to avatar if image fails to load
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : null}

          {/* Fallback Avatar */}
          {!supporter.image_url && (
            <div className={`${avatarColor} w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
              {initials}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Name and Title */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 truncate hover:text-purple-600 transition-colors">
              {supporter.name}
            </h3>
            {supporter.title && (
              <p className="text-sm text-purple-600 font-semibold truncate">
                {supporter.title}
              </p>
            )}
          </div>

          {/* Status Badge */}
          <div className="mb-4 flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusStyles.bg} ${statusStyles.text} ${statusStyles.border}`}>
              <span className={`w-2 h-2 rounded-full ${statusStyles.dot} mr-2`}></span>
              {supporter.status === 'pending_delete' 
                ? 'Pending Delete' 
                : supporter.status 
                ? supporter.status.charAt(0).toUpperCase() + supporter.status.slice(1) 
                : 'Pending'}
            </span>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 mb-4 text-sm">
            {supporter.phone && (
              <div className="flex items-center gap-2">
                <span className="text-lg">📱</span>
                <a
                  href={`tel:${supporter.phone}`}
                  className="text-blue-600 hover:underline font-medium truncate"
                >
                  {supporter.phone}
                </a>
                {/* WhatsApp button */}
                <a
                  href={`https://wa.me/${supporter.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-800 text-lg ml-2 flex items-center gap-1"
                  title="Contact via WhatsApp"
                >
                  <Image
                    src="/whatsapp.png"
                    alt="WhatsApp"
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                  <span className="text-xs font-semibold">whatsapp</span>
                </a>
              </div>
            )}

            {/* District and Ward */}
            {(supporter.district || supporter.ward || supporter.llg) && (
              <div className="flex items-start gap-2">
                <span className="text-lg">📍</span>
                <div className="flex-1">
                  {supporter.district && (
                    <p className="text-gray-900 font-semibold">{supporter.district}</p>
                  )}
                  {(supporter.ward || supporter.llg) && (
                    <p className="text-gray-600 text-xs">
                      {supporter.ward && `Ward: ${supporter.ward}`}
                      {supporter.ward && supporter.llg && ' • '}
                      {supporter.llg && `LLG: ${supporter.llg}`}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Coordinator Notes */}
          {supporter.coordinator_notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-semibold mb-1">Notes</p>
              <p className="text-sm text-gray-700 line-clamp-2">
                {supporter.coordinator_notes}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
            {supporter.district && (
              <span className="inline-block px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-50 rounded-lg">
                {supporter.district}
              </span>
            )}
            {supporter.ward && (
              <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-50 rounded-lg">
                {supporter.ward}
              </span>
            )}
            {supporter.llg && (
              <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded-lg">
                {supporter.llg}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          {!readOnly && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Edit Modal */}
      {!readOnly && isEditModalOpen && (
        <EditSupporterModal
          supporter={supporter}
          onClose={() => setIsEditModalOpen(false)}
          onSave={() => {
            setIsEditModalOpen(false)
            if (onUpdate) onUpdate()
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {!readOnly && showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-4 animate-pulse-subtle">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2m0-16l9 9-9 9-9-9 9-9z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Mark for Deletion?</h3>
            <p className="text-sm text-gray-600 text-center mb-6">
              This will mark <strong>{supporter.name}</strong> as pending deletion. The admin can review and confirm the final deletion later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {isDeleting ? 'Marking...' : 'Mark for Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}