import React from 'react'
import { useNavigate } from 'react-router-dom'
import Register from '../components/Register'

export default function RegisterPage({ onRegisterSuccess }) {
  const navigate = useNavigate()

  const handleSuccess = () => {
    onRegisterSuccess()
    navigate('/')
  }

  return <Register onSuccess={handleSuccess} onBack={() => navigate('/login')} />
}
