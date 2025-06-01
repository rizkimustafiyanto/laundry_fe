<template>
  <div>
    <BaseInput
      id="label"
      label="Label Alamat"
      v-model="localAddress.label"
      placeholder="(Contoh: Rumah, Kantor)"
      required
    />
    <BaseInput
      id="recipientName"
      label="Nama Penerima"
      v-model="localAddress.recipientName"
      placeholder="Masukkan Nama Penerima"
      required
    />
    <BaseInput
      id="recipientPhone"
      label="No. Telepon Penerima"
      type="tel"
      v-model="localAddress.recipientPhone"
      required
    />
    <BaseInput
      id="addressDetail"
      label="Detail Alamat"
      type="textarea"
      v-model="localAddress.addressDetail"
      required
    />

    <div class="text-right mt-3">
      <BaseButton @click="saveAddress" label="Simpan Alamat" variant="primary" class="w-40" />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  address: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['save-address'])

// Buat salinan reactive dari props.address supaya bisa dimutasi
const localAddress = reactive({ ...props.address })

// Sync jika props.address berubah dari luar
watch(
  () => props.address,
  (newVal) => {
    Object.assign(localAddress, newVal)
  },
)

const saveAddress = () => {
  // Kirim data localAddress ke parent
  emit('save-address', { ...localAddress })
}
</script>
