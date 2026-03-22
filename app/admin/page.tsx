'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, Supporter } from '@/lib/supabaseClient'
import { useToast } from '@/components/Toast'
import AdminLayout from '@/components/AdminLayout'
import AdminTabs, { TabType } from '@/components/AdminTabs'
import AdminOverview from '@/components/AdminOverview'
import AdminSupporters from '@/components/AdminSupporters'
import AdminAnalytics from '@/components/AdminAnalytics'
import AdminActivity from '@/components/AdminActivity'
import AdminSettings from '@/components/AdminSettings'

function AdminDashboard() {
  const { addToast } = useToast()
  const [authLoading, setAuthLoading] = useState(true)
  const [adminAuth, setAdminAuth] = useState(false)
  const [supporters, setSupporters] = useState<Supporter[]>([])
  const [supportersLoading, setSupportersLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [stats, setStats] = useState({
    total: 0,
    strong: 0,
    leaning: 0,
    undecided: 0,
  })
  const [syncStatus, setSyncStatus] = useState<'live' | 'syncing' | 'error'>('live')

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
      window.location.href = '/login'
    }
  }, [authLoading, adminAuth])

  // Calculate statistics
  const calculateStats = (data: Supporter[]) => {
    const approvedData = data.filter((s) => s.is_approved === true)
    const stats = {
      total: approvedData.length,
      strong: approvedData.filter((s) => s.status?.toLowerCase().includes('strong')).length,
      leaning: approvedData.filter((s) => s.status?.toLowerCase().includes('lean')).length,
      undecided: approvedData.filter(
        (s) =>
          s.status?.toLowerCase().includes('undecided') ||
          s.status?.toLowerCase().includes('pending')
      ).length,
    }
    setStats(stats)
  }

  // Fetch all supporters
  const fetchSupporters = useCallback(async () => {
    setSyncStatus('syncing')
    setSupportersLoading(true)
    try {
      const { data, error } = await supabase
        .from('supporters')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Fetch error:', error)
        addToast('Failed to load supporters: ' + error.message, 'error')
        setSyncStatus('error')
        setSupportersLoading(false)
        return
      }

      setSupporters(data || [])
      calculateStats(data || [])
      setSyncStatus('live')
    } catch (err) {
      console.error('❌ Fetch exception:', err)
      addToast(
        'An error occurred while loading supporters: ' +
          (err instanceof Error ? err.message : 'Unknown error'),
        'error'
      )
      setSyncStatus('error')
    } finally {
      setSupportersLoading(false)
    }
  }, [addToast])

  // Load supporters on mount
  useEffect(() => {
    if (adminAuth && !authLoading) {
      fetchSupporters()
    }
  }, [adminAuth, authLoading, fetchSupporters])

  // Bulk delete supporters
  const handleBulkDelete = useCallback(async (ids: string[]) => {
    if (ids.length === 0) return
    setSyncStatus('syncing')
    try {
      const { error } = await supabase
        .from('supporters')
        .delete()
        .in('id', ids)

      if (error) {
        addToast(`Delete failed: ${error.message}`, 'error')
        setSyncStatus('error')
        return
      }

      addToast(`Successfully deleted ${ids.length} supporter${ids.length !== 1 ? 's' : ''}`, 'success')
      setSupporters((prev) => prev.filter((s) => !ids.includes(s.id)))
      setSyncStatus('live')
    } catch (err) {
      console.error('❌ Bulk delete error:', err)
      addToast('An error occurred while deleting supporters', 'error')
      setSyncStatus('error')
    }
  }, [addToast])

  // Bulk update status
  const handleBulkStatusUpdate = useCallback(async (ids: string[], status: string) => {
    if (ids.length === 0 || !status) return
    setSyncStatus('syncing')
    try {
      const { error } = await supabase
        .from('supporters')
        .update({ status })
        .in('id', ids)

      if (error) {
        addToast(`Status update failed: ${error.message}`, 'error')
        setSyncStatus('error')
        return
      }

      addToast(`Updated ${ids.length} supporter${ids.length !== 1 ? 's' : ''} to "${status}"`, 'success')
      setSupporters((prev) =>
        prev.map((s) => (ids.includes(s.id) ? { ...s, status } : s))
      )
      setSyncStatus('live')
    } catch (err) {
      console.error('❌ Bulk update error:', err)
      addToast('An error occurred while updating supporters', 'error')
      setSyncStatus('error')
    }
  }, [addToast])

  // Approve supporter
  const handleApproveSupporter = useCallback(async (id: string) => {
    setSyncStatus('syncing')
    try {
      const { error } = await supabase
        .from('supporters')
        .update({ is_approved: true })
        .eq('id', id)

      if (error) {
        addToast(`Approval failed: ${error.message}`, 'error')
        setSyncStatus('error')
        return
      }

      addToast('Supporter approved successfully!', 'success')
      setSupporters((prev) =>
        prev.map((s) => (s.id === id ? { ...s, is_approved: true } : s))
      )
      setSyncStatus('live')
    } catch (err) {
      console.error('❌ Approval error:', err)
      addToast('An error occurred while approving supporter', 'error')
      setSyncStatus('error')
    }
  }, [addToast])

  // Reject/delete supporter
  const handleRejectSupporter = useCallback(async (id: string) => {
    setSyncStatus('syncing')
    try {
      const { error } = await supabase
        .from('supporters')
        .delete()
        .eq('id', id)

      if (error) {
        addToast(`Rejection failed: ${error.message}`, 'error')
        setSyncStatus('error')
        return
      }

      addToast('Supporter rejected and removed', 'success')
      setSupporters((prev) => prev.filter((s) => s.id !== id))
      setSyncStatus('live')
    } catch (err) {
      console.error('❌ Rejection error:', err)
      addToast('An error occurred while rejecting supporter', 'error')
      setSyncStatus('error')
    }
  }, [addToast])

  // Export to CSV
  const handleExport = useCallback(() => {
    if (supporters.length === 0) {
      addToast('No supporters to export', 'info')
      return
    }

    const headers = ['Name', 'Phone', 'Title', 'District', 'Ward', 'LLG', 'Status', 'Notes']
    const rows = supporters.map((s) => [
      s.name,
      s.phone || '',
      s.title || '',
      s.district || '',
      s.ward || '',
      s.llg || '',
      s.status || '',
      s.coordinator_notes || '',
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `supporters-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    addToast(`Exported ${supporters.length} supporters`, 'success')
  }, [supporters, addToast])

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
    <AdminLayout
      title="Admin Dashboard"
      breadcrumbs={[{ label: 'Dashboard' }]}
      status={syncStatus}
    >
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <AdminOverview
            stats={stats}
            supporters={supporters}
            onAddSupporter={() => setActiveTab('supporters')}
            onExport={handleExport}
            onRefresh={fetchSupporters}
            isLoading={supportersLoading}
          />
        )}

        {/* Supporters Tab */}
        {activeTab === 'supporters' && (
          <AdminSupporters
            supporters={supporters}
            onSearch={() => {
              // Optional: filter supporters based on search
            }}
            onSupporterAdded={fetchSupporters}
            onSupporterDeleted={(id) => {
              setSupporters((prev) => prev.filter((s) => s.id !== id))
              fetchSupporters()
            }}
            onBulkDelete={handleBulkDelete}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onApproveSupporter={handleApproveSupporter}
            onRejectSupporter={handleRejectSupporter}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AdminAnalytics supporters={supporters} />}

        {/* Activity Tab */}
        {activeTab === 'activity' && <AdminActivity />}

        {/* Settings Tab */}
        {activeTab === 'settings' && <AdminSettings />}
      </AdminTabs>
    </AdminLayout>
  )
}

export default AdminDashboard
