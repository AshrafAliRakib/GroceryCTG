import React from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductList from '../components/ProductList'

export default function ShopPage({ onAddToCart }) {
  const [params] = useSearchParams()
  const category = params.get('category')
  const search = params.get('search')

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-lg">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-green-600">Grocery store</p>
          <h1 className="text-4xl font-bold text-slate-900">Shop the freshest products</h1>
          <p className="max-w-2xl text-slate-600">Filter by category, search by name, and add groceries to your cart in one smooth experience.</p>
        </div>
      </div>

      <ProductList initialCategory={category} initialSearch={search} onAddToCart={onAddToCart} />
    </div>
  )
}
