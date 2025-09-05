import { useUIStore } from '@/stores/utils/ui'

export function notifySuccess(message) {
  useUIStore().show('success', message)
}

export function notifyError(error, fallback = 'Terjadi kesalahan') {
  const message = error.response?.data?.message || fallback
  useUIStore().show('error', message)
}
