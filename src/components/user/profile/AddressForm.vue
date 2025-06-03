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
      id="addressLine"
      label="Detail Alamat"
      type="textarea"
      v-model="localAddress.address_line"
      required
    />
    <BaseInput
      id="notes"
      label="Catatan"
      v-model="localAddress.notes"
      placeholder="Masukkan Catatan"
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

const emit = defineEmits(['save-address', 'update:address'])

const localAddress = reactive({ ...props.address })

watch(
  localAddress,
  (val) => {
    emit('update:address', val)
  },
  { deep: true },
)

const saveAddress = () => {
  emit('save-address')
}
</script>
