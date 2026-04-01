import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-2xl font-bold text-white">CTGGrocery</p>
          <p className="mt-2 max-w-md text-sm text-slate-400">A fresh grocery marketplace with seamless shopping, cart, and checkout experience.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/shop" className="text-sm font-semibold text-slate-300 hover:text-white">Shop</Link>
          <Link to="/account" className="text-sm font-semibold text-slate-300 hover:text-white">Account</Link>
          <Link to="/cart" className="text-sm font-semibold text-slate-300 hover:text-white">Cart</Link>
        </div>
      </div>
    </footer>
  )
}
