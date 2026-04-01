import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminDashboard from '../components/AdminDashboard'

export default function AdminPage({ user, onLogout }) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminDashboard user={user} onLogout={onLogout} onBack={() => navigate('/shop')} />
    </div>
  )
}
