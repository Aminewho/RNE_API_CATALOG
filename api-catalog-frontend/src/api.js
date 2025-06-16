import axios from 'axios';
import { useLocation } from 'react-router-dom';




const api = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your backend URL
});

// Add a request interceptor to include the Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage or another storage mechanism
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Request interceptor: Token added to headers', config.headers['Authorization']);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;