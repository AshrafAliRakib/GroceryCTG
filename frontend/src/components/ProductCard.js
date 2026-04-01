import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAddToCart }) {
  const discountedPrice = product.price - (product.price * product.discount_percentage / 100)

  const productEmoji = product.product_name.includes('Meat') || product.product_name.includes('Fish') || product.product_name.includes('Chicken') ? '🍗' :
    product.product_name.includes('Fruit') || product.product_name.includes('Banana') || product.product_name.includes('Apple') || product.product_name.includes('Orange') || product.product_name.includes('Mango') ? '🍎' :
    product.product_name.includes('Vegetable') || product.product_name.includes('Tomato') || product.product_name.includes('Carrot') || product.product_name.includes('Onion') ? '🥬' :
    product.product_name.includes('Dairy') || product.product_name.includes('Milk') || product.product_name.includes('Cheese') || product.product_name.includes('Butter') ? '🥛' :
    product.product_name.includes('Beverage') || product.product_name.includes('Juice') || product.product_name.includes('Tea') || product.product_name.includes('Coffee') ? '☕' :
    product.product_name.includes('Snack') || product.product_name.includes('Chips') || product.product_name.includes('Cookie') ? '🍪' :
    '🛒'

  return (
    <div className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-green-100 to-green-50">
        {product.product_image ? (
          <img src={product.product_image} alt={product.product_name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-7xl">{productEmoji}</div>
        )}
        {product.discount_percentage > 0 && (
          <div className="absolute right-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">-{product.discount_percentage}%</div>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{product.category_name || 'Grocery'}</div>
        <h3 className="mb-3 text-lg font-bold text-slate-900 line-clamp-2">{product.product_name}</h3>
        <p className="mb-4 text-sm text-slate-500">Stock: {product.stock_quantity}</p>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            {product.discount_percentage > 0 && <p className="text-sm text-slate-400 line-through">৳{product.price}</p>}
            <p className="text-2xl font-bold text-green-600">৳{discountedPrice.toFixed(0)}</p>
          </div>
          <Link to={`/product/${product.id}`} className="text-sm font-semibold text-green-700 hover:text-green-900">Details →</Link>
        </div>
        <button onClick={onAddToCart} className="flex w-full items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700">
          <span>🛒</span>
          Add to Cart
        </button>
      </div>
    </div>
  )
}
