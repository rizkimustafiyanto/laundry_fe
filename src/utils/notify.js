import { useUIStore } from '@/stores/utils/ui'

export function notifySuccess(message) {
  useUIStore().show('success', message)
}

export function notifyError(error, fallback = 'Terjadi kesalahan') {
  const message = error.response?.data?.message || fallback
  useUIStore().show('error', message)
}

export async function notifyConfirm({ title, message, requireReason = false }) {
  const ui = useUIStore()
  return ui.confirm({
    title,
    message,
    requireReason,
  })
}
