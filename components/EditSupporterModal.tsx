'use client'

import React, { useState, useRef } from 'react'
import { Supporter, supabase } from '@/lib/supabaseClient'
import { useToast } from './Toast'

interface EditSupporterModalProps {
  supporter: Supporter
  onClose: () => void
  onSave?: () => void
}

const EditSupporterModal: React.FC<EditSupporterModalProps> = ({
  supporter,
  onClose,
  onSave,
}) => {
  const { addToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(supporter?.image_url || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: supporter?.name || '',
    phone: supporter?.phone || '',
    title: supporter?.title || '',
    district: supporter?.district || '',
    llg: supporter?.llg || '',
    ward: supporter?.ward || '',
    status: supporter?.status || 'Pending',
    coordinator_notes: supporter?.coordinator_notes || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
    setIsLoading(true)

    try {
      let imageUrl = supporter.image_url || ''

      // Upload new image if one was selected
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
            setIsLoading(false)
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
          setIsLoading(false)
          return
        }
      }

      // Update supporter - convert empty strings to null for nullable fields
      const updatePayload = {
        name: formData.name || '',
        phone: formData.phone || null,
        title: formData.title || null,
        district: formData.district || null,
        llg: formData.llg || null,
        ward: formData.ward || null,
        status: formData.status || 'Pending',
        coordinator_notes: formData.coordinator_notes || null,
        image_url: imageUrl,
      }

      const { error } = await supabase
        .from('supporters')
        .update(updatePayload)
        .eq('id', supporter.id)

      if (error) {
        addToast('Failed to update supporter', 'error')
        return
      }

      addToast('Supporter updated successfully', 'success')
      onSave?.()
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      addToast(`Error: ${message}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-6 text-purple-700">Edit Supporter</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50/50">
            {imagePreview ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-lg object-cover shadow-md"
                />
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={clearImagePreview}
                    className="flex-1 px-3 py-1.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex justify-center gap-2 w-full flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Photo
                  </button>
                </div>
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
            )}
          </div>

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title/Position"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <input
            name="district"
            value={formData.district}
            onChange={handleChange}
            placeholder="District"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <input
            name="llg"
            value={formData.llg}
            onChange={handleChange}
            placeholder="LLG"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <input
            name="ward"
            value={formData.ward}
            onChange={handleChange}
            placeholder="Ward"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="Pending">Pending</option>
            <option value="Strong">Strong</option>
            <option value="Leaning">Leaning</option>
            <option value="Undecided">Undecided</option>
          </select>
          <textarea
            name="coordinator_notes"
            value={formData.coordinator_notes}
            onChange={handleChange}
            placeholder="Coordinator Notes"
            className="border border-gray-300 p-3 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            disabled={isLoading}
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditSupporterModal