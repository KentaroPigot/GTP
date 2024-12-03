import axios from 'axios'
import { refreshToken } from './auth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config

    console.log(error)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      await refreshToken()
      return apiClient(originalRequest)
    }

    return Promise.reject(error)
  },
)

export default apiClient
