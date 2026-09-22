import axios from 'axios';

const api = axios.create({
  baseURL: 'https://ssm-mu.vercel.app/api', // Your Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;