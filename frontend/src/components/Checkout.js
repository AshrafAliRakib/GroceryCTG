import React, { useState } from 'react'
import { cartAPI, couponAPI, orderAPI } from '../api'

export default function Checkout({ onBack, onSuccess }){
  const [cart, setCart] = useState(null)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  React.useEffect(()=>{
    cartAPI.getCart().then(res=>{
      setCart(res.data)
      setLoading(false)
    }).catch(()=>setLoading(false))
  },[])

  const handleApplyCoupon = () => {
    if(!couponCode.trim()) return
    setApplying(true)
    setError('')
    couponAPI.apply(couponCode, cart.total).then(res=>{
      setDiscount(parseFloat(res.data.discount))
      setSuccess('✅ Coupon applied successfully!')
      setApplying(false)
      setTimeout(() => setSuccess(''), 3000)
    }).catch(err=>{
      setError('❌ ' + (err.response?.data?.detail || 'Invalid coupon code'))
      setApplying(false)
    })
  }

  const handleCheckout = () => {
    if(!cart || !cart.items.length) return
    const items = cart.items.map(item=>({ product_id: item.product.id, quantity: item.quantity }))
    orderAPI.create(cart.total - discount, paymentMethod, items, couponCode).then(res=>{
      setSuccess('✅ Order placed successfully!')
      setTimeout(() => {
        alert('Thank you for your order! Order ID: ' + (res.data.order_id || res.data.id))
        localStorage.removeItem('access_token')
        onSuccess()
      }, 1500)
    }).catch(err=>{
      setError('❌ ' + (err.response?.data?.detail || 'Checkout failed'))
    })
  }

  if(loading) return <div className="text-center py-16"><div className="animate-pulse text-xl text-gray-600">Loading checkout...</div></div>
  
  if(!cart || !cart.items.length) return (
    <div className="text-center py-20 bg-gradient-to-b from-gray-50 to-white rounded-lg">
      <p className="text-2xl text-gray-600 mb-8">Cart is empty. No items to checkout.</p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg transition" onClick={onBack}>← Back</button>
    </div>
  )

  const finalTotal = cart.total - discount

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8 text-gray-800">💳 Checkout</h2>
      
      {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-lg mb-6 flex items-start"><span className="text-2xl mr-3">⚠️</span><div>{error}</div></div>}
      {success && <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-r-lg mb-6 flex items-start"><span className="text-2xl mr-3">✅</span><div>{success}</div></div>}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">📦 Order Summary</h3>
            <div className="space-y-4">
              {cart.items.map((item, idx) => (
                <div key={item.id} className={`flex justify-between items-center pb-4 ${idx < cart.items.length - 1 ? 'border-b' : ''}`}>
                  <div>
                    <div className="font-semibold text-gray-800">{item.product.product_name}</div>
                    <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                  </div>
                  <div className="text-lg font-bold text-gray-800">৳{(item.product.price * item.quantity).toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">💰 Payment Method</h3>
            <div className="space-y-3">
              {[
                {value: 'cash_on_delivery', label: '💵 Cash on Delivery', desc: 'Pay when item is delivered'},
                {value: 'bkash', label: '📱 Bkash', desc: 'Mobile payment'},
                {value: 'nagad', label: '📲 Nagad', desc: 'Mobile payment'}
              ].map(method => (
                <label key={method.value} className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-green-50 transition" style={{ borderColor: paymentMethod === method.value ? '#16a34a' : '#e5e7eb' }}>
                  <input type="radio" value={method.value} checked={paymentMethod === method.value} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-green-600" />
                  <div className="ml-4">
                    <div className="font-semibold text-gray-800">{method.label}</div>
                    <div className="text-sm text-gray-500">{method.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Price Summary & Coupon */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-b from-blue-50 to-white border-2 border-blue-200 rounded-lg p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-800 mb-6">💳 Price Summary</h3>
            
            {/* Coupon Section */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <label className="block font-bold text-sm text-gray-800 mb-3">Have a Coupon?</label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="e.g., SAVE10" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:outline-none" 
                  />
                  <button 
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50" 
                    disabled={applying}
                    onClick={handleApplyCoupon}
                  >
                    {applying ? '...' : 'Apply'}
                  </button>
                </div>
                <div className="text-xs text-gray-600">Try: SAVE10, SAVE15, WELCOME20</div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6 pb-6 border-b-2 border-gray-200">
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Subtotal:</span>
                <span>৳{cart.total.toFixed(0)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount:</span>
                  <span>-৳{discount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span className="font-semibold">Shipping:</span>
                <span>Free</span>
              </div>
            </div>

            {/* Total */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Amount:</span>
                <span className="text-3xl font-bold">৳{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button 
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 rounded-lg transition disabled:opacity-50" 
                disabled={loading}
                onClick={handleCheckout}
              >
                {loading ? '⏳ Processing...' : '✓ Place Order'}
              </button>
              <button 
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition" 
                onClick={onBack}
              >
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
