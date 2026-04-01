import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export default function Header({ user, onLogout }) {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleSearch = (event) => {
    event.preventDefault()
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
    } else {
      navigate('/shop')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/" className="flex items-center gap-3 text-slate-900">
            <span className="text-3xl">🛒</span>
            <div>
              <h1 className="text-2xl font-bold">CTGGrocery</h1>
              <p className="text-sm text-slate-500">Fresh Grocery Delivered</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            <NavLink to="/" className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-green-600' : 'text-slate-600 hover:text-green-600'}`}>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-green-600' : 'text-slate-600 hover:text-green-600'}`}>
              Shop
            </NavLink>
            <NavLink to="/cart" className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-green-600' : 'text-slate-600 hover:text-green-600'}`}>
              Cart
            </NavLink>
            {user && (
              <NavLink to="/account" className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-green-600' : 'text-slate-600 hover:text-green-600'}`}>
                Account
              </NavLink>
            )}
            {(user?.role === 'admin' || user?.role === 'owner') && (
              <NavLink to="/admin" className={({ isActive }) => `text-sm font-semibold ${isActive ? 'text-green-600' : 'text-slate-600 hover:text-green-600'}`}>
                Admin
              </NavLink>
            )}
          </nav>
        </div>

        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          <form onSubmit={handleSearch} className="flex w-full max-w-xl items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 shadow-sm sm:w-auto">
            <input
              className="w-full border-0 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              placeholder="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" className="rounded-full bg-green-600 px-4 py-2 text-white transition hover:bg-green-700">Search</button>
          </form>

          {user ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{user.username}</div>
              <button onClick={onLogout} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">Logout</button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/login" className="rounded-full border border-green-600 bg-white px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-50">Login</Link>
              <Link to="/register" className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
