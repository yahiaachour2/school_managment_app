import axios, { AxiosInstance } from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? ''

// Create an Axios instance with default settings
const axiosInstance: AxiosInstance = axios.create({
  baseURL, // Replace with your API base URL
  timeout: 10000000,
  headers: { 'Content-Type': 'application/json' },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before the request is sent
    // For example, add an Authorization header with a token if it exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {

    // Do something with request error
    if (error?.response?.status === 403 || error?.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with response data
    return response;
  },
  (error) => {

    // Do something with response error
    if (error?.response?.status === 403 || error?.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
