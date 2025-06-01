<template>
  <BaseModal v-model="modelValue" title="Lengkapi Transaksi" size="xl">
    <form @submit.prevent="submit" class="space-y-4">
      <!-- Laundry Items -->
      <div
        v-for="(item, index) in form.items"
        :key="index"
        class="border p-3 rounded-md space-y-2 dark:border-gray-500"
      >
        <BaseSelect
          label="Jenis Layanan"
          v-model="item.serviceType"
          :options="serviceTypeOption"
          placeholder="Pilih Layanan"
          required
        />
        <BaseInput
          label="Jenis Item"
          v-model="item.itemType"
          placeholder="Baju, Kaos, Celana"
          required
        />
        <BaseInput
          label="Berat (kg)"
          type="number"
          v-model.number="item.weightInKg"
          :min="0"
          required
        />
        <BaseInput
          label="Harga/kg"
          type="number"
          v-model.number="item.unitPrice"
          :min="0"
          required
        />
        <div class="text-sm text-gray-500">Subtotal: Rp {{ item.weightInKg * item.unitPrice }}</div>
        <div class="text-right">
          <BaseButton label="Hapus" variant="danger" @click="removeItem(index)" />
        </div>
      </div>

      <BaseButton
        label="Tambah Item"
        variant="outline"
        customClass="w-full"
        type="button"
        @click="addItem"
      />

      <!-- Status -->
      <BaseSelect
        v-if="!orderTake"
        label="Status"
        v-model="form.status"
        :options="statusOption"
        placeholder="Pilih Status"
        required
      />

      <!-- Notes -->
      <BaseInput
        label="Catatan"
        type="textarea"
        v-model="form.notes"
        rows="3"
        placeholder="Masukkan Catatan..."
        :disabled="orderTake"
      />

      <!-- Action Buttons -->
      <div class="flex justify-end pt-2">
        <BaseButton label="Simpan" type="submit" />
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useOrderStore } from '@/stores/services/order'

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
  orderTake: {
    type: Boolean,
    default: () => false,
  },
})

const modelValue = defineModel()
const orderStore = useOrderStore()

const form = ref({
  items: [],
  notes: '',
  status: '',
})

const serviceTypeOption = ref()
const statusOption = ref()

const addItem = () => {
  form.value.items.push({
    serviceType: 'CUCI_KERING',
    itemType: '',
    weightInKg: 0,
    unitPrice: 0,
    subtotal: 0,
  })
}

const removeItem = (index) => {
  form.value.items.splice(index, 1)
}

const loadOrder = async () => {
  if (!props.orderId) {
    form.value = { items: [], notes: '' }
    return
  }
  await orderStore.fetchOrderById(props.orderId)
  const order = orderStore.selectedOrder

  form.value.items =
    order.items?.map((i) => ({
      serviceType: i.serviceType ?? 'CUCI_KERING',
      itemType: i.itemType ?? '',
      weightInKg: i.weightInKg ?? 0,
      unitPrice: i.unitPrice ?? 0,
      subtotal: i.subtotal ?? 0,
    })) ?? []

  form.value.notes = order?.notes ?? ''
}

const loadServiceType = async () => {
  await orderStore.fetchServiceType()
  serviceTypeOption.value = orderStore.serviceTypeList
}

const loadStatusOption = async () => {
  await orderStore.fetchFilterListStatus()
  statusOption.value = orderStore.filterList
}

onMounted(() => {
  if (props.orderId) {
    loadOrder()
    loadServiceType()
    loadStatusOption()
  }
})

watch(
  () => props.orderId,
  (newId, oldId) => {
    if (newId !== oldId) loadOrder()
  },
)

const submit = async () => {
  const preparedItems = form.value.items.map((i) => ({
    serviceType: i.serviceType,
    itemType: i.itemType,
    weightInKg: i.weightInKg,
    unitPrice: i.unitPrice,
    subtotal: Math.round(i.weightInKg * i.unitPrice),
  }))

  const payload = {
    items: preparedItems,
    notes: form.value.notes,
    ...(props.orderTake
      ? {
          status: 'PICKED_UP',
        }
      : {
          status: form.value.status,
        }),
  }

  await orderStore.updateOrderDetail(props.orderId, payload)
  modelValue.value = false
}
</script>
