import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5002',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to add token
axiosInstance.interceptors.request.use(
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

export default axiosInstance;