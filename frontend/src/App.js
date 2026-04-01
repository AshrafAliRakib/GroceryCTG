import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import AdminPage from './pages/AdminPage'
import { authAPI, cartAPI } from './api'

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('access_token'))

  useEffect(() => {
    if (token) {
      authAPI.getProfile().then(res => {
        setUser(res.data)
      }).catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setToken(null)
        setUser(null)
      })
    } else {
      setUser(null)
    }
  }, [token])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setToken(null)
    setUser(null)
  }

  const handleLoginSuccess = () => {
    setToken(localStorage.getItem('access_token'))
  }

  const handleRegisterSuccess = () => {
    setToken(localStorage.getItem('access_token'))
  }

  const handleAddToCart = async (productId) => {
    try {
      await cartAPI.addItem(productId, 1)
      alert('Product added to cart')
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Please login first')
      } else {
        console.error(err)
        alert('Unable to add product to cart')
      }
    }
  }

  const RequireAuth = ({ children }) => token ? children : <Navigate to="/login" replace />
  const RequireAdmin = ({ children }) => (user?.role === 'admin' || user?.role === 'owner') ? children : <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header user={user} onLogout={handleLogout} />
      <main className="pb-24">
        <Routes>
          <Route path="/" element={<HomePage onAddToCart={handleAddToCart} />} />
          <Route path="/shop" element={<ShopPage onAddToCart={handleAddToCart} />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
          <Route path="/checkout" element={<RequireAuth><CheckoutPage /></RequireAuth>} />
          <Route path="/account" element={<RequireAuth><AccountPage /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><AdminPage user={user} onLogout={handleLogout} /></RequireAdmin>} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage onRegisterSuccess={handleRegisterSuccess} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
