<template>
  <BaseModal v-model="modelValue" :title="modalTitle" size="md">
    <BaseCard class="space-y-4" variant="glass">
      <form @submit.prevent="submitOrder" class="space-y-4">
        <BaseSelect
          v-if="isAdmin"
          label="Pilih Pelanggan"
          v-model="form.customerId"
          :options="customerOptions"
          placeholder="-- Pilih Pelanggan --"
          type="search"
          :onSearch="searchCustomers"
          required
          :disabled="editMode"
        />

        <BaseSelect
          v-if="form.pickupRequested"
          label="Pilih Alamat Pengambilan"
          v-model="form.pickupAddressId"
          :options="addressOption"
          placeholder="-- Pilih Alamat Pengambilan --"
          required
          :disabled="editMode"
        />

        <BaseSelect
          v-if="form.deliveryRequested"
          label="Pilih Alamat Pengantaran"
          v-model="form.deliveryAddressId"
          :options="addressOption"
          placeholder="-- Pilih Alamat Pengantaran --"
          required
          :disabled="editMode"
        />

        <div class="flex gap-4">
          <label class="flex items-center gap-2">
            <input
              type="checkbox"
              v-model="form.pickupRequested"
              :disabled="forcePickup || editMode"
            />
            Minta Penjemputan
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="form.deliveryRequested" :disabled="editMode" />
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

        <div>
          <h3 class="font-semibold mb-2">Item Laundry</h3>
          <BaseCard v-for="(item, index) in form.items" :key="index" class="mb-4 p-4 space-y-2">
            <BaseSelect
              v-model="item.itemType"
              label="Jenis Item"
              :options="itemTypeOption"
              placeholder="-- Pilih Item --"
              :required="isAdmin"
            />
            <BaseSelect
              v-model="item.serviceType"
              label="Jenis Layanan"
              :options="serviceTypeOption"
              placeholder="-- Pilih Layanan --"
              :required="isAdmin"
            />
            <BaseInput
              v-model.number="item.weightInKg"
              type="number"
              label="Berat (kg)"
              min="0"
              :required="isAdmin"
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
            variant="glass"
            class="w-full"
            @click.prevent="addItem"
          />
        </div>

        <BaseButton type="submit" label="Simpan Pesanan" variant="primary" class="w-full" />
      </form>
    </BaseCard>
  </BaseModal>
</template>

<script setup>
import { reactive, computed, onMounted, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionStore } from '@/stores/services/transaction.service'
import { useUserStore } from '@/stores/services/user.service'
import { useAuthStore } from '@/stores/auth/auth'
import { useOptionsStore } from '@/stores/services/option.service'
import { useAddressStore } from '@/stores/services/address.service'
import { toValueLabelOptions } from '@/utils/formatters'
import BaseCard from '@/components/BaseCard.vue'

const props = defineProps({
  mode: { type: String, default: 'admin' },
  editMode: { type: Boolean, default: false },
  orderId: { type: String, default: '' },
})

const modelValue = defineModel()
const transactionStore = useTransactionStore()
const optionStore = useOptionsStore()
const addressStore = useAddressStore()
const userStore = useUserStore()
const { user } = storeToRefs(useAuthStore())

// ========== MODE CHECK ==========
const isAdmin = computed(() => props.mode === 'admin')
const forcePickup = computed(() => props.mode === 'customer')
const modalTitle = computed(() => {
  if (props.editMode) return 'Edit Pesanan Laundry'
  return isAdmin.value ? 'Buat Pesanan Laundry (Admin)' : 'Buat Pesanan Laundry (Customer)'
})

// ========== OPTIONS ==========
const customers = computed(() => (Array.isArray(userStore.users) ? userStore.users : []))
const customerOptions = computed(() => customers.value.map((c) => ({ label: c.name, value: c.id })))
const addressOption = computed(() =>
  toValueLabelOptions(
    addressStore.addresses,
    'id',
    null,
    (a) => `${a.addressLine}, ${a.label} (${a.notes ?? '-'})`,
  ),
)
const serviceTypeOption = computed(() =>
  Array.isArray(optionStore.serviceTypes) ? optionStore.serviceTypes : [],
)

const itemTypeOption = computed(() =>
  Array.isArray(optionStore.itemTypes) ? optionStore.itemTypes : [],
)

const searchCustomers = async (keyword) => {
  await userStore.fetchUsers({ search: keyword })
}

// ========== FORM ==========
const createDefaultForm = () => ({
  customerId: isAdmin.value ? '' : user.value?.id,
  pickupRequested: forcePickup.value ? true : false,
  deliveryRequested: false,
  pickupAddressId: '',
  deliveryAddressId: '',
  notes: '',
  items: [],
  payment: { amountPaid: 0, paymentMethod: '', note: '' },
})

const form = reactive(createDefaultForm())

// ========== WATCHER ==========
watch(
  () => form.customerId,
  async (newVal) => {
    if (newVal) {
      await addressStore.fetchAddresses({ customerId: newVal })
    } else {
      addressStore.clearData()
    }
  },
  { immediate: true },
)

// ========== METHODS ==========
const addItem = () => {
  form.items.push({
    itemType: '',
    serviceType: '',
    weightInKg: 0,
    unitPrice: 0,
  })
}

const removeItem = (index) => {
  form.items.splice(index, 1)
}

const loadOrder = async () => {
  if (!props.orderId) return
  await transactionStore.fetchTransactionById(props.orderId)
  const order = transactionStore.selectedTransaction

  form.customerId = order.customerId
  form.pickupRequested = order.pickupRequested
  form.deliveryRequested = order.deliveryRequested
  form.pickupAddressId = order.pickupAddressId
  form.deliveryAddressId = order.deliveryAddressId
  form.notes = order.notes
  form.items =
    order.items?.map((i) => ({
      serviceType: i.serviceType ?? '',
      itemType: i.itemType ?? '',
      weightInKg: i.weightInKg ?? 0,
      unitPrice: i.unitPrice ?? 0,
      subtotal: i.subtotal ?? 0,
    })) ?? []
}

const submitOrder = async () => {
  const preparedItems = form.items
    .filter((item) => item.itemType && item.serviceType && item.weightInKg > 0)
    .map((item) => ({
      itemType: item.itemType,
      serviceType: item.serviceType,
      weightInKg: item.weightInKg,
    }))

  if (props.editMode && props.orderId) {
    await transactionStore.updateTransaction(props.orderId, { items: preparedItems })
  } else {
    const payload = {
      customerId: form.customerId,
      pickupRequested: form.pickupRequested,
      ...(form.pickupRequested ? { pickupAddressId: form.pickupAddressId } : {}),
      deliveryRequested: form.deliveryRequested,
      ...(form.deliveryRequested ? { deliveryAddressId: form.deliveryAddressId } : {}),
      notes: form.notes,
      items: preparedItems,
    }
    await transactionStore.createTransaction(payload)
  }

  modelValue.value = false
}

// ========== HOOKS ==========
onMounted(async () => {
  if (isAdmin.value) await userStore.fetchUsers()
  await optionStore.fetchServiceTypes()
  await optionStore.fetchPaymentMethod()
  await optionStore.fetchItemTypes()

  if (props.editMode && props.orderId) {
    await loadOrder()
  }
})

onUnmounted(() => {
  addressStore.clearData()
})
</script>
