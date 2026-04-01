import React from 'react'
import { useNavigate } from 'react-router-dom'
import Cart from '../components/Cart'

export default function CartPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <Cart onCheckout={() => navigate('/checkout')} onBack={() => navigate('/shop')} />
    </div>
  )
}
