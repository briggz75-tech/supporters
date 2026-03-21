'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import DashboardHeader from '@/components/DashboardHeader'
import { useToast } from '@/components/Toast'

const statusOptions = ['Strong', 'Leaning', 'Undecided']

export default function AddSupporterPage() {
  const router = useRouter()
  const { addToast } = useToast()
  const [authLoading, setAuthLoading] = useState(true)
  const [adminAuth, setAdminAuth] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      setAuthLoading(true)
      const localAuth =
        typeof window !== 'undefined' && sessionStorage.getItem('adminLoggedIn') === 'true'
      if (localAuth) {
        setAdminAuth(true)
        setAuthLoading(false)
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      setAdminAuth(Boolean(user))
      setAuthLoading(false)

      const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
        setAdminAuth(Boolean(session?.user))
      })

      return () => {
        listener.subscription.unsubscribe()
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!authLoading && !adminAuth) {
      const redirectUrl = encodeURIComponent('/add-supporter')
      window.location.href = `/login?redirect=${redirectUrl}`
    }
  }, [authLoading, adminAuth])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    ward: '',
    llg: '',
    district: '',
    status: 'Undecided',
    title: '',
    coordinator_notes: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file', 'error')
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImagePreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleCameraClick = () => {
    cameraInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const clearImagePreview = () => {
    setImagePreview(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.phone) {
      addToast('Name and phone are required', 'error')
      return
    }

    setLoading(true)
    try {
      let imageUrl = ''

      // Upload image to Supabase Storage if one was selected
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split('.').pop()
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`
          const filePath = `supporter-images/${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('supporter-images')
            .upload(filePath, imageFile, {
              cacheControl: '3600',
              upsert: false,
            })

          if (uploadError) {
            addToast(`Failed to upload image: ${uploadError.message}`, 'error')
            setLoading(false)
            return
          }

          // Get public URL
          const { data } = supabase.storage
            .from('supporter-images')
            .getPublicUrl(filePath)

          imageUrl = data?.publicUrl || ''
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          addToast(`Error uploading image: ${message}`, 'error')
          setLoading(false)
          return
        }
      }

      // Insert supporter with image URL
      const { error } = await supabase.from('supporters').insert([
        {
          name: formData.name,
          phone: formData.phone || null,
          ward: formData.ward || null,
          llg: formData.llg || null,
          district: formData.district || null,
          status: formData.status,
          title: formData.title || null,
          image_url: imageUrl || null,
          coordinator_notes: formData.coordinator_notes || null,
        },
      ])

      if (error) {
        addToast(`Failed to add supporter: ${error.message}`, 'error')
      } else {
        addToast(`✅ ${formData.name} added successfully!`, 'success')
        // Reset form
        setFormData({
          name: '',
          phone: '',
          ward: '',
          llg: '',
          district: '',
          status: 'Undecided',
          title: '',
          coordinator_notes: '',
        })
        setImageFile(null)
        setImagePreview(null)
        clearImagePreview()
        // Redirect to home after 2 seconds
        setTimeout(() => router.push('/'), 2000)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      addToast(`Error: ${message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (!adminAuth) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader
        title="Add New Supporter"
        description="Register a new campaign supporter to your database"
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Image Upload Section */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📸 Supporter Photo</h3>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Preview */}
                {imagePreview ? (
                  <div className="flex-shrink-0 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border-2 border-indigo-200"
                    />
                    <button
                      type="button"
                      onClick={clearImagePreview}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-2xl">
                    📷
                  </div>
                )}

                {/* Upload Buttons */}
                <div className="flex-1 space-y-3">
                  <button
                    type="button"
                    onClick={handleFileUploadClick}
                    className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                  >
                    📁 Upload Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    📷 Take Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Primary Information */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Primary Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+675 1234 5678"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Location Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g., Port Moresby"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LLG (Local Level Government)
                  </label>
                  <input
                    type="text"
                    name="llg"
                    value={formData.llg}
                    onChange={handleChange}
                    placeholder="e.g., Motu-Koita"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ward
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleChange}
                    placeholder="e.g., Ward 1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ℹ️ Additional Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title / Position
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Business Owner, Teacher"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Support Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status === 'Strong'
                          ? '🟢 Strong'
                          : status === 'Leaning'
                            ? '🟡 Leaning'
                            : '⚫ Undecided'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Coordinator Notes</h3>
              <textarea
                name="coordinator_notes"
                value={formData.coordinator_notes}
                onChange={handleChange}
                placeholder="Add any relevant notes about this supporter..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
              >
                ← Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Adding...
                  </>
                ) : (
                  <>
                    ✓ Add Supporter
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <p className="font-semibold mb-2">💡 Tips:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>All red(*) fields are required</li>
            <li>Upload a photo to help identify the supporter</li>
            <li>Use the status dropdown to indicate their level of support</li>
            <li>Add notes to track important information about them</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
