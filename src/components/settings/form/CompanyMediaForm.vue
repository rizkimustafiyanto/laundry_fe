<template>
  <BaseModal
    v-model="modalOpen"
    :title="mode === 'create' ? 'Add New Media' : 'Edit Media'"
    size="md"
  >
    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Upload -->
      <BaseInput id="media-upload" label="File" type="file" @update:file="handleFileUpload" />
      <div v-if="imagePreview" class="mt-2 flex justify-center items-center">
        <img
          :src="imagePreview.startsWith('data:') ? imagePreview : `${__BASE_URL__}${imagePreview}`"
          alt="Preview"
          class="h-20 w-20 object-cover rounded shadow"
        />
      </div>

      <!-- Type -->
      <BaseSelect
        label="Media Type"
        v-model="formPayload.type"
        :options="mediaTypeOptions"
        placeholder="Pilih tipe media"
        required
      />

      <!-- Title -->
      <BaseInput label="Title" v-model="formPayload.title" placeholder="Judul media" />

      <!-- Description -->
      <BaseInput
        type="textarea"
        label="Description"
        v-model="formPayload.description"
        placeholder="Deskripsi media"
      />

      <div class="flex space-x-2">
        <BaseButton type="submit" variant="teal" class="w-full" label="Simpan" />
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  item: { type: Object, default: null },
  mode: { type: String, required: true },
})

const emit = defineEmits(['saved'])
const modalOpen = ref(false)

const store = useCompanyMediaStore()
const profileStore = useCompanyProfileStore()
const companyId = computed(() => profileStore.items[0]?.id || null)

const formPayload = reactive({
  companyId: companyId.value,
  type: '',
  title: '',
  description: '',
  url: '',
  order: 0,
})

const mediaTypeOptions = [
  { value: 'SPONSOR', label: 'Sponsor' },
  { value: 'TESTIMONI', label: 'Testimoni' },
  { value: 'BG_MAIN', label: 'Background Image Landing Page' },
]

const imagePreview = ref(null)
const fileObj = ref(null)

watch(
  () => props.item,
  (newItem) => {
    if (props.mode === 'edit' && newItem) {
      Object.assign(formPayload, newItem)
      imagePreview.value = newItem.url || null
      fileObj.value = null
    } else if (props.mode === 'create') {
      Object.keys(formPayload).forEach((k) => (formPayload[k] = ''))
      formPayload.companyId = companyId.value
      imagePreview.value = null
      fileObj.value = null
    }
  },
  { immediate: true },
)

function handleFileUpload(file) {
  if (!file) return
  fileObj.value = file
  const reader = new FileReader()
  reader.onload = (e) => (imagePreview.value = e.target.result)
  reader.readAsDataURL(file)
}

async function submitForm() {
  modalOpen.value = false
  formPayload.companyId = companyId.value

  if (fileObj.value) {
    const formData = new FormData()
    Object.entries(formPayload).forEach(([k, v]) => formData.append(k, v ?? ''))
    formData.set('url', fileObj.value)

    if (props.mode === 'create') {
      await store.createItemWithFormData(formData)
    } else {
      await store.updateItemWithFormData(props.item.id, formData)
    }
  } else {
    if (props.mode === 'create') {
      await store.createItem(formPayload)
    } else {
      await store.updateItem(props.item.id, formPayload)
    }
  }

  emit('saved')
}
</script>
