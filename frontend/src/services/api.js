import axios from 'axios';

// Backend Base URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Automatically attach JWT Token from LocalStorage to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Automatically clear storage on 401 (Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid
      localStorage.removeItem('ems_token');
      localStorage.removeItem('ems_user');
    }
    return Promise.reject(error);
  }
);

export default API;
