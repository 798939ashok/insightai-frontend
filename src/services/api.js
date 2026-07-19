import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://insightai-backend-5ajj.onrender.com/',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token to every outgoing request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('insightai_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('insightai_token')
      localStorage.removeItem('insightai_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
