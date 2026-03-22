'use client'

import { useState, useRef } from 'react'
import { useToast } from './Toast'

export default function WhatsappSurveyForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    foundation_rating: '5',
    feedback_text: '',
    how_to_help: '',
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTemplate, setShowTemplate] = useState(true)
  const templateRef = useRef<HTMLDivElement>(null)
  const { addToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          foundation_rating: parseInt(formData.foundation_rating),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit survey')
      }

      addToast('Thank you! Your feedback has been submitted.', 'success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        foundation_rating: '5',
        feedback_text: '',
        how_to_help: '',
      })
      setShowTemplate(true)
    } catch (error) {
      addToast('Error submitting survey. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyTemplate = () => {
    const template = `
HI! 👋 We'd love your feedback about the Honlly Isaac Jokema Foundation!

Please reply with:
NAME: [Your name]
EMAIL: [Your email]
PHONE: [Your phone number - optional]
RATING: [1-5, where 5 is excellent]
FEEDBACK: [What do you think about our work?]
HOW TO HELP: [How would you like to help? - optional]

Thank you for supporting us! 🙏
    `.trim()

    navigator.clipboard.writeText(template).then(() => {
      addToast('Template copied to clipboard!', 'success')
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Foundation Survey</h1>
          <p className="text-gray-600 text-lg">Honlly Isaac Jokema Foundation</p>
          <p className="text-gray-500 mt-2">Share your thoughts and help us improve</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setShowTemplate(true)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              showTemplate
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            📱 WhatsApp Template
          </button>
          <button
            onClick={() => setShowTemplate(false)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              !showTemplate
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            📝 Fill Form Here
          </button>
        </div>

        {/* WhatsApp Template Section */}
        {showTemplate && (
          <div ref={templateRef} className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Copy This Template</h2>
            <p className="text-gray-600 mb-4">Copy this message and paste it in the WhatsApp group. Members can reply with their information:</p>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-6 mb-6 font-mono text-sm whitespace-pre-wrap">
{`HI! 👋 We'd love your feedback about the Honlly Isaac Jokema Foundation!

Please reply with:
NAME: [Your name]
EMAIL: [Your email]
PHONE: [Your phone number - optional]
RATING: [1-5, where 5 is excellent]
FEEDBACK: [What do you think about our work?]
HOW TO HELP: [How would you like to help? - optional]

Thank you for supporting us! 🙏`}
            </div>

            <button
              onClick={copyTemplate}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              📋 Copy Template
            </button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Then Submit Responses Here:</h3>
              <p className="text-blue-700 text-sm">
                You can also fill out the form below to submit your feedback directly instead of using WhatsApp.
              </p>
            </div>
          </div>
        )}

        {/* Form Section */}
        {!showTemplate && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How would you rate the foundation? *
              </label>
              <select
                name="foundation_rating"
                value={formData.foundation_rating}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What do you think about our work? *
              </label>
              <textarea
                name="feedback_text"
                value={formData.feedback_text}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your thoughts and feedback..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How would you like to help?
              </label>
              <textarea
                name="how_to_help"
                value={formData.how_to_help}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us how you'd like to contribute..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
