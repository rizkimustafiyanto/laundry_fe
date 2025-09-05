<template>
  <BaseModal v-model="modalOpen" title="Edit Profile" size="md">
    <form class="flex flex-col gap-3 text-sm" @submit.prevent="saveProfile">
      <BaseInput id="name" label="Nama" v-model="localProfile.name" required />
      <BaseInput id="email" label="Email" type="email" v-model="localProfile.email" disabled />
      <BaseSelect
        label="Jenis Kelamin"
        v-model="localProfile.gender"
        placeholder="Pilih Jenis Kelamin"
        :options="optionGender"
        required
      />
      <BaseInput
        id="phone"
        label="Nomor Telepon"
        type="tel"
        placeholder="Masukkan Nomor Telepon"
        v-model="localProfile.phone"
        required
      />
      <BaseInput
        id="dateofbirth"
        label="Tanggal Lahir"
        type="date"
        placeholder="Masukkan Tanggal Lahir"
        v-model="localProfile.dateOfBirth"
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
      <BaseButton type="submit" label="Simpan" variant="success" class="w-full" />
    </form>
  </BaseModal>
</template>

<script setup>
import { useOptionsStore } from '@/stores/services/option.service'
import { computed, onBeforeMount, reactive, watch } from 'vue'

const props = defineProps({
  dataProfile: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['save', 'file-selected'])
const modalOpen = defineModel()

const localProfile = reactive({
  name: '',
  email: '',
  gender: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  bio: '',
  ...props.dataProfile,
})

const optionStore = useOptionsStore()
const optionGender = computed(() => optionStore.genders)

watch(
  () => props.dataProfile,
  (newVal) => {
    Object.assign(localProfile, newVal || {})
  },
)

function saveProfile() {
  emit('save', { ...localProfile })
}

function handleFileSelected(fileEvent) {
  emit('file-selected', fileEvent)
}

onBeforeMount(async () => {
  await optionStore.fetchGenders()
})
</script>
