import React, { useEffect, useState } from 'react'
import { productAPI } from '../api'
import ProductCard from './ProductCard'

export default function ProductList({ onAddToCart, initialCategory, initialSearch }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategory ? parseInt(initialCategory, 10) : null)
  const [searchTerm, setSearchTerm] = useState(initialSearch || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategoryId(parseInt(initialCategory, 10))
    }
  }, [initialCategory])

  useEffect(() => {
    setSearchTerm(initialSearch || '')
  }, [initialSearch])

  useEffect(() => {
    productAPI.getProducts().then(res => {
      const prods = res.data.results || res.data
      setProducts(prods)

      const cats = [...new Map(prods.filter(p => p.category).map(p => [p.category.id, p.category.name]))].map(([id, name]) => ({ id, name }))
      setCategories(cats)
      setLoading(false)
    }).catch(err => {
      console.error(err)
      setLoading(false)
    })
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategoryId || product.category?.id === selectedCategoryId
    const query = searchTerm.trim().toLowerCase()
    const matchesSearch = !query || [product.product_name, product.brand, product.description].join(' ').toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })

  if (loading) return <div className="text-center py-16"><div className="animate-pulse text-xl text-slate-600">🛒 Loading fresh groceries...</div></div>

  return (
    <div>
      <div className="rounded-[32px] bg-white p-8 shadow-lg mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">🌟 Fresh Groceries</h2>
            <p className="mt-2 text-slate-600">Browse our wide selection of {products.length} quality grocery products.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryId(null)
              setSearchTerm('')
            }}
            className="rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Clear filters
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_220px]">
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search groceries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-0 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategoryId === null ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                All Products
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCategoryId === cat.id ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4 text-slate-600">
        <span className="font-semibold text-slate-900">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''} found {selectedCategoryId && `in ${categories.find(cat => cat.id === selectedCategoryId)?.name || 'selected category'}`}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-[32px] bg-slate-50 p-12 text-center text-xl text-slate-600">No products match your search or selected category.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => onAddToCart(product.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
