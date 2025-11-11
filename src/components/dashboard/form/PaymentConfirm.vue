<template>
  <BaseModal v-model="modelValue" :title="'Konfirmasi Pembayaran Transaksi'" size="md">
    <BaseLoadingSpinner v-if="isPrepare" :type="'mini'" />

    <BaseCard
      v-else
      class="p-6 font-mono text-sm shadow-md space-y-4"
      :class="themeClass.baseDiv.dark"
    >
      <div class="text-center mb-2">
        <h2 class="text-lg font-bold">{{ appName }}</h2>
        <p :class="themeClass.text.secondary">Konfirmasi Pembayaran</p>
      </div>

      <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />

      <!-- Pelanggan -->
      <section class="space-y-1">
        <h3 class="font-semibold">👤 Pelanggan</h3>
        <p>Nama: {{ form.customer?.name }}</p>
        <p>Email: {{ form.customer?.email }}</p>
      </section>

      <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />

      <!-- Total -->
      <section class="space-y-1">
        <h3 class="font-semibold">💳 Total Pembayaran</h3>
        <div class="border-t border-dashed mt-2 pt-2 flex justify-between font-bold text-md">
          <span>Total Yang Dibayar</span>
          <span>{{ formatCurrency(form.invoice?.grandTotal) }}</span>
        </div>
      </section>

      <!-- Status Sekarang -->
      <section v-if="form.payment" class="mt-4">
        <h3 class="font-semibold mb-2">📅 Status Pembayaran Saat Ini</h3>
        <div
          class="p-3 rounded-xl border text-center"
          :class="{
            'bg-yellow-50 border-yellow-400 text-yellow-700': form.payment.status === 'PENDING',
            'bg-green-50 border-green-400 text-green-700': form.payment.status === 'PAID',
            'bg-red-50 border-red-400 text-red-700': form.payment.status === 'FAILED',
          }"
        >
          <p class="font-semibold uppercase tracking-wide">{{ form.payment.status }}</p>
          <p class="text-xs mt-1">
            Dibuat: {{ formatDate(form.payment.createdAt, 'dd MMM yyyy, HH:mm') }}
            <span v-if="form.payment.paidAt"
              >• Dikonfirmasi: {{ formatDate(form.payment.paidAt, 'dd MMM yyyy, HH:mm') }}</span
            >
          </p>
        </div>
      </section>

      <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />

      <!-- Form Konfirmasi Admin -->
      <section class="space-y-3">
        <h3 class="font-semibold">🧾 Konfirmasi Status Pembayaran</h3>

        <!-- Pilihan Status -->
        <BaseRadioButton
          v-model="adminStatus"
          :options="[
            { label: '✅ Berhasil (PAID)', value: 'PAID' },
            { label: '❌ Gagal (FAILED)', value: 'FAILED' },
          ]"
          layout="horizontal"
          variant
        />

        <!-- Catatan -->
        <BaseInput
          v-model="adminNote"
          label="Catatan Admin"
          type="textarea"
          rows="3"
          placeholder="Opsional — misal: bukti transfer valid, atau alasan gagal..."
        />

        <!-- Tombol Konfirmasi -->
        <BaseButton
          :label="
            adminStatus === 'PAID' ? 'Konfirmasi Pembayaran Berhasil' : 'Tandai Sebagai Gagal'
          "
          :variant="adminStatus === 'PAID' ? 'teal' : 'danger'"
          class="w-full mt-2"
          @click.prevent="confirmPayment"
          :disabled="!adminStatus"
        />
      </section>

      <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />

      <div class="text-center text-xs" :class="themeClass.text.secondary">
        Mohon pastikan rincian benar sebelum konfirmasi pembayaran 🙏
      </div>
    </BaseCard>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  orderId: { type: String, required: true },
})

const modelValue = defineModel()
const themeClass = useThemeClass()

const transactionStore = useTransactionStore()
const paymentStore = usePaymentStore()
const paymentMethodStore = usePaymentMethodStore()
const storeCompany = useCompanyProfileStore()

const isPrepare = ref(true)
const adminStatus = ref(null)
const adminNote = ref('')

const appName = computed(() => storeCompany.items[0]?.name || 'Laundry App')

const form = reactive({
  customer: null,
  items: [],
  invoice: null,
  status: null,
  payment: null,
})

const loadOrder = async () => {
  try {
    isPrepare.value = true
    if (!props.orderId) return

    await Promise.all([
      paymentMethodStore.fetch(),
      transactionStore.fetchTransactionById(props.orderId),
    ])

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

const confirmPayment = async () => {
  if (!adminStatus.value) {
    notifyError('', 'Pilih status pembayaran terlebih dahulu!')
    return
  }

  const payload = {
    status: adminStatus.value,
    note: adminNote.value || null,
    paidAt: adminStatus.value === 'PAID' ? new Date() : null,
  }

  await paymentStore.confirmPayment(props.orderId, payload)
  modelValue.value = false
}

onMounted(loadOrder)
</script>
