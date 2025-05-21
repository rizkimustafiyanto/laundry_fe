<template>
  <BaseModal v-model="modelValue">
    <template #header>
      <h3 class="text-lg font-semibold">Lengkapi Transaksi</h3>
    </template>

    <form @submit.prevent="submit" class="space-y-4">
      <BaseInput label="Berat (kg)" type="number" v-model="form.weight" required />

      <BaseInput label="Item" type="text" v-model="form.items" required />

      <BaseInput label="Catatan" type="textarea" v-model="form.notes" rows="3" />

      <div class="flex justify-end pt-2">
        <button type="submit" class="btn btn-primary">Simpan</button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useOrderStore } from '@/stores/services/order'
import { useUIStore } from '@/stores/component/ui'

const props = defineProps({
  order: Object,
})

const modelValue = defineModel()

const orderStore = useOrderStore()
const ui = useUIStore()

const form = ref({
  weight: '',
  items: '',
  notes: '',
})

watch(
  () => props.order,
  (val) => {
    if (val) {
      form.value = {
        weight: val.weight || '',
        items: val.items || '',
        notes: val.notes || '',
      }
    }
  },
)

const submit = async () => {
  try {
    await orderStore.updateOrderDetails(props.order.id, { ...form.value })
    ui.show('success', 'Transaksi berhasil diperbarui.')
    modelValue.value = false
  } catch (err) {
    ui.show('error', 'Gagal menyimpan transaksi.')
  }
}
</script>
