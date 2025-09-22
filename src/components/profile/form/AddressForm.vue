<template>
  <BaseModal
    v-model="modalOpen"
    :title="mode === 'create' ? 'Create Address' : 'Edit Address'"
    size="md"
  >
    <form class="flex flex-col gap-3" @submit.prevent="saveAddress">
      <BaseInput
        id="label"
        label="Label Alamat"
        v-model="localAddress.label"
        placeholder="(Contoh: Rumah, Kantor)"
        required
      />
      <BaseInput
        id="addressLine"
        label="Detail Alamat"
        type="textarea"
        v-model="localAddress.addressLine"
        placeholder="Silahkan masukkan detail alamat"
        rows="3"
        required
      />
      <BaseInput
        id="notes"
        label="Catatan"
        v-model="localAddress.notes"
        placeholder="Masukkan Catatan"
        required
      />

      <BaseButton type="submit" label="Simpan Alamat" variant="success" class="w-full mt-4" />
    </form>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  address: { type: Object, default: null },
  mode: { type: String, required: true },
})

const emit = defineEmits(['save', 'edit'])
const modalOpen = defineModel()

const localAddress = reactive({ ...props.address })

watch(
  () => props.address,
  (newVal) => {
    Object.assign(localAddress, newVal)
  },
)

function saveAddress() {
  modalOpen.value = false
  if (props.mode === 'create') {
    emit('save', { ...localAddress })
  } else {
    emit('edit', { ...localAddress })
  }
}
</script>
