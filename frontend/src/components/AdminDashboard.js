import React, { useState, useEffect } from 'react'
import { orderAPI, productAPI } from '../api'

export default function AdminDashboard({ user, onLogout, onBack }) {
  const [activeTab, setActiveTab] = useState('orders') // orders, products, analytics
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    loadDashboardData()
  }, [activeTab])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'orders') {
        const res = await orderAPI.getOrders()
        setOrders(res.data.results || [])
      } else if (activeTab === 'products') {
        const res = await productAPI.getProducts()
        setProducts(res.data.results || [])
      } else if (activeTab === 'analytics') {
        // Mock analytics data
        setStats({
          totalOrders: 42,
          totalRevenue: 12500,
          avgOrderValue: 298,
          totalProducts: 164,
          totalCustomers: 15,
          topProduct: 'Basmati Rice 5kg'
        })
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">👨‍💼 Admin Dashboard</h1>
            <p className="text-purple-100">Welcome back, {user?.username}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              ← Back to Shop
            </button>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-2 font-semibold border-b-4 transition ${
              activeTab === 'orders'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            📦 Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-4 px-2 font-semibold border-b-4 transition ${
              activeTab === 'products'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            🛍️ Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-2 font-semibold border-b-4 transition ${
              activeTab === 'analytics'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            📊 Analytics
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h2>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">#{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.user?.username || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">৳{order.order_total || 0}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.order_status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600 text-center py-12">No orders yet</p>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Product Inventory</h2>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(0, 9).map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow p-6">
                    <div className="text-3xl mb-2">
                      {product.product_name.includes('Meat') || product.product_name.includes('Fish') ? '🍗' :
                       product.product_name.includes('Fruit') || product.product_name.includes('Apple') ? '🍎' :
                       product.product_name.includes('Vegetable') || product.product_name.includes('Tomato') ? '🥬' :
                       product.product_name.includes('Dairy') || product.product_name.includes('Milk') ? '🥛' :
                       '🛒'}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{product.product_name}</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <p><span className="font-semibold">Price:</span> ৳{product.price}</p>
                      <p><span className="font-semibold">Stock:</span> {product.stock_quantity} units</p>
                      <p><span className="font-semibold">Category:</span> {product.category_name || 'N/A'}</p>
                      {product.discount_percentage > 0 && (
                        <p className="text-orange-600 font-semibold">{product.discount_percentage}% OFF</p>
                      )}
                    </div>
                    {product.stock_quantity < 20 && (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-3 py-2 rounded">
                        ⚠️ Low stock
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-12">No products</p>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-4xl font-bold text-gray-800">{stats.totalOrders}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-2">💰</div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-4xl font-bold text-gray-800">৳{stats.totalRevenue?.toLocaleString()}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-gray-600 text-sm">Avg Order Value</p>
                <p className="text-4xl font-bold text-gray-800">৳{stats.avgOrderValue}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-2">🛍️</div>
                <p className="text-gray-600 text-sm">Total Products</p>
                <p className="text-4xl font-bold text-gray-800">{stats.totalProducts}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-gray-600 text-sm">Total Customers</p>
                <p className="text-4xl font-bold text-gray-800">{stats.totalCustomers}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl mb-2">⭐</div>
                <p className="text-gray-600 text-sm">Top Product</p>
                <p className="text-lg font-bold text-gray-800">{stats.topProduct}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
