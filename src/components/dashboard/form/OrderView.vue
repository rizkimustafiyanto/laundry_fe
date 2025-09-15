<template>
  <BaseModal
    v-model="modelValue"
    :title="isPaymentMode ? 'Pembayaran Transaksi' : 'Detail Transaksi'"
    size="md"
  >
    <BaseLoadingSpinner v-if="isPrepare" :type="'mini'" />
    <BaseCard v-else class="p-6 font-mono text-sm shadow-md" :class="themeClass.baseDiv.dark">
      <div class="text-center mb-4">
        <h2 class="text-lg font-bold">{{ appName }}</h2>
        <p :class="themeClass.text.secondary">
          {{ isPaymentMode ? 'Konfirmasi & Lakukan Pembayaran' : 'Rincian Transaksi' }}
        </p>
      </div>

      <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />

      <section class="space-y-1">
        <h3 class="font-semibold">👤 Pelanggan</h3>
        <p>Nama: {{ form.customer?.name }}</p>
        <p>Email: {{ form.customer?.email }}</p>
      </section>

      <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />

      <section>
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
      </section>

      <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />

      <section class="space-y-1">
        <h3 class="font-semibold">💳 Rincian Pembayaran</h3>

        <div class="flex justify-between" v-for="(val, key) in invoiceDetails" :key="key">
          <span>{{ val.label }}</span>
          <span :class="val.isDiscount ? 'text-red-500' : ''">
            {{ val.isDiscount ? '-' : '' }}{{ formatCurrency(val.value) }}
          </span>
        </div>

        <div class="border-t border-dashed mt-2 pt-2 flex justify-between font-bold text-lg">
          <span>Total Harus Dibayar</span>
          <span>{{ formatCurrency(form.invoice?.grandTotal) }}</span>
        </div>
      </section>

      <section v-if="!isPaidCompleted && mode !== 'view'" class="mt-4 space-y-3">
        <h3 class="font-semibold">🧾 Input Pembayaran</h3>

        <BaseSelect
          v-model="paymentStore.formPayload.paymentMethod"
          label="Metode Pembayaran"
          :options="paymentOptions"
          placeholder="-- Pilih Pembayaran --"
        />

        <BaseButton class="w-full" @click="submitPayment">Konfirmasi Bayar</BaseButton>
      </section>

      <section
        v-if="isPaidCompleted"
        class="mt-6 border-t border-dashed pt-4 text-center space-y-2"
      >
        <h3 class="font-bold text-green-600">✅ TRANSAKSI SELESAI</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          Terima kasih telah menggunakan layanan {{ appName }} 🙏
        </p>
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Status: <span class="font-semibold">PAID</span><br />
          Tanggal: {{ form.payment.paidAt ? formatDate(form.payment.paidAt) : 'No Paid' }}
        </div>
      </section>

      <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />

      <div class="text-center text-xs text-gray-500 dark:text-gray-400">
        {{
          isPaymentMode && !isPaidCompleted
            ? 'Mohon pastikan rincian benar sebelum melanjutkan pembayaran 🙏'
            : 'Detail transaksi untuk pengecekan 🙏'
        }}
      </div>
    </BaseCard>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  orderId: { type: String, required: true },
  mode: { type: String, default: 'view' },
})

const modelValue = defineModel()
const transactionStore = useTransactionStore()
const paymentStore = usePaymentStore()
const themeClass = useThemeClass()
const paymentMethodStore = usePaymentMethodStore()
const storeCompany = useCompanyProfileStore()

const isPrepare = ref(true)

const appName = computed(() => storeCompany.items[0]?.name || 'Laundry App')

const form = reactive({
  customer: null,
  items: [],
  invoice: null,
  status: null,
  payment: [],
})

const isPaymentMode = computed(() => props.mode === 'payment')
const paymentOptions = computed(() => paymentMethodStore.options)

const invoiceDetails = computed(() => [
  { label: 'Subtotal', value: form.invoice?.subtotal },
  { label: 'Service Fee', value: form.invoice?.serviceCharge },
  { label: 'Pickup Fee', value: form.invoice?.pickupFee },
  { label: 'Delivery Fee', value: form.invoice?.deliveryFee },
  { label: 'Tax', value: form.invoice?.tax },
  { label: 'Discount', value: form.invoice?.discount, isDiscount: true },
])

const isPaidCompleted = computed(() => form.payment && form.payment.status === 'PAID')

const loadOrder = async () => {
  try {
    isPrepare.value = true
    if (!props.orderId) return
    await paymentMethodStore.fetch()
    await transactionStore.fetchTransactionById(props.orderId)
    const order = transactionStore.item
    form.customer = order.customer
    form.items = order.items
    form.invoice = order.invoice
    form.status = order.status
    form.payment = order.payment
  } finally {
    isPrepare.value = false
  }
}

const submitPayment = async () => {
  paymentStore.formPayload.amountPaid = form.invoice?.grandTotal
  await paymentStore.addPayment(props.orderId, paymentStore.formPayload)
  modelValue.value = false
}

onMounted(() => {
  loadOrder()
  paymentStore.resetForm()
})
</script>
