import axios from 'axios';
import store from '../store';
import { logout } from '../store/authSlice';

const API_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and auth failures
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Token expired or invalid
      if (error.response.status === 401) {
        store.dispatch(logout());
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  getProfile: () => 
    api.get('/auth/profile'),

  updateProfile: (userData) =>
    api.put('/auth/profile', userData),
};

// Product API calls
export const productAPI = {
  getProducts: (params = {}) => 
    api.get('/products', { params }),
  
  getProduct: (id) => 
    api.get(`/products/${id}`),
  
  searchProducts: (query) => 
    api.get(`/products/search?q=${encodeURIComponent(query)}`),
};

// Cart API calls
export const cartAPI = {
  getCart: () => 
    api.get('/cart'),
  
  addToCart: (productId, quantity = 1) => 
    api.post('/cart', { productId, quantity }),
  
  updateCartItem: (productId, quantity) => 
    api.put(`/cart/${productId}`, { quantity }),
  
  removeFromCart: (productId) => 
    api.delete(`/cart/${productId}`),
  
  clearCart: () => 
    api.delete('/cart'),
};

export default api;