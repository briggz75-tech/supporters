'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/Toast'

const ADMIN_EMAIL = 'admin@jokema'
const ADMIN_PASSWORD = 'jokema2027'


export default function LoginPage() {
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState<string | null>(null)

  useEffect(() => {
    // Get redirect param from URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const redirectParam = params.get('redirect')
      setRedirect(redirectParam)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      addToast('Email and password are required', 'error')
      return
    }

    setLoading(true)
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    if (trimmedEmail === ADMIN_EMAIL && trimmedPassword === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminLoggedIn', 'true')
      addToast('Login successful', 'success')
      setLoading(false)
      if (redirect) {
        window.location.href = redirect
      } else {
        window.location.href = '/admin'
      }
    } else {
      addToast('Invalid email or password', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Login</h1>
        <p className="text-sm text-gray-600 mb-6">
          Use admin access to manage supporters.
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-xs text-gray-500">
          Or go back to <a href="/" className="text-purple-600 underline">main dashboard</a>.
        </p>
      </div>
    </div>
  )
}
