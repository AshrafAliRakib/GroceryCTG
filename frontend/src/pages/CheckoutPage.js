import React from 'react'
import { useNavigate } from 'react-router-dom'
import Checkout from '../components/Checkout'

export default function CheckoutPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <Checkout onBack={() => navigate('/cart')} onSuccess={() => navigate('/')} />
    </div>
  )
}
