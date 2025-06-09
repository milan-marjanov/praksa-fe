import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API,
  headers: { 'Content-Type': 'application/json' },
})

export default api