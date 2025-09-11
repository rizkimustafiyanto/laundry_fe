<template>
  <BaseModal
    v-model="modalOpen"
    :title="mode === 'create' ? 'Add New Gallery' : 'Edit Gallery'"
    size="md"
  >
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <BaseInput label="Image" type="file" @update:file="handleFileUpload" :required="false" />
        <div v-if="imagePreview" class="mt-2">
          <img :src="imagePreview" alt="Image Preview" class="h-16 w-16 object-cover rounded" />
        </div>
      </div>
      <BaseInput
        type="textarea"
        label="Caption"
        autocomplete="off"
        v-model="formPayload.caption"
        placeholder="Caption"
      />

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

const store = useCompanyGalleryStore()
const profileStore = useCompanyProfileStore()
const companyId = computed(() => profileStore.items[0]?.id || null)

const formPayload = reactive({ ...store.formPayload })

const imagePreview = ref(null)
const fileObj = ref(null)

watch(
  () => props.item,
  (newItem) => {
    if (props.mode === 'edit' && newItem) {
      Object.keys(store.formPayload || {}).forEach((key) => {
        formPayload[key] = newItem[key] || ''
      })
      imagePreview.value = newItem.logoUrl ? `${__BASE_URL__}${newItem.logoUrl}` : null
      fileObj.value = null
    } else if (props.mode === 'create') {
      Object.keys(store.formPayload || {}).forEach((key) => {
        formPayload[key] = store.formPayload[key]
      })
      imagePreview.value = null
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
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function submitForm() {
  modalOpen.value = false
  formPayload.companyId = companyId.value

  if (fileObj.value) {
    const formData = new FormData()
    Object.keys(formPayload).forEach((key) => {
      if (key === 'imageUrl') {
        formData.append('imageUrl', fileObj.value)
      } else {
        formData.append(key, formPayload[key])
      }
    })
    emit(props.mode === 'create' ? 'saveWithFormData' : 'editWithFormData', formData)
  } else {
    store.formPayload = formPayload
    emit(props.mode === 'create' ? 'save' : 'edit')
  }
}

function resetForm() {
  modalOpen.value = false
  store.resetForm()
  imagePreview.value = null
  fileObj.value = null
}
</script>
