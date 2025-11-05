<template>
  <BaseModal v-model="modelValue" :title="modalTitle" size="md">
    <BaseLoadingSpinner v-if="loading" :type="'mini'" />

    <form v-else @submit.prevent="submitOrder" class="space-y-4">

      <!-- Customer, hanya tampil jika bukan CUSTOMER -->
      <BaseSelect
        v-if="isManualPickup && user.role !== 'CUSTOMER'"
        label="Pilih Pelanggan"
        v-model="form.customerId"
        :options="customerAsAdminOptions"
        placeholder="-- Pilih Pelanggan --"
        type="search"
        :onSearch="searchCustomers"
        required
        :disabled="editMode"
      />

      <!-- Pickup -->
      <BaseSelect
        v-if="form.pickupRequested"
        label="Pilih Alamat Pengambilan"
        v-model="form.pickupAddressId"
        :options="addressOption"
        placeholder="-- Pilih Alamat Pengambilan --"
        type="search"
        required
      />

      <!-- Delivery -->
      <BaseSelect
        v-if="form.deliveryRequested"
        label="Pilih Alamat Pengantaran"
        v-model="form.deliveryAddressId"
        :options="addressOption"
        placeholder="-- Pilih Alamat Pengantaran --"
        required
      />

      <!-- Checkbox pickup & delivery -->
      <div class="flex gap-4">
        <label class="flex items-center gap-2" :class="themeClass.text.secondary">
          <input
            type="checkbox"
            v-model="form.pickupRequested"
            :disabled="forcePickup"
            class="accent-teal-600"
          />
          Minta Penjemputan
        </label>
        <label class="flex items-center gap-2" :class="themeClass.text.secondary">
          <input type="checkbox" v-model="form.deliveryRequested" class="accent-teal-600" />
          Minta Pengantaran
        </label>
      </div>

      <BaseInput
        label="Catatan"
        v-model="form.notes"
        type="textarea"
        rows="3"
        placeholder="Tulis catatan tambahan..."
        :disabled="editMode"
      />

      <!-- Items -->
      <div>
        <h3 class="font-semibold mb-2" :class="themeClass.text.secondary">Item Laundry</h3>
        <BaseCard
          v-for="(item, index) in form.items"
          :key="index"
          class="mb-4 p-4 space-y-2"
          variant="secondary"
        >
          <BaseSelect
            v-model="item.serviceTypeId"
            label="Jenis Layanan"
            :options="serviceTypeOption"
            placeholder="-- Pilih Layanan --"
            :required="isManualPickup"
          />
          <BaseSelect
            v-model="item.itemTypeId"
            label="Jenis Item"
            :options="getItemsForService(item.serviceTypeId)"
            placeholder="-- Pilih Item --"
            :required="isManualPickup"
          />
          <BaseInput
            v-model.number="item.weightInKg"
            type="number"
            label="Berat (kg)"
            min="0"
            :required="isManualPickup"
          />
          <BaseButton
            label="Hapus Item"
            variant="danger"
            @click.prevent="removeItem(index)"
            class="w-full"
          />
        </BaseCard>
        <BaseButton
          label="+ Tambah Item"
          variant="secondary"
          class="w-full"
          @click.prevent="addItem"
        />
      </div>

      <!-- Payment -->
      <div v-if="showPaymentSection" class="space-y-2">
        <h3 class="font-semibold mb-2" :class="themeClass.text.secondary">Pembayaran</h3>
        <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />

        <div class="space-y-1 text-sm">
          <div class="flex justify-between">
            <span>Subtotal</span><span>{{ formatCurrency(order.invoice?.subtotal) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Service Fee</span><span>{{ formatCurrency(order.invoice?.serviceCharge) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Pickup Fee</span><span>{{ formatCurrency(order.invoice?.pickupFee) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Delivery Fee</span><span>{{ formatCurrency(order.invoice?.deliveryFee) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Tax</span><span>{{ formatCurrency(order.invoice?.tax) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Discount</span><span>-{{ formatCurrency(order.invoice?.discount) }}</span>
          </div>
          <div
            class="border-t border-dashed mt-2 pt-2 flex justify-between font-bold"
            :class="themeClass.border.secondary"
          >
            <span>Total Harus Dibayar</span>
            <span>{{ formatCurrency(order.invoice?.grandTotal) }}</span>
          </div>
        </div>

        <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />

        <div class="text-sm space-y-2">
          <div class="flex justify-between">
            <span>Status</span>
            <span class="font-medium capitalize">
              {{ order.payment?.status || 'PENDING' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span>Dibuat</span>
            <span>{{ formatDate(order.payment?.createdAt, 'dd/MM/yyyy HH:mm') }}</span>
          </div>
          <div v-if="order.payment?.paidAt" class="flex justify-between">
            <span>Dikonfirmasi</span>
            <span>{{ formatDate(order.payment.paidAt, 'dd/MM/yyyy HH:mm') }}</span>
          </div>
          <div class="flex justify-between">
            <span>Jumlah Dibayarkan</span>
            <span>{{ formatCurrency(order.payment?.amountPaid || 0) }}</span>
          </div>
        </div>

        <BaseSelect
          v-if="canEditPaymentMethod"
          v-model="form.payment.paymentMethod"
          label="Metode Pembayaran"
          :options="paymentOptions"
          placeholder="-- Pilih Pembayaran --"
        />

        <div v-if="form.payment.paymentMethod === 'QRIS' && qrisChar" class="mt-3 text-center">
          <p class="text-sm mb-2" :class="themeClass.text.secondary">
            Scan QRIS untuk melakukan pembayaran
          </p>
          <img
            :src="`${__BASE_URL__}${qrisChar}`"
            alt="QRIS Payment"
            class="mx-auto w-56 h-56 object-contain border rounded-xl shadow-md"
          />
        </div>

        <BaseInput
          v-if="canEditNote"
          v-model="form.payment.note"
          label="Catatan Pembayaran"
          type="textarea"
          rows="3"
          placeholder="Tulis catatan tambahan..."
        />

        <hr class="my-3 border-dashed" :class="themeClass.border.secondary" />
      </div>

      <BaseButton
        type="submit"
        :label="showPaymentSection ? 'Simpan Perubahan Pembayaran' : 'Simpan Pesanan'"
        variant="teal"
        class="w-full"
      />
    </form>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  mode: { type: String, default: 'manualpickup' },
  editMode: { type: Boolean, default: false },
  orderId: { type: String, default: '' },
  pickedByEmployee: { type: Boolean, default: false },
})

const modelValue = defineModel()
const themeClass = useThemeClass()
const { user } = storeToRefs(useAuthStore())
const transactionStore = useTransactionStore()
const serviceType = useServiceTypeStore()
const itemType = useItemTypeStore()
const paymentMethodStore = usePaymentMethodStore()
const addressStore = useAddressStore()
const userStore = useUserStore()
const pricingStore = usePricingStore()
const profileStore = useCompanyProfileStore()
const qrisChar = computed(() => profileStore.items[0]?.qrisImageUrl || null)

const isManualPickup = computed(() => props.mode === 'manualpickup')
const forcePickup = computed(() => props.mode === 'requestpickup')
const modalTitle = computed(() => {
  if (props.editMode) return 'Edit Pesanan Laundry'
  return isManualPickup.value ? 'Buat Pesanan Laundry (Manual)' : 'Buat Pesanan Laundry (Pickup)'
})
const loading = ref(true)

const customers = computed(() => (Array.isArray(userStore.items) ? userStore.items : []))
const customerAsAdminOptions = computed(() =>
  customers.value.map((c) => ({ label: c.name, value: c.id })),
)
const paymentOptions = computed(() => {
  return paymentMethodStore.options.map((opt) => {
    if (opt.value === 'QRIS' && !qrisChar.value) {
      return {
        ...opt,
        disabled: true,
        label: `${opt.label} (Belum diatur di Setting)`,
      }
    }
    return opt
  })
})


const addressOption = computed(() =>
  toValueLabelOptions(
    addressStore.items,
    'id',
    null,
    (a) => `${a.addressLine}, ${a.label} (${a.notes ?? '-'})`,
  ),
)

const { serviceTypeOption, getItemsForService } = useValidOptions(
  serviceType,
  itemType,
  pricingStore,
)

const searchCustomers = async (keyword) => {
  await userStore.fetchItems({ search: keyword })
}

const form = computed(() => transactionStore.formPayload)
const order = computed(() => transactionStore.item)

const resetForm = () => {
  transactionStore.formPayload = {
    customerId:
      user.value.role === 'CUSTOMER' ? user.value.id : isManualPickup.value ? '' : user.value?.id,
    pickupRequested: forcePickup.value ? true : false,
    deliveryRequested: false,
    pickupAddressId: '',
    deliveryAddressId: '',
    notes: '',
    items: [],
    payment: { amountPaid: 0, paymentMethod: '', note: '' },
  }
}

const showPaymentSection = computed(() =>
  props.mode === 'paymentorder' &&
  ['SUPER_ADMIN', 'OWNER'].includes(user.value.role) &&
  order.value.status === 'COMPLETED'
)

const canEditPaymentMethod = computed(
  () => order.value.status === 'COMPLETED' && ['SUPER_ADMIN', 'OWNER'].includes(user.value.role)
)

const canEditNote = canEditPaymentMethod


watch(
  () => form.value.customerId,
  async (newVal) => {
    if (newVal) {
      await addressStore.fetchByCustomer(newVal)
    } else {
      addressStore.clearData()
    }
  },
  { immediate: true },
)

const addItem = () => {
  form.value.items.push({
    serviceTypeId: '',
    itemTypeId: '',
    weightInKg: 0,
    unitPrice: 0,
  })
}

const removeItem = (index) => {
  form.value.items.splice(index, 1)
}

const loadOrder = async () => {
  transactionStore.formPayload = {
    customerId: order.value.customerId,
    pickupRequested: order.value.pickupRequested,
    deliveryRequested: order.value.deliveryRequested,
    pickupAddressId: order.value.pickupAddressId,
    deliveryAddressId: order.value.deliveryAddressId,
    notes: order.value.notes,
    items:
      order.value.items?.map((i) => ({
        serviceTypeId: i.serviceTypeId ?? '',
        itemTypeId: i.itemTypeId ?? '',
        weightInKg: i.weightInKg ?? 0,
        unitPrice: i.unitPrice ?? 0,
        subtotal: i.subtotal ?? 0,
      })) ?? [],
    payment: order.value.payment ?? { amountPaid: 0, paymentMethod: '', note: '' },
  }
}

const submitOrder = async () => {
  transactionStore.formPayload.items = form.value.items.filter(
    (item) => item.itemTypeId && item.serviceTypeId && item.weightInKg > 0,
  )

  if (props.editMode && props.pickedByEmployee && isManualPickup.value) {
    transactionStore.formPayload.status = 'PICKED_UP'
  }

  if (props.editMode && props.orderId) {
    await transactionStore.updateItem(props.orderId)
  } else {
    await transactionStore.createItem()
  }

  modelValue.value = false
}

onBeforeMount(async () => {
  loading.value = true
  try {
    if (isManualPickup.value && user.value.role !== 'CUSTOMER') {
      await userStore.fetchItems()
    }

    await Promise.all([serviceType.fetchItems(), itemType.fetchItems(), pricingStore.fetchItems()])

    if (props.editMode && props.orderId) {
      await transactionStore.fetchItemById(props.orderId)
      await loadOrder()

      if (props.mode === 'paymentorder') {
        await paymentMethodStore.fetch()
      }
    } else {
      resetForm()
    }
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  addressStore.clearData()
})
</script>
