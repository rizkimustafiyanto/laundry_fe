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

      <!-- Notes -->
      <BaseInput
        label="Catatan"
        type="textarea"
        v-model="form.notes"
        rows="3"
        placeholder="Masukkan Catatan..."
      />

      <!-- Action Buttons -->
      <div class="flex justify-end pt-2">
        <BaseButton label="Simpan" type="submit" />
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useOrderStore } from '@/stores/services/order'
import { useUIStore } from '@/stores/component/ui'

const props = defineProps({
  orderId: {
    type: String,
    required: true,
  },
})

const modelValue = defineModel()
const orderStore = useOrderStore()
const ui = useUIStore()

const form = ref({
  items: [],
  notes: '',
})

const serviceTypeOption = computed(() => {
  return orderStore.serviceTypeList
})

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

  try {
    await orderStore.fetchOrderById(props.orderId)
    await orderStore.fetchServiceType()
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
  } catch (err) {
    ui.show('error', 'Gagal mengambil detail order.')
  }
}

onMounted(() => {
  if (props.orderId) {
    loadOrder()
  }
})

watch(
  () => props.orderId,
  (newId, oldId) => {
    if (newId !== oldId) loadOrder()
  },
)

const submit = async () => {
  try {
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
    }

    await orderStore.updateOrderDetail(props.orderId, payload)
    ui.show('success', 'Transaksi berhasil diperbarui.')
    modelValue.value = false
  } catch (err) {
    ui.show('error', `Gagal menyimpan transaksi.`)
  }
}
</script>
