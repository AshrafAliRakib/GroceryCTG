import React, { useEffect, useState } from 'react'
import { authAPI } from '../api'

export default function AccountPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authAPI.getProfile()
      .then(res => {
        setProfile(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="text-center py-24 text-xl text-slate-600">Loading account details…</div>
  }

  if (!profile) {
    return <div className="text-center py-24 text-xl text-slate-600">No account information found.</div>
  }

  const memberSince = profile.date_joined ? new Date(profile.date_joined).toLocaleDateString() : 'Member since first login'

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-[32px] bg-white p-10 shadow-2xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-green-600">My account</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">Welcome back, {profile.username}</h1>
            <p className="mt-2 text-slate-600">Manage your profile, orders, and saved preferences from one place.</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6 text-slate-700">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Member since</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{memberSince}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Profile</p>
            <div className="mt-5 space-y-4 text-slate-700">
              <div>
                <p className="font-semibold text-slate-900">Username</p>
                <p>{profile.username}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Email</p>
                <p>{profile.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Phone</p>
                <p>{profile.PHONE || 'Not provided'}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Role</p>
                <p>{profile.role || 'customer'}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Account overview</p>
            <div className="mt-5 space-y-4 text-slate-700">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Orders</p>
                <p className="mt-1 text-slate-500">View your recent orders and track deliveries on the cart page.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Addresses</p>
                <p className="mt-1 text-slate-500">Add or manage saved delivery details from the backend.</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">Security</p>
                <p className="mt-1 text-slate-500">Your credentials are handled by the Django auth API.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
