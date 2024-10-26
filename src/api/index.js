// src/api/axiosInstance.ts
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:9001/api/v1', // Set your API base URL here
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
