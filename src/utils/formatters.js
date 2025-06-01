// src/utils/formatters.js

/**
 * Format angka jadi currency Rupiah (IDR) dengan prefix "Rp " dan ribuan pakai titik
 * Contoh: 1500000 -> "Rp 1.500.000"
 * Jika value null/undefined/NaN, kembalikan "Rp 0"
 */
export function formatCurrency(value) {
  if (typeof value !== 'number' || isNaN(value)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

/**
 * Format tanggal ke string dalam format "dd MMMM yyyy" dengan bahasa Indonesia
 * Contoh: 2025-05-29 -> "29 Mei 2025"
 * @param {string|Date} dateInput - Tanggal atau string tanggal yang valid
 */
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export function formatDate(dateInput) {
  if (!dateInput) return '-'
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    return format(date, 'dd MMMM yyyy', { locale: idLocale })
  } catch {
    return '-'
  }
}

/**
 * Format waktu (jam dan menit) dalam format 24 jam, contoh "14:30"
 * @param {string|Date} dateInput
 */
export function formatTime(dateInput) {
  if (!dateInput) return '-'
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    return format(date, 'HH:mm', { locale: idLocale })
  } catch {
    return '-'
  }
}

/**
 * Format nomor telepon ke format Indonesia yang lebih mudah dibaca
 * Contoh: "08123456789" -> "0812-3456-789"
 * Catatan: fungsi ini sangat sederhana dan hanya contoh dasar
 * @param {string} phone
 */
export function formatPhone(phone) {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length <= 4) return cleaned
  if (cleaned.length <= 7) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
  if (cleaned.length <= 10)
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  return phone // fallback: tampilkan apa adanya
}

/**
 * Format persen dari angka decimal ke string persen
 * Contoh: 0.25 -> "25%"
 * @param {number} value
 */
export function formatPercent(value) {
  if (typeof value !== 'number' || isNaN(value)) return '0%'
  return `${Math.round(value * 100)}%`
}

/**
 * Format alamat lengkap dari objek alamat
 *
 * Contoh input:
 * {
 *   jalan: "Jl. Merdeka No.10",
 *   kelurahan: "Kelurahan Sukamaju",
 *   kecamatan: "Kecamatan Tebet",
 *   kota: "Jakarta Selatan",
 *   provinsi: "DKI Jakarta"
 * }
 *
 * Output:
 * "Jl. Merdeka No.10, Kelurahan Sukamaju, Kecamatan Tebet, Jakarta Selatan, DKI Jakarta"
 *
 * @param {object} alamatObj - objek alamat dengan properti jalan, kelurahan, kecamatan, kota, provinsi
 * @returns {string} alamat lengkap yang terformat
 */
export function formatAddress(alamatObj) {
  if (!alamatObj || typeof alamatObj !== 'object') return ''
  const parts = [
    alamatObj.jalan,
    alamatObj.kelurahan,
    alamatObj.kecamatan,
    alamatObj.kota,
    alamatObj.provinsi,
  ].filter(Boolean) // hilangkan yang undefined/null/empty
  return parts.join(', ')
}
