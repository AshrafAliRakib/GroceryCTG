import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { productAPI, cartAPI } from '../api'

function getProductIcon(name) {
  if (!name) return '🛒'
  const lower = name.toLowerCase()
  if (lower.includes('meat') || lower.includes('fish') || lower.includes('chicken')) return '🍗'
  if (lower.includes('fruit') || lower.includes('banana') || lower.includes('apple') || lower.includes('orange') || lower.includes('mango')) return '🍎'
  if (lower.includes('vegetable') || lower.includes('tomato') || lower.includes('carrot') || lower.includes('onion') || lower.includes('pepper')) return '🥬'
  if (lower.includes('dairy') || lower.includes('milk') || lower.includes('cheese') || lower.includes('butter') || lower.includes('yogurt')) return '🥛'
  if (lower.includes('beverage') || lower.includes('juice') || lower.includes('tea') || lower.includes('coffee') || lower.includes('soda')) return '☕'
  if (lower.includes('snack') || lower.includes('chips') || lower.includes('cookie') || lower.includes('cracker')) return '🍪'
  return '🛒'
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    productAPI.getProduct(id)
      .then(res => {
        setProduct(res.data)
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

  const discountedPrice = product ? product.price - (product.price * product.discount_percentage / 100) : 0
  const available = product?.stock_quantity > 0

  const handleAddToCart = async () => {
    if (!product) return
    setAdding(true)
    setError('')
    try {
      await cartAPI.addItem(product.id, quantity)
      navigate('/cart')
    } catch (err) {
      setError(err.response?.status === 401 ? 'Please login to add this item.' : 'Failed to add product to cart.')
    } finally {
      setAdding(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return
    setAdding(true)
    setError('')
    try {
      await cartAPI.addItem(product.id, quantity)
      navigate('/checkout')
    } catch (err) {
      setError(err.response?.status === 401 ? 'Please login to continue.' : 'Unable to start checkout right now.')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return <div className="text-center py-24 text-xl text-slate-600">Loading product details…</div>
  }

  if (!product) {
    return <div className="text-center py-24 text-xl text-slate-600">Product not found.</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] bg-white p-8 shadow-xl sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-4">
          <Link to="/shop" className="text-sm font-semibold text-green-600 hover:text-green-700">← Back to shop</Link>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">{product.category_name || 'Grocery'}</p>
            <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-slate-900">{product.product_name}</h1>
          </div>
          <p className="max-w-2xl text-base leading-8 text-slate-600">Fresh quality from {product.brand || 'our suppliers'}, ready for fast delivery and easy checkout.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${available ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{available ? 'In stock' : 'Out of stock'}</span>
          {product.discount_percentage > 0 && <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">-{product.discount_percentage}%</span>}
          <span className="inline-flex items-center rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">{product.stock_quantity} available</span>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-50 to-white p-8 shadow-xl">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[1.75rem] bg-white p-8 shadow-inner">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-green-50 text-6xl">{getProductIcon(product.product_name)}</div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Brand</p>
                      <p className="mt-2 text-xl font-semibold text-slate-900">{product.brand || 'Generic'}</p>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 px-5 py-4 text-slate-700 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">You save</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">৳{((product.price - discountedPrice) * quantity).toFixed(0)}</p>
                  </div>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Category</p>
                    <p className="mt-3 text-base font-semibold text-slate-900">{product.category_name || 'Uncategorized'}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Stock</p>
                    <p className="mt-3 text-base font-semibold text-slate-900">{product.stock_quantity}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] bg-slate-900 p-8 text-white shadow-xl">
                <div className="space-y-5">
                  <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Price</p>
                    <div className="mt-3 flex items-end gap-4">
                      <span className="text-5xl font-bold">৳{discountedPrice.toFixed(0)}</span>
                      {product.discount_percentage > 0 && <span className="text-sm text-slate-300 line-through">৳{product.price.toFixed(0)}</span>}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] bg-white/10 p-5">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <p>Quantity</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                          className="h-10 w-10 rounded-2xl border border-slate-700 bg-slate-800 text-xl text-white transition hover:bg-slate-700"
                        >−</button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                          className="w-20 rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-center text-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity((qty) => Math.min(product.stock_quantity, qty + 1))}
                          className="h-10 w-10 rounded-2xl border border-slate-700 bg-slate-800 text-xl text-white transition hover:bg-slate-700"
                        >+</button>
                      </div>
                    </div>
                    <div className="mt-4 rounded-3xl bg-slate-800 p-4 text-slate-200">
                      <p className="text-sm">Total</p>
                      <p className="mt-2 text-3xl font-bold">৳{(discountedPrice * quantity).toFixed(0)}</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <button
                      className="rounded-full bg-emerald-500 px-6 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-lg transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={handleAddToCart}
                      disabled={adding || !available}
                    >
                      {adding ? 'Adding…' : 'Add to cart'}
                    </button>
                    <button
                      className="rounded-full border border-slate-700 bg-slate-800 px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={handleBuyNow}
                      disabled={adding || !available}
                    >
                      {adding ? 'Processing…' : 'Buy now'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Details</p>
                <h2 className="mt-4 text-2xl font-semibold text-slate-900">What makes this item great</h2>
              </div>
              <div className="rounded-3xl bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">Fast local delivery</div>
            </div>
            <p className="mt-6 text-slate-600 whitespace-pre-line">{product.description || 'No description available yet.'}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Category</p>
                <p className="mt-3 font-semibold text-slate-900">{product.category_name || 'Uncategorized'}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Stock</p>
                <p className="mt-3 font-semibold text-slate-900">{product.stock_quantity}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Delivery</p>
                <p className="mt-3 font-semibold text-slate-900">Free pickup & same-day dispatch</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Returns</p>
                <p className="mt-3 font-semibold text-slate-900">Easy 7-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-white p-8 shadow-lg">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Quick actions</p>
            <div className="mt-6 space-y-3">
              <Link to="/cart" className="block rounded-2xl bg-slate-50 px-5 py-4 text-slate-900 transition hover:bg-slate-100">View cart & continue checkout</Link>
              <button
                type="button"
                className="w-full rounded-2xl bg-green-600 px-5 py-4 text-white font-semibold transition hover:bg-green-700"
                onClick={() => navigate('/account')}
              >
                Manage account
              </button>
              <button
                type="button"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 font-semibold transition hover:border-slate-300"
                onClick={() => navigate('/shop')}
              >
                Continue shopping
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-emerald-50 p-8 text-emerald-900 shadow-lg">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Need help?</p>
            <p className="mt-4 text-lg font-semibold">Contact our support team for order advice, gift bundles, or faster delivery.</p>
          </div>
        </aside>
      </div>
      {error && <div className="mt-10 rounded-3xl bg-red-50 p-6 text-red-700 shadow">{error}</div>}
    </div>
  )
}
