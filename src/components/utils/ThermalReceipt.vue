<template>
  <div
    ref="receiptRef"
    class="thermal-receipt font-mono"
    :class="preview ? 'block' : 'hidden print:block'"
    :style="{ width }"
  >
    <div class="text-center">
      <h2 class="title">{{ company.name }}</h2>
      <p v-if="company.address">{{ company.address }}</p>
      <p v-if="company.phone">Telp: {{ company.phone }}</p>
    </div>

    <div class="divider"></div>

    <div class="section text-xs">
      <p>No: #{{ invoiceNumber }}</p>
      <p>Tanggal: {{ formatDate(order.createdAt) }}</p>
      <p>Pelanggan: {{ order.customer?.name }}</p>
    </div>

    <div class="divider"></div>

    <div class="section">
      <h3 class="section-title">ITEM</h3>
      <div v-for="(item, i) in order.items" :key="i" class="row">
        <span class="left"> {{ item.itemType?.name }} ({{ item.weightInKg }}kg) </span>
        <span class="right">
          {{ formatCurrency(item.subtotal) }}
        </span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="section">
      <div v-for="(val, index) in invoiceItems" :key="index" class="row">
        <span>{{ val.label }}</span>
        <span :class="val.isDiscount ? 'text-red-500' : ''">
          {{ val.isDiscount ? '-' : '' }}{{ formatCurrency(val.value) }}
        </span>
      </div>

      <div class="divider thin"></div>

      <div class="row total">
        <span>TOTAL</span>
        <span>{{ formatCurrency(order.invoice?.grandTotal) }}</span>
      </div>
    </div>

    <div class="divider"></div>

    <div class="section text-xs">
      <p>Metode: {{ order.payment?.paymentMethod || '-' }}</p>
      <p>Status: {{ order.payment?.status || '-' }}</p>
      <p v-if="order.payment?.paidAt">Dibayar: {{ formatDate(order.payment?.paidAt) }}</p>
    </div>

    <div class="divider"></div>

    <div class="footer text-xs">
      <p>Terima kasih atas kepercayaan Anda 🙏</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  order: { type: Object, required: true },
  company: {
    type: Object,
    default: () => ({
      name: 'Laundry App',
      address: '',
      phone: '',
    }),
  },
  preview: { type: Boolean, default: false },
  width: { type: String, default: '58mm' },
})

const receiptRef = ref(null)

const invoiceNumber = computed(() => props.order?.invoiceNumber || '')
const invoiceItems = computed(() => [
  { label: 'Subtotal', value: props.order.invoice?.subtotal || 0 },
  { label: 'Service Fee', value: props.order.invoice?.serviceCharge || 0 },
  { label: 'Pickup Fee', value: props.order.invoice?.pickupFee || 0 },
  { label: 'Delivery Fee', value: props.order.invoice?.deliveryFee || 0 },
  { label: 'Tax', value: props.order.invoice?.tax || 0 },
  {
    label: 'Discount',
    value: props.order.invoice?.discount || 0,
    isDiscount: !!props.order.invoice?.discount,
  },
])

const print = () => {
  window.print()
}

defineExpose({ print })
</script>

<style>
.thermal-receipt {
  padding: 4px;
  font-size: 10px;
}

.preview {
  transform: scale(1.2);
  transform-origin: top center;
}

.title {
  font-size: 12px;
  font-weight: bold;
}

.section {
  margin-top: 5px;
}

.section-title {
  text-align: center;
  font-weight: bold;
  margin-bottom: 4px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.total {
  font-weight: bold;
}

.divider {
  border-top: 1px dashed #000;
  margin: 6px 0;
}

.divider.thin {
  margin: 3px 0;
}

.footer {
  text-align: center;
  margin-top: 5px;
}

.print-btn {
  margin-top: 10px;
  width: 100%;
}

@media print {
  body * {
    display: none;
  }

  .thermal-receipt {
    display: block;
    position: static;
    font-size: 10px;
    font-family: monospace;
  }

  .thermal-receipt * {
    display: block;
    color: black !important;
  }

  .row {
    display: flex !important;
    justify-content: space-between !important;
  }
}
</style>
