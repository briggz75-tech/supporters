'use client'

import React, { useState } from 'react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    autoBackup: true,
    emailNotifications: true,
    dataRetention: '90',
    theme: 'light',
    language: 'en',
  })

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // In real app, would save to API
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>

        <div className="space-y-6">
          {/* Theme Setting */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System Preference)</option>
            </select>
          </div>

          {/* Language Setting */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="pi">Pidgin</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          {/* Data Retention Setting */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Data Retention (days)</label>
            <select
              value={settings.dataRetention}
              onChange={(e) => handleChange('dataRetention', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="30">30 days</option>
              <option value="90">90 days</option>
              <option value="180">6 months</option>
              <option value="365">1 year</option>
              <option value="forever">Forever</option>
            </select>
            <p className="text-xs text-gray-500">Activity logs older than this will be archived</p>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Notifications</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-600">Receive email alerts for important events</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => handleChange('emailNotifications', e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Auto Backup</h3>
              <p className="text-sm text-gray-600">Automatically backup data daily</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) => handleChange('autoBackup', e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-lg shadow-sm border border-red-300 p-6">
        <h2 className="text-lg font-semibold text-red-900 mb-4">⚠️ Danger Zone</h2>

        <div className="space-y-3">
          <button className="w-full px-4 py-2 border border-red-300 text-red-700 hover:bg-red-100 rounded-lg font-medium transition-colors">
            📥 Export All Data
          </button>
          <button className="w-full px-4 py-2 border border-red-300 text-red-700 hover:bg-red-100 rounded-lg font-medium transition-colors">
            🗑️ Clear Activity Log
          </button>
          <button className="w-full px-4 py-2 border-2 border-red-600 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors">
            ⚡ Reset All Settings
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  )
}
