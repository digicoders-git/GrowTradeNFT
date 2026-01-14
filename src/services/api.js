import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  getTeam: () => api.get('/user/team'),
  getTransactions: () => api.get('/user/transactions'),
  getDashboard: () => api.get('/user/dashboard'),
};

// Wallet API
export const walletAPI = {
  activate: (paymentData) => api.post('/wallet/activate', paymentData),
  withdraw: (withdrawData) => api.post('/wallet/withdraw', withdrawData),
  getBalance: () => api.get('/wallet/balance'),
};

export default api;