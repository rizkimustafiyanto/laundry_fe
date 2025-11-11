<template>
  <BaseModal v-model="modalOpen" title="Edit Profile" size="md">
    <form class="flex flex-col gap-3 text-sm" @submit.prevent="saveProfile">
      <BaseInput id="name" label="Nama" v-model="localProfile.name" required />
      <BaseInput id="email" label="Email" type="email" v-model="localProfile.email" disabled />
      <BaseSelect
        label="Jenis Kelamin"
        v-model="localProfile.gender"
        placeholder="Pilih Jenis Kelamin"
        :options="itemGender"
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
      <BaseInput id="profile-picture" label="File" type="file" @update:file="handleFileUpload" />
      <div v-if="imagePreview" class="mt-2 flex justify-center items-center">
        <img
          :src="imagePreview.startsWith('data:') ? imagePreview : `${__BASE_URL__}${imagePreview}`"
          alt="Preview"
          class="h-20 w-20 object-cover rounded shadow"
        />
      </div>
      <BaseButton type="submit" label="Simpan" variant="success" class="w-full" />
    </form>
  </BaseModal>
</template>

<script setup>
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
  dateOfBirth: props.dataProfile?.dateOfBirth
    ? formatDateForInput(props.dataProfile.dateOfBirth)
    : '',
  address: '',
  bio: '',
  ...props.dataProfile,
})

const imagePreview = ref(null)
const fileObj = ref(null)

const genderStore = useGendersStore()
const { options: itemGender } = storeToRefs(genderStore)

watch(
  () => props.dataProfile,
  (newVal) => {
    Object.assign(localProfile, {
      ...newVal,
      dateOfBirth: newVal?.dateOfBirth ? formatDateForInput(newVal.dateOfBirth) : '',
    })
    if (newVal) {
      imagePreview.value = newVal.photo || null
      fileObj.value = null
    }
  },
  { immediate: true },
)

function saveProfile() {
  const payload = {
    ...localProfile,
    dateOfBirth: localProfile.dateOfBirth ? new Date(localProfile.dateOfBirth).toISOString() : null,
  }
  emit('save', payload)
}

function handleFileUpload(file) {
  if (!file) return
  fileObj.value = file
  const reader = new FileReader()
  reader.onload = (e) => (imagePreview.value = e.target.result)
  reader.readAsDataURL(file)
  emit('file-selected', file)
}

onBeforeMount(async () => {
  await genderStore.fetch()
})
</script>
