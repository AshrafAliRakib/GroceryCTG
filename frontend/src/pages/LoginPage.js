import React from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../components/Login'

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate()

  const handleSuccess = () => {
    onLoginSuccess()
    navigate('/')
  }

  return <Login onSuccess={handleSuccess} onRegister={() => navigate('/register')} />
}
