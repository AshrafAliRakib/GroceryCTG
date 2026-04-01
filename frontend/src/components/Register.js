import React, { useState } from 'react'
import { authAPI } from '../api'

export default function Register({ onSuccess, onBack }) {
  const [step, setStep] = useState(1) // 1: register info, 2: choose OTP method, 3: OTP verification
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Registration form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  
  // OTP form
  const [otpData, setOtpData] = useState({
    otpType: 'email',
    otpCode: '',
    otp_id: null
  })
  
  const [expiresAt, setExpiresAt] = useState(null)
  const [resendEnabled, setResendEnabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (resendTimer === 0 && step === 3) {
      setResendEnabled(true)
    }
  }, [resendTimer, step])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleOTPInputChange = (e) => {
    setOtpData({ ...otpData, [e.target.name]: e.target.value })
    setError('')
  }

  // Step 1: Register user
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const response = await authAPI.register({
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      })
      
      setSuccess('✅ Account created! Sending OTP...')
      setTimeout(() => {
        setSuccess('')
        // Skip OTP method selection if no phone - go directly to send OTP
        if (!formData.phone) {
          setOtpData({ ...otpData, otpType: 'email' })
          handleSendOTPDirect('email')
        } else {
          setStep(2)
        }
      }, 200)  // Faster transition (200ms)
    } catch (err) {
      setError('❌ ' + (err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || err.response?.data?.detail || 'Registration failed'))
      setLoading(false)
    }
  }

  // Direct OTP send (skip method selection)
  const handleSendOTPDirect = async (otpType) => {
    setError('')
    setLoading(true)

    try {
      const payload = {
        otp_type: otpType,
        email: otpType === 'email' ? formData.email : '',
        phone: otpType === 'phone' ? formData.phone : ''
      }

      const response = await authAPI.sendOTP(payload)
      
      setOtpData({ ...otpData, otp_id: response.data.otp_id })
      setExpiresAt(response.data.expires_at)
      setSuccess(`✅ OTP sent to your ${otpType}!`)
      
      setTimeout(() => {
        setSuccess('')
        setStep(3)
      }, 200)  // Faster transition (200ms instead of 800ms)
    } catch (err) {
      setError('❌ ' + (err.response?.data?.error || err.response?.data?.detail || 'Failed to send OTP'))
      setLoading(false)
    }
  }

  // Step 2: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const otpType = otpData.otpType
      const payload = {
        otp_type: otpType,
        email: otpType === 'email' ? formData.email : '',
        phone: otpType === 'phone' ? formData.phone : ''
      }

      const response = await authAPI.sendOTP(payload)
      
      setOtpData({ ...otpData, otp_id: response.data.otp_id })
      setExpiresAt(response.data.expires_at)
      setSuccess(`✅ OTP sent to your ${otpType}!`)
      
      setTimeout(() => {
        setSuccess('')
        setStep(3)
      }, 1500)
    } catch (err) {
      setError('❌ ' + (err.response?.data?.error || err.response?.data?.detail || 'Failed to send OTP'))
      setLoading(false)
    }
  }

  // Step 3: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (otpData.otpCode.length !== 6) {
      setError('OTP must be 6 digits')
      setLoading(false)
      return
    }

    try {
      const otpType = otpData.otpType
      const payload = {
        otp_type: otpType,
        otp_code: otpData.otpCode,
        email: otpType === 'email' ? formData.email : '',
        phone: otpType === 'phone' ? formData.phone : ''
      }

      const response = await authAPI.verifyOTP(payload)
      
      setSuccess('✅ OTP verified successfully! Registration complete!')
      setTimeout(() => {
        setSuccess('')
        // Now login the user
        handleAutoLogin()
      }, 1500)
    } catch (err) {
      const remaining = err.response?.data?.attempts_remaining
      setError('❌ ' + (err.response?.data?.error || 'Invalid OTP'))
      if (remaining !== undefined) {
        setError(`❌ Invalid OTP. ${remaining} attempts remaining`)
      }
      setLoading(false)
    }
  }

  const handleAutoLogin = async () => {
    try {
      const response = await authAPI.getToken({
        username: formData.username,
        password: formData.password
      })
      
      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      onSuccess()
    } catch (err) {
      // Even if login fails, registration was successful
      onSuccess()
    }
  }

  const handleResendOTP = async () => {
    setError('')
    setResendEnabled(false)
    setResendTimer(5) // 5 second cooldown (shorter for faster testing)
    
    try {
      const otpType = otpData.otpType
      const payload = {
        otp_type: otpType,
        email: otpType === 'email' ? formData.email : '',
        phone: otpType === 'phone' ? formData.phone : ''
      }

      const response = await authAPI.sendOTP(payload)
      
      setOtpData({ ...otpData, otpCode: '', otp_id: response.data.otp_id })
      setExpiresAt(response.data.expires_at)
      setSuccess(`✅ OTP resent to your ${otpType}!`)
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError('❌ Failed to resend OTP')
      setResendEnabled(true)
      setResendTimer(0)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-green-600 mb-2 text-center">🛒 CTGGrocery</h1>
        <p className="text-gray-600 text-center mb-8">Create Your Account</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r-lg mb-6 flex items-start">
            <span className="text-2xl mr-3">⚠️</span>
            <div>{error}</div>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-r-lg mb-6 flex items-start">
            <span className="text-2xl mr-3">✅</span>
            <div>{success}</div>
          </div>
        )}

        {/* Step 1: Registration */}
        {step === 1 && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-green-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? '⏳ Creating Account...' : 'Create Account'}
            </button>
            
            <button
              type="button"
              onClick={onBack}
              className="w-full text-gray-700 font-semibold py-2"
            >
              ← Back to Login
            </button>
          </form>
        )}

        {/* Step 2: Choose OTP Method */}
        {step === 2 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <p className="text-gray-700 mb-6">Choose how you want to verify your account:</p>
            
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition" style={{ borderColor: otpData.otpType === 'email' ? '#16a34a' : '#e5e7eb' }}>
                <input
                  type="radio"
                  name="otpType"
                  value="email"
                  checked={otpData.otpType === 'email'}
                  onChange={(e) => setOtpData({ ...otpData, otpType: e.target.value })}
                  className="w-5 h-5 text-green-600"
                />
                <div className="ml-4">
                  <div className="font-semibold text-gray-800">📧 Email OTP</div>
                  <div className="text-sm text-gray-500">We'll send a code to {formData.email}</div>
                </div>
              </label>

              {formData.phone && (
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition" style={{ borderColor: otpData.otpType === 'phone' ? '#16a34a' : '#e5e7eb' }}>
                  <input
                    type="radio"
                    name="otpType"
                    value="phone"
                    checked={otpData.otpType === 'phone'}
                    onChange={(e) => setOtpData({ ...otpData, otpType: e.target.value })}
                    className="w-5 h-5 text-green-600"
                  />
                  <div className="ml-4">
                    <div className="font-semibold text-gray-800">📱 SMS OTP</div>
                    <div className="text-sm text-gray-500">We'll send a code to {formData.phone}</div>
                  </div>
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? '⏳ Sending OTP...' : 'Send OTP'}
            </button>
            
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-gray-700 font-semibold py-2"
            >
              ← Back
            </button>
          </form>
        )}

        {/* Step 3: Verify OTP */}
        {step === 3 && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <p className="text-gray-700 mb-6">
              Enter the 6-digit code sent to your {otpData.otpType === 'email' ? 'email' : 'phone'} (expires in 5 minutes)
            </p>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">OTP Code</label>
              <input
                type="text"
                name="otpCode"
                value={otpData.otpCode}
                onChange={handleOTPInputChange}
                placeholder="000000"
                maxLength="6"
                autoFocus
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-3xl text-center tracking-widest focus:border-green-500 focus:outline-none"
                required
              />
              <p className="text-gray-500 text-sm mt-2">
                Code expires at: {expiresAt ? new Date(expiresAt).toLocaleTimeString() : 'calculating...'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? '⏳ Verifying...' : '✓ Verify OTP'}
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={!resendEnabled}
                onClick={handleResendOTP}
                className="flex-1 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:text-gray-400 disabled:border-gray-300"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : '📨 Resend OTP'}
              </button>
              <button
                type="button"
                onClick={() => setStep(formData.phone ? 2 : 1)}
                className="flex-1 text-gray-700 font-semibold py-2 hover:bg-gray-100 rounded-lg"
              >
                ← Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
