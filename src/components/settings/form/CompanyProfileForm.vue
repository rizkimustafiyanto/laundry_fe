<template>
  <BaseModal v-model="modalOpen" :title="mode === 'create' ? 'Create' : 'Edit'" size="md">
    <form @submit.prevent="submitForm" class="space-y-4">
      <BaseInput label="Name" v-model="formPayload.name" placeholder="Name" />
      <BaseInput label="About" v-model="formPayload.about" placeholder="About" />
      <BaseInput label="Email" v-model="formPayload.email" placeholder="Email" />
      <BaseInput label="Phone" v-model="formPayload.phone" placeholder="Phone" />
      <BaseInput label="Address" v-model="formPayload.address" placeholder="Address" />
      <BaseInput
        label="Facebook URL"
        v-model="formPayload.facebookUrl"
        placeholder="Facebook URL"
      />
      <BaseInput
        label="Instagram URL"
        v-model="formPayload.instagramUrl"
        placeholder="Instagram URL"
      />
      <BaseInput label="Twitter URL" v-model="formPayload.twitterUrl" placeholder="Twitter URL" />
      <BaseInput
        label="LinkedIn URL"
        v-model="formPayload.linkedinUrl"
        placeholder="LinkedIn URL"
      />
      <BaseInput label="TikTok URL" v-model="formPayload.tiktokUrl" placeholder="TikTok URL" />

      <div>
        <BaseInput label="Image" type="file" @update:file="handleFileUpload" />
        <div v-if="logoPreview" class="mt-2">
          <img :src="logoPreview" alt="Logo Preview" class="h-16 w-16 object-cover rounded" />
        </div>
      </div>

      <div class="flex space-x-2">
        <BaseButton type="submit" variant="teal" class="w-full" label="Simpan" />
        <BaseButton variant="warning" class="w-full" label="Cancel" @click="resetForm" />
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, default: null },
  mode: { type: String, required: true },
})

const emit = defineEmits(['save', 'edit', 'saveWithFormData', 'editWithFormData'])
const modalOpen = ref(false)

const store = useCompanyProfileStore()

const formPayload = reactive({ ...store.formPayload })

const logoPreview = ref(null)
const fileObj = ref(null)

watch(
  () => props.item,
  (newItem) => {
    if (props.mode === 'edit' && newItem) {
      Object.keys(store.formPayload || {}).forEach((key) => {
        formPayload[key] = newItem[key] || ''
      })
      logoPreview.value = newItem.logoUrl ? `${__BASE_URL__}${newItem.logoUrl}` : null
      fileObj.value = null
    } else if (props.mode === 'create') {
      Object.keys(store.formPayload || {}).forEach((key) => {
        formPayload[key] = store.formPayload[key]
      })
      logoPreview.value = null
      fileObj.value = null
    }
  },
  { immediate: true },
)

function handleFileUpload(file) {
  if (file) {
    fileObj.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function submitForm() {
  modalOpen.value = false

  if (fileObj.value) {
    const formData = new FormData()
    Object.keys(formPayload).forEach((key) => {
      if (key === 'logoUrl') {
        formData.append('logoUrl', fileObj.value)
      } else {
        formData.append(key, formPayload[key])
      }
    })
    emit(props.mode === 'create' ? 'saveWithFormData' : 'editWithFormData', formData)
  } else {
    emit(props.mode === 'create' ? 'save' : 'edit', { ...formPayload })
  }
}

function resetForm() {
  modalOpen.value = false
  store.resetForm()
  logoPreview.value = null
  fileObj.value = null
}
</script>
