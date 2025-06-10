import axios from 'axios';
import { toast } from 'react-toastify';


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    console.error('Request error:', err);
    return Promise.reject(err);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (!response) {
      console.error('Network error:', error);
      toast.error('Network error - please check your connection.');
      return Promise.reject(error);
    }

    const { status, data } = response;
    switch (status) {
      case 400:
        toast.error(data.message || 'Bad request.');
        break;
      case 401:
        toast.warn('Session expired. Redirecting to login...');
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('You do not have permission to perform that action.');
        break;
      case 404:
        toast.info('Requested resource not found.');
        break;
      case 500:
        toast.error('Server error – please try again later.');
        break;
      default:
        toast.error(data.message || `Error: ${status}`);
    }

    return Promise.reject({
      status,
      message: data.message || response.statusText,
      original: error,
    });
  },
);

export default api;