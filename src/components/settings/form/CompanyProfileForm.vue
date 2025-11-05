<template>
  <BaseModal
    v-model="modalOpen"
    :title="mode === 'create' ? 'Tambah Profil' : 'Edit Profil'"
    size="md"
  >
    <form @submit.prevent="submitForm" class="space-y-5">
      <BaseInput label="Name" v-model="formPayload.name" placeholder="Name" />
      <BaseInput label="About" v-model="formPayload.about" placeholder="About" />
      <BaseInput label="Email" v-model="formPayload.email" placeholder="Email" />
      <BaseInput label="Phone" v-model="formPayload.phone" placeholder="Phone" />
      <BaseInput label="Address" v-model="formPayload.address" placeholder="Address" />

      <BaseInput label="Hero Title" v-model="formPayload.heroTitle" placeholder="Hero Title" />
      <BaseInput label="Hero Subtitle" v-model="formPayload.heroSubtitle" placeholder="Hero Subtitle" />
      <BaseInput label="CTA Text" v-model="formPayload.ctaText" placeholder="CTA Text" />
      <BaseInput label="CTA URL" v-model="formPayload.ctaUrl" placeholder="CTA URL" />

      <!-- Logo Upload -->
      <BaseInput
        id="logo-file"
        label="Logo"
        type="file"
        @update:file="handleFileUpload('logo', $event)"
        key="logo-input"
      />
      <div v-if="logoPreview" class="mt-2 flex justify-center items-center">
        <img :src="getPreview(logoPreview)" class="h-20 w-20 object-cover rounded shadow" />
      </div>

      <!-- Hero Upload -->
      <BaseInput
        id="hero-file"
        label="Hero Image"
        type="file"
        @update:file="handleFileUpload('hero', $event)"
        key="hero-input"
      />
      <div v-if="heroPreview" class="mt-2 flex justify-center items-center">
        <img :src="getPreview(heroPreview)" class="h-20 w-20 object-cover rounded shadow" />
      </div>

      <!-- QRIS Upload -->
      <BaseInput
        id="qris-file"
        label="QRIS Image"
        type="file"
        @update:file="handleFileUpload('qris', $event)"
        key="qris-input"
      />
      <div v-if="qrisPreview" class="mt-2 flex justify-center items-center">
        <img :src="getPreview(qrisPreview)" class="h-20 w-20 object-cover rounded shadow" />
      </div>

      <!-- Socials -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BaseInput label="Facebook URL" v-model="formPayload.facebookUrl" />
        <BaseInput label="Instagram URL" v-model="formPayload.instagramUrl" />
        <BaseInput label="Twitter URL" v-model="formPayload.twitterUrl" />
        <BaseInput label="LinkedIn URL" v-model="formPayload.linkedinUrl" />
        <BaseInput label="TikTok URL" v-model="formPayload.tiktokUrl" />
      </div>

      <BaseInput label="Slug" v-model="formPayload.slug" placeholder="Slug" />
      <BaseInput label="Meta Title" v-model="formPayload.metaTitle" placeholder="Meta Title" />
      <BaseInput label="Meta Description" v-model="formPayload.metaDescription" placeholder="Meta Description" />

      <div class="flex space-x-3 pt-4">
        <BaseButton
          type="submit"
          variant="teal"
          class="w-full"
          label="Simpan"
          icon="fa-solid fa-floppy-disk"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
const props = defineProps({ item: Object, mode: String })
const emit = defineEmits(['saveWithFormData', 'editWithFormData'])
const modalOpen = ref(false)
const store = useCompanyProfileStore()

const formPayload = reactive({ ...store.formPayload })
const files = reactive({ logo: null, hero: null, qris: null })

const logoPreview = ref(null)
const heroPreview = ref(null)
const qrisPreview = ref(null)

function handleFileUpload(type, file) {
  if (!file) return

  files[type] = file
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (type === 'logo') logoPreview.value = result
    if (type === 'hero') heroPreview.value = result
    if (type === 'qris') qrisPreview.value = result
  }
  reader.readAsDataURL(file)
 
  const input = document.getElementById(`${type}-file`)
  if (input) input.value = ''
}

function getPreview(path) {
  if (!path) return ''
  if (typeof path !== 'string') return ''
  return path.startsWith('data:') || path.startsWith('blob:') ? path : `${__BASE_URL__}${path}`
}

function submitForm() {
  modalOpen.value = false
  const formData = new FormData()
  Object.keys(formPayload).forEach((key) => {
    formData.append(key, formPayload[key] || '')
  })
  if (files.logo) formData.append('logoUrl', files.logo)
  if (files.hero) formData.append('heroImageUrl', files.hero)
  if (files.qris) formData.append('qrisImageUrl', files.qris)

  emit(props.mode === 'create' ? 'saveWithFormData' : 'editWithFormData', formData)
}

watch(
  () => props.item,
  (newItem) => {
    if (props.mode === 'edit' && newItem) {
      Object.assign(formPayload, newItem)
      logoPreview.value = newItem.logoUrl || null
      heroPreview.value = newItem.heroImageUrl || null
      qrisPreview.value = newItem.qrisImageUrl || null
      files.logo = files.hero = files.qris = null
    } else if (props.mode === 'create') {
      store.resetForm()
      logoPreview.value = heroPreview.value = qrisPreview.value = null
      files.logo = files.hero = files.qris = null
    }
  },
  { immediate: true },
)
</script>
