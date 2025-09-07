<template>
  <BaseModal v-model="modelValue" title="Detail Transaksi" size="md">
    <BaseCard class="p-6 font-mono text-sm shadow-md" :class="themeClass.baseDiv.dark">
      <!-- Header -->
      <div class="text-center mb-4">
        <h2 class="text-lg font-bold">Laundry Express</h2>
        <p class="text-gray-500 dark:text-gray-400">Konfirmasi Sebelum Pembayaran</p>
      </div>

      <hr class="border-dashed border-gray-300 dark:border-gray-700 mb-4" />

      <!-- Customer Info -->
      <div class="space-y-1">
        <h3 class="font-semibold">👤 Pelanggan</h3>
        <p>Nama: {{ form.customer?.name }}</p>
        <p>Email: {{ form.customer?.email }}</p>
      </div>

      <hr class="my-3 border-dashed border-gray-300 dark:border-gray-700" />

      <!-- Items -->
      <div>
        <h3 class="font-semibold mb-2">🧺 Item Laundry</h3>
        <div
          v-for="(item, index) in form.items"
          :key="index"
          class="py-2 border-b border-dashed last:border-0"
        >
          <div class="flex justify-between">
            <span>{{ item.itemType?.name }} - {{ item.serviceType?.name }}</span>
            <span>{{ formatCurrency(item.subtotal) }}</span>
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Berat: {{ item.weightInKg }} kg × {{ formatCurrency(item.unitPrice) }}
          </div>
        </div>
      </div>

      <hr class="my-3 border-dashed border-gray-300 dark:border-gray-700" />

      <!-- Invoice Details -->
      <div class="space-y-1">
        <h3 class="font-semibold">💳 Rincian Pembayaran</h3>

        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>{{ formatCurrency(form.invoice?.subtotal) }}</span>
        </div>

        <div class="flex justify-between">
          <span>Service Fee</span>
          <span>{{ formatCurrency(form.invoice?.serviceCharge) }}</span>
        </div>

        <div class="flex justify-between">
          <span>Pickup Fee</span>
          <span>{{ formatCurrency(form.invoice?.pickupFee) }}</span>
        </div>

        <div class="flex justify-between">
          <span>Delivery Fee</span>
          <span>{{ formatCurrency(form.invoice?.deliveryFee) }}</span>
        </div>

        <div class="flex justify-between">
          <span>Tax</span>
          <span>{{ formatCurrency(form.invoice?.tax) }}</span>
        </div>

        <div class="flex justify-between">
          <span>Discount</span>
          <span>-{{ formatCurrency(form.invoice?.discount) }}</span>
        </div>

        <!-- Grand Total -->
        <div class="border-t border-dashed mt-2 pt-2 flex justify-between font-bold text-lg">
          <span>Total Harus Dibayar</span>
          <span>{{ formatCurrency(form.invoice?.grandTotal) }}</span>
        </div>
      </div>

      <hr class="my-4 border-dashed border-gray-300 dark:border-gray-700" />

      <!-- Footer -->
      <div class="text-center text-xs text-gray-500 dark:text-gray-400">
        Mohon pastikan rincian benar sebelum melanjutkan pembayaran 🙏
      </div>
    </BaseCard>
  </BaseModal>
</template>

<script setup>
import { reactive, onMounted } from 'vue'

import { formatCurrency } from '@/utils/formatters'
import { useThemeClass } from '@/composables/useThemeClass'

const props = defineProps({
  orderId: { type: String, required: true },
})

const modelValue = defineModel()
const transactionStore = useTransactionStore()
const themeClass = useThemeClass()

const form = reactive({
  customer: null,
  items: [],
  invoice: null, // ganti payment -> invoice
})

const loadOrder = async () => {
  if (!props.orderId) return
  await transactionStore.fetchTransactionById(props.orderId)
  const order = transactionStore.selectedTransaction
  form.customer = order.customer
  form.items = order.items
  form.invoice = order.invoice
}

onMounted(loadOrder)
</script>
