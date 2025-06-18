import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    if (!config.url?.startsWith('/auth')) {
      const token = localStorage.getItem('jwtToken');
      if (token && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const { response, config } = error;
    if (!response) {
      console.error('Network error:', error);
      toast.error('Network error - please check your connection.');
      return Promise.reject(error);
    }

    const { status, data } = response;

    if (status === 403 && config.url?.endsWith('/user/profile')) {
      return Promise.reject(error);
    }
    toast.error(data.message || `Error: ${status}`);

    return Promise.reject(error);
  },
);

export default api;
