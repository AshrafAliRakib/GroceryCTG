import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const productAPI = {
  getProducts: (page = 1, category = null, search = null) => {
    let url = '/products/?page=' + page
    if (category) url += '&category__id=' + category
    if (search) url += '&search=' + search
    return api.get(url)
  },
  getProduct: (id) => api.get(`/products/${id}/`),
  getCategories: () => api.get('/products/categories/'),
  createProduct: (data) => api.post('/products/', data),
  updateProduct: (id, data) => api.patch(`/products/${id}/`, data),
  deleteProduct: (id) => api.delete(`/products/${id}/`),
}

export const authAPI = {
  register: (data) => api.post('/accounts/register/', data),
  getToken: (data) => api.post('/accounts/token/', data),
  getProfile: () => api.get('/accounts/profile/'),
  sendOTP: (data) => api.post('/accounts/send-otp/', data),
  verifyOTP: (data) => api.post('/accounts/verify-otp/', data),
  checkOTPStatus: (data) => api.post('/accounts/check-otp/', data),
}

export const cartAPI = {
  getCart: () => api.get('/carts/'),
  addItem: (product_id, quantity) => api.post('/carts/add/', { product_id, quantity }),
  updateItem: (item_id, quantity) => api.patch(`/carts/item/${item_id}/update/`, { quantity }),
  removeItem: (item_id) => api.delete(`/carts/item/${item_id}/remove/`),
}

export const couponAPI = {
  apply: (code, total) => api.post(`/coupons/apply/${code}/`, { total }),
}

export const orderAPI = {
  create: (order_total, payment_method, items, coupon_code = '') => api.post('/orders/create/', { order_total, payment_method, items, coupon_code }),
  getOrders: () => api.get('/orders/'),
  getOrder: (order_id) => api.get(`/orders/${order_id}/`),
  updateStatus: (order_id, status) => api.patch(`/orders/${order_id}/status/`, { order_status: status }),
}

export default api
