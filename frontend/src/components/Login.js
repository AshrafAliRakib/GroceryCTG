import React, { useState } from 'react'
import { authAPI } from '../api'

export default function Login({ onSuccess, onRegister }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.getToken({
        username,
        password
      })
      
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      onSuccess()
    } catch (err) {
      setError('❌ ' + (err.response?.data?.detail || 'Invalid credentials'))
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-green-600 mb-2 text-center">🛒 CTGGrocery</h1>
        <p className="text-gray-600 text-center mb-8">Login to Your Account</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6 flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? '⏳ Logging in...' : 'Login'}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <button
          onClick={onRegister}
          className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2"
        >
          <span>📝</span>
          <span>Create New Account</span>
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-2">Demo Accounts:</p>
          <p>👤 Customer: testuser / testpass123</p>
          <p>👨‍💼 Admin: admin / admin123</p>
        </div>
      </div>
    </div>
  )
}
