// src/utils/api.js
import axios from 'axios'
import { useLoadingStore } from '@/stores/utils/loading'

const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const apiForm = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

const requestInterceptor = (config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`

  const loadingStore = useLoadingStore()
  loadingStore.startMini()

  return config
}

const requestErrorInterceptor = (error) => {
  const loadingStore = useLoadingStore()
  loadingStore.stopMini()
  return Promise.reject(error)
}

const responseInterceptor = (response) => {
  const loadingStore = useLoadingStore()
  loadingStore.stopMini()
  return response
}

const responseErrorInterceptor = (error) => {
  const loadingStore = useLoadingStore()
  loadingStore.stopMini()
  console.log(error.response?.data)
  if (error.response?.data?.message === 'Session is not valid' || error.response?.data?.success === false && error.response?.data?.message?.includes('Session')) {
    const authStore = useAuthStore()
    authStore.logout()
  }
  return Promise.reject(error)
}

;[api, apiForm].forEach((instance) => {
  instance.interceptors.request.use(requestInterceptor, requestErrorInterceptor)
  instance.interceptors.response.use(responseInterceptor, responseErrorInterceptor)
})

export { api, apiForm }
export default api
