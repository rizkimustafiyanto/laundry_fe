<template>
  <div class="space-y-4">
    <BaseInput id="name" label="Nama" v-model="localProfile.name" />
    <BaseInput id="email" label="Email" type="email" v-model="localProfile.email" disabled />
    <BaseSelect
      label="Jenis Kelamin"
      v-model="localProfile.gender"
      placeholder="Pilih Jenis Kelamin"
      :options="[
        { label: 'Laki - laki', value: 'male' },
        { label: 'Perempuan', value: 'female' },
      ]"
    />
    <BaseInput
      id="phone"
      label="Nomor Telepon"
      type="tel"
      placeholder="Masukkan Nomer Telepon"
      v-model="localProfile.phone"
    />
    <BaseInput
      id="address"
      label="Alamat Pribadi"
      type="textarea"
      placeholder="Masukkan Alamat"
      v-model="localProfile.address"
    />
    <BaseInput
      id="bio"
      label="Bio"
      type="textarea"
      placeholder="Tuliskan bio singkat..."
      v-model="localProfile.bio"
    />
    <BaseInput
      id="profile-picture"
      label="Foto Profil"
      type="file"
      @update:file="handleFileSelected"
    />

    <div class="text-right">
      <BaseButton @click="saveProfile" label="Simpan" variant="success" class="w-40" />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  editableProfile: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['save', 'file-selected'])

const localProfile = reactive({ ...props.editableProfile })

watch(
  () => props.editableProfile,
  (newVal) => {
    Object.assign(localProfile, newVal)
  },
)

function saveProfile() {
  emit('save', { ...localProfile })
}

function handleFileSelected(fileEvent) {
  emit('file-selected', fileEvent)
}
</script>
