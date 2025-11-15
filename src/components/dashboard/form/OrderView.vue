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
          v-if="!form.items || form.items.length === 0"
          class="text-sm italic border border-dashed rounded-lg p-3 text-center"
          :class="themeClass.text.secondary"
        >
          Belum ada item laundry ditambahkan
          <br />
          Silakan tunggu untuk diproses oleh admin.
        </div>
        <div
          v-else
          v-for="(item, index) in form.items"
          :key="index"
          class="py-2 border-b border-dashed last:border-0"
          :class="themeClass.text.secondary"
        >
          <div class="flex justify-between">
            <span>{{ item.itemType?.name }} - {{ item.serviceType?.name }}</span>
            <span>{{ formatCurrency(item.subtotal) }}</span>
          </div>
          <div class="text-xs">
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

        <div class="border-t border-dashed mt-2 pt-2 flex justify-between font-bold text-md">
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
          required
        />

        <div
          v-if="paymentStore.formPayload.paymentMethod === 'QRIS' && qrisChar"
          class="mt-3 text-center"
        >
          <p class="text-sm mb-2" :class="themeClass.text.secondary">
            Scan QRIS untuk melakukan pembayaran
          </p>
          <img
            :src="`${__BASE_URL__}${qrisChar}`"
            alt="QRIS Payment"
            class="mx-auto w-56 h-56 object-contain border rounded-xl shadow-md"
          />
        </div>

        <BaseButton class="w-full" @click="submitPayment"> Konfirmasi Bayar </BaseButton>
      </section>

      <section
        v-if="form.payment && form.payment.status"
        class="mt-6 border-t border-dashed pt-4 text-center space-y-2"
      >
        <template v-if="form.payment.status === 'PENDING'">
          <h3 class="font-bold text-yellow-500">⏳ PEMBAYARAN MENUNGGU KONFIRMASI</h3>
          <p class="text-sm" :class="themeClass.text.secondary">
            Pembayaran telah dilakukan dan menunggu konfirmasi admin.
          </p>
          <div class="text-xs" :class="themeClass.text.secondary">
            Status: <span class="font-semibold">PENDING</span><br />
            Dibayarkan pada: {{ formatDate(form.payment.createdAt, 'dd MMM yyyy, HH:mm') }}
          </div>
        </template>

        <template v-else-if="form.payment.status === 'PAID'">
          <h3 class="font-bold text-green-600">✅ PEMBAYARAN TERKONFIRMASI</h3>
          <p class="text-sm" :class="themeClass.text.secondary">
            Terima kasih telah menggunakan layanan {{ appName }} 🙏
          </p>
          <div class="text-xs" :class="themeClass.text.secondary">
            Status: <span class="font-semibold">PAID</span><br />
            Dikonfirmasi pada: {{ formatDate(form.payment.paidAt, 'dd MMM yyyy, HH:mm') }}
          </div>
        </template>

        <template v-else-if="form.payment.status === 'FAILED'">
          <h3 class="font-bold text-red-600">❌ PEMBAYARAN GAGAL</h3>
          <p class="text-sm" :class="themeClass.text.secondary">
            Silakan coba ulang proses pembayaran.
          </p>
          <div class="text-xs" :class="themeClass.text.secondary">
            Status: <span class="font-semibold">FAILED</span><br />
            Waktu: {{ formatDate(form.payment.createdAt) }}
          </div>
        </template>
      </section>

      <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />

      <div class="text-center text-xs" :class="themeClass.text.secondary">
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
const qrisChar = computed(() => storeCompany.items[0]?.qrisImageUrl || null)

const form = reactive({
  customer: null,
  items: [],
  invoice: null,
  status: null,
  payment: null,
})

const isPaymentMode = computed(() => props.mode === 'payment')

const paymentOptions = computed(() => {
  return paymentMethodStore.options.map((opt) => {
    if (opt.value === 'QRIS' && !qrisChar.value) {
      return {
        ...opt,
        disabled: true,
        label: `${opt.label} (Belum diatur oleh admin)`,
      }
    }
    return opt
  })
})

const invoiceDetails = computed(() => [
  { label: 'Subtotal', value: form.invoice?.subtotal },
  { label: 'Service Fee', value: form.invoice?.serviceCharge },
  { label: 'Pickup Fee', value: form.invoice?.pickupFee },
  { label: 'Delivery Fee', value: form.invoice?.deliveryFee },
  { label: 'Tax', value: form.invoice?.tax },
  { label: 'Discount', value: form.invoice?.discount, isDiscount: !!form.invoice?.discount },
])

const isPaidCompleted = computed(() => form.payment && form.payment.status === 'PAID')

const canProceed = computed(() => {
  const hasItems = form.items && form.items.length > 0
  const isStatusAllowed = form.status !== 'REGISTERED' && form.status !== 'CANCELLED'
  return hasItems && isStatusAllowed
})

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
  if (!canProceed.value) {
    notifyError('', 'Item laundry masih kosong atau transaksi belum diproses!')
    return
  }
  if (!paymentStore.formPayload.paymentMethod) {
    notifyError('', 'Silakan pilih metode pembayaran terlebih dahulu!')
    return
  }

  if (paymentStore.formPayload.paymentMethod === 'QRIS' && !qrisChar.value) {
    notifyError('', 'QRIS belum diatur oleh admin di menu Setting!')
    return
  }

  paymentStore.formPayload.amountPaid = form.invoice?.grandTotal
  await paymentStore.addPayment(props.orderId, paymentStore.formPayload)
  modelValue.value = false
}

onMounted(() => {
  loadOrder()
  paymentStore.resetForm()
})
</script>
