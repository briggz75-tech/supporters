'use client'

import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  breadcrumbs?: BreadcrumbItem[]
  status?: 'live' | 'syncing' | 'error'
}

export default function AdminLayout({
  children,
  breadcrumbs = [],
  status = 'live',
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static h-screen transition-all duration-300 z-50 md:z-40 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <AdminSidebar
          isCollapsed={!sidebarOpen}
          onCollapse={() => setSidebarOpen(!sidebarOpen)}
          onClose={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-30 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Menu Button + Breadcrumbs */}
              <div className="flex items-center gap-4 min-w-0">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm min-w-0 overflow-x-auto">
                  <a
                    href="/admin"
                    className="text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                  >
                    Admin
                  </a>
                  {breadcrumbs.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <span className="text-gray-400">/</span>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-indigo-600 hover:text-indigo-700 whitespace-nowrap"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span className="text-gray-600 whitespace-nowrap">{item.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                </nav>
              </div>

              {/* Right: Status + Indicators */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Status Indicator */}
                <div
                  className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor:
                      status === 'live'
                        ? 'rgb(220, 252, 231)'
                        : status === 'syncing'
                          ? 'rgb(254, 243, 199)'
                          : 'rgb(254, 226, 226)',
                    color:
                      status === 'live'
                        ? 'rgb(5, 150, 105)'
                        : status === 'syncing'
                          ? 'rgb(180, 83, 9)'
                          : 'rgb(220, 38, 38)',
                  }}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      status === 'syncing' ? 'animate-pulse' : ''
                    }`}
                    style={{
                      backgroundColor:
                        status === 'live'
                          ? 'rgb(34, 197, 94)'
                          : status === 'syncing'
                            ? 'rgb(251, 146, 60)'
                            : 'rgb(239, 68, 68)',
                    }}
                  />
                  <span className="hidden sm:inline">
                    {status === 'live' ? 'Live' : status === 'syncing' ? 'Syncing...' : 'Error'}
                  </span>
                </div>

                {/* User Menu */}
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    AD
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-600 hidden sm:block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6">{children}</div>
        </div>
      </main>
    </div>
  )
}
