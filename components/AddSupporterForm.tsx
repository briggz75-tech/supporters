'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface AddSupporterFormProps {
  onSupporterAdded: () => void
  onError: (error: string) => void
  onSuccess: (message: string) => void
}

const statusOptions = ['Strong', 'Leaning', 'Undecided']

const districtOptions = [
  'Bulolo',
  'Finschhafen',
  'Huon Gulf',
  'Kabwum',
  'Lae',
  'Markham',
  'Menyamya',
  'Nawaeb',
  'Tewai-Siassi',
  'Wau Waria',
]

export default function AddSupporterForm({
  onSupporterAdded,
  onError,
  onSuccess,
}: AddSupporterFormProps) {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    ward: '',
    llg: '',
    district: '',
    status: 'Undecided',
    title: '',
    image_url: '',
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
      onError('Please select a valid image file')
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
    setFormData((prev) => ({ ...prev, image_url: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (cameraInputRef.current) cameraInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone) {
      onError('Name and phone are required')
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
            onError(`Failed to upload image: ${uploadError.message}`)
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
          onError(`Error uploading image: ${message}`)
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
          is_approved: false,
        },
      ])

      if (error) {
        onError(`Failed to add supporter: ${error.message}`)
      } else {
        onSuccess(`${formData.name} added successfully!`)
        setFormData({
          name: '',
          phone: '',
          ward: '',
          llg: '',
          district: '',
          status: 'Undecided',
          title: '',
          image_url: '',
          coordinator_notes: '',
        })
        setImageFile(null)
        setImagePreview(null)
        clearImagePreview()
        onSupporterAdded()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      onError(`Error: ${message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Supporter</h2>
        <p className="text-gray-600 text-xs sm:text-sm mt-1">
          Register a new campaign supporter to your database.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Primary Info */}
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">Primary Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name *"
              required
              className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number *"
              required
              className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Location Info */}
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">Location Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">Select District</option>
              {districtOptions.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="llg"
              value={formData.llg}
              onChange={handleChange}
              placeholder="Local Level Government (LLG)"
              className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              placeholder="Ward"
              className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  Status: {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Info */}
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">Additional Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title / Position (optional)"
              className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">Profile Picture</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
            {imagePreview ? (
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 sm:w-32 h-24 sm:h-32 rounded-lg object-cover shadow-md"
                />
                <div className="flex gap-2 sm:gap-3 w-full flex-col sm:flex-row">
                  <button
                    type="button"
                    onClick={handleFileUploadClick}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={clearImagePreview}
                    className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="flex justify-center gap-2 sm:gap-3 w-full flex-col sm:flex-row">
                  <button
                    type="button"
                    onClick={handleFileUploadClick}
                    className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Photo</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 text-center">
                  Drag and drop an image here or click the buttons above
                </p>
              </div>
            )}
            
            {/* Hidden input elements */}
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

        {/* Notes */}
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-3 sm:mb-4 uppercase tracking-wide">Notes</h3>
          <textarea
            name="coordinator_notes"
            value={formData.coordinator_notes}
            onChange={handleChange}
            placeholder="Coordinator notes (optional)"
            rows={3}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="hidden sm:inline">Adding...</span>
              </span>
            ) : (
              'Add Supporter'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
