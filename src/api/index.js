// src/api/axiosInstance.ts
import axios from 'axios'
const baseURL = process.env.VUE_APP_API_URL || 'http://localhost:9001/api/v1'; // Fallback to default URL if not set
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
})

// You can add interceptors here if needed
axiosInstance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('token')
    // console.log(accessToken)
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default axiosInstance
