// src/api/axiosInstance.ts
import axios from 'axios'
const baseURL = process.env.VUE_APP_API_URL || 'http://10.0.63.205:9001/api/v1';
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
})

axiosInstance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('token')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token')
      window.location.href = '/logout'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
