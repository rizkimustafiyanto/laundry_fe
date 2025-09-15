<template>
  <BaseModal
    v-model="modalOpen"
    :title="mode === 'create' ? 'Add New Sponsor' : 'Edit Sponsor'"
    size="md"
  >
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <BaseInput label="Image" type="file" @update:file="handleFileUpload" :required="false" />
        <div v-if="imagePreview" class="mt-2 flex justify-center items-center">
          <img
            :src="
              imagePreview.startsWith('data:') ? imagePreview : `${__BASE_URL__}${imagePreview}`
            "
            alt="Image Preview"
            class="h-20 w-20 object-cover rounded shadow"
          />
        </div>
      </div>
      <BaseInput
        label="Sponsor Name"
        autocomplete="off"
        v-model="formPayload.sponsorName"
        placeholder="Input Sponsor Name"
      />
      <BaseInput
        label="Website Url"
        autocomplete="off"
        v-model="formPayload.websiteUrl"
        placeholder="Input Website Url"
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

const store = useCompanySponsorStore()
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
      imagePreview.value = newItem.logoUrl ? newItem.logoUrl : null
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
      if (key === 'logoUrl') {
        formData.append('logoUrl', fileObj.value)
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
