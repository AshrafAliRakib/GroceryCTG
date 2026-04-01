import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cartAPI } from '../api'

function getProductIcon(name) {
  if (!name) return '🛒'
  const lower = name.toLowerCase()
  if (lower.includes('meat') || lower.includes('fish') || lower.includes('chicken')) return '🍗'
  if (lower.includes('fruit') || lower.includes('banana') || lower.includes('apple') || lower.includes('orange') || lower.includes('mango')) return '🍎'
  if (lower.includes('vegetable') || lower.includes('tomato') || lower.includes('carrot') || lower.includes('onion') || lower.includes('pepper')) return '🥬'
  if (lower.includes('dairy') || lower.includes('milk') || lower.includes('cheese') || lower.includes('butter')) return '🥛'
  if (lower.includes('beverage') || lower.includes('juice') || lower.includes('tea') || lower.includes('coffee')) return '☕'
  return '🛒'
}

export default function Cart({ onCheckout, onBack }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cartAPI.getCart().then(res => {
      setCart(res.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleRemoveItem = (item_id) => {
    cartAPI.removeItem(item_id).then(res => {
      setCart(res.data)
    }).catch(console.error)
  }

  const handleUpdateQuantity = (item_id, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(item_id)
      return
    }
    cartAPI.updateItem(item_id, quantity).then(res => {
      setCart(res.data)
    }).catch(console.error)
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-pulse text-xl text-slate-600">🛒 Loading cart...</div>
      </div>
    )
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white p-12 text-center shadow-xl">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-3xl font-bold text-slate-800 mb-3">Your cart is empty</p>
        <p className="max-w-xl mx-auto text-slate-500 mb-8">Add fresh groceries and pantry essentials to see them here.</p>
        <button className="inline-flex items-center gap-2 rounded-full bg-green-600 px-8 py-3 text-white font-semibold transition hover:bg-green-700" onClick={onBack}>🛍️ Continue Shopping</button>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      <div className="rounded-[2rem] bg-gradient-to-r from-emerald-600 to-green-700 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-200">Shopping Cart</p>
            <h1 className="mt-4 text-4xl font-bold">Review your groceries</h1>
            <p className="mt-3 max-w-2xl text-sm text-emerald-100">Update quantities, remove items, and checkout with fast delivery.</p>
          </div>
          <div className="rounded-3xl bg-white/10 px-5 py-4 text-sm font-semibold text-white shadow-sm">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} · Total ৳{cart.total || 0}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.9fr_1fr]">
        <div className="space-y-6">
          {cart.items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-[2rem] bg-white shadow-lg">
              <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.5fr_0.8fr]">
                <div className="flex items-start gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-4xl">
                    {getProductIcon(item.product?.product_name)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">{item.product?.product_name || 'Product'}</h2>
                    <p className="mt-1 text-sm text-slate-500">{item.product?.brand || 'Brand unavailable'}</p>
                    <p className="mt-3 text-sm text-slate-500">{item.product?.category_name || 'Category unknown'}</p>
                    {item.product?.id && (
                      <Link to={`/product/${item.product.id}`} className="mt-3 inline-block text-sm font-semibold text-green-600 hover:text-green-700">View details</Link>
                    )}
                  </div>
                </div>

                <div className="space-y-4 rounded-[1.5rem] bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Unit price</span>
                    <span className="font-semibold text-slate-900">৳{item.product?.price || 0}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-slate-200 bg-white px-2 py-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="h-9 w-9 rounded-full text-lg text-slate-700 transition hover:bg-slate-100"
                      >
                        −
                      </button>
                      <span className="mx-3 min-w-[2rem] text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-9 w-9 rounded-full text-lg text-slate-700 transition hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">৳{((item.product?.price || 0) * item.quantity).toFixed(0)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(item.id, 0)}
                    className="w-full rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-100"
                  >
                    Remove item
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] bg-white p-6 shadow-xl sticky top-8">
            <h3 className="text-2xl font-bold text-slate-900">Order Summary</h3>
            <div className="mt-6 space-y-4 text-slate-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">৳{cart.total || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4 text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>৳{cart.total || 0}</span>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              <button className="w-full rounded-3xl bg-emerald-600 px-5 py-4 text-white text-base font-semibold transition hover:bg-emerald-500" onClick={onCheckout}>Proceed to Checkout</button>
              <button className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-slate-900 text-base font-semibold transition hover:bg-slate-50" onClick={onBack}>Continue Shopping</button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-emerald-50 p-6 text-emerald-900 shadow-lg">
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-700">Need assistance?</p>
            <p className="mt-4 text-base leading-7">Message our support team if you want help finding recipes, bulk savings, or faster delivery.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
