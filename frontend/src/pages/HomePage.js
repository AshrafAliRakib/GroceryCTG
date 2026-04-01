import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../api'
import ProductCard from '../components/ProductCard'

export default function HomePage({ onAddToCart }) {
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    productAPI.getCategories().then(res => {
      // Defensive: ensure categories is always an array
      const cats = Array.isArray(res.data) ? res.data : (res.data.results || [])
      setCategories(cats)
    }).catch(() => {})

    productAPI.getProducts(1, null, '').then(res => {
      const prods = res.data.results || res.data
      setFeatured(prods.slice(0, 6))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-green-600 via-emerald-500 to-cyan-500 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:px-12 lg:py-24 relative">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_minmax(360px,1fr)] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white/95 shadow-lg backdrop-blur-sm">
                Fresh groceries for your home
              </div>
              <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight sm:text-6xl">A grocery store built for fast shopping, fresh picks, and easy checkout.</h1>
                <p className="max-w-2xl text-lg text-white/85">Browse seasonal fruits, pantry essentials, dairy, beverages and more with modern product browsing, smart category filters, and a real cart experience.</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link to="/shop" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-bold text-green-700 shadow-xl transition hover:-translate-y-0.5 hover:bg-slate-100">
                  Shop now
                </Link>
                <Link to="/account" className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/20">
                  My account
                </Link>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {[
                { icon: '🚚', title: 'Fast delivery', description: 'Same-day grocery delivery options available locally.' },
                { icon: '🛍️', title: 'Easy browsing', description: 'Shop with category filters and product highlights.' },
                { icon: '🌿', title: 'Fresh ingredients', description: 'Seasonal produce and pantry essentials every day.' },
                { icon: '💳', title: 'Secure checkout', description: 'Smooth cart flow with coupon and payment options.' },
              ].map((item) => (
                <div key={item.title} className="rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl transition hover:-translate-y-1">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 text-3xl">{item.icon}</div>
                  <h2 className="mt-6 text-xl font-semibold text-white">{item.title}</h2>
                  <p className="mt-3 text-sm text-white/80">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-green-600">Browse by category</p>
            <h2 className="text-3xl font-bold text-slate-900">Popular categories</h2>
          </div>
          <Link to="/shop" className="text-green-600 font-semibold hover:text-green-700">View full shop →</Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(Array.isArray(categories) ? categories : []).slice(0, 4).map(category => (
            <Link key={category.id} to={`/shop?category=${category.id}`} className="group rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-50 text-3xl transition group-hover:bg-green-100">🛒</div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">{category.name}</h3>
              <p className="mt-2 text-sm text-slate-500">Shop fresh {category.name.toLowerCase()} items.</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Featured products</p>
            <h2 className="text-3xl font-bold text-slate-900">Top picks for you</h2>
          </div>
          <Link to="/shop" className="text-green-600 font-semibold hover:text-green-700">Discover more →</Link>
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-3xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={() => onAddToCart(product.id)} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="rounded-[40px] border border-slate-200 bg-white p-10 shadow-xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-green-600">How it works</p>
              <h2 className="text-4xl font-bold text-slate-900">Grocery shopping made simple</h2>
              <p className="text-slate-600">Start browsing, add items to your cart, and checkout with confidence using our modern grocery storefront.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: 'Browse', desc: 'Filter categories and search products quickly.', icon: '🔎' },
                { title: 'Cart', desc: 'Review items and update quantities easily.', icon: '🛒' },
                { title: 'Checkout', desc: 'Place orders with secure payment options.', icon: '✅' },
              ].map(item => (
                <div key={item.title} className="rounded-3xl bg-slate-50 p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-green-100 text-2xl">{item.icon}</div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
