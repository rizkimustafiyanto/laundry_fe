<template>
  <BaseModal
    v-model="modalOpen"
    :title="mode === 'create' ? 'Tambah Konten Baru' : 'Edit Konten'"
    size="md"
  >
    <form @submit.prevent="submitForm" class="space-y-5">
      <BaseSelect
        label="Tipe Konten"
        v-model="formPayload.type"
        :options="contentTypes"
        placeholder="Pilih tipe konten"
        :disabled="mode === 'edit'"
      />

      <BaseInput label="Judul" v-model="formPayload.title" placeholder="Masukkan judul konten" />

      <BaseInput
        v-if="['ABOUT', 'HERO'].includes(formPayload?.type)"
        label="Sub Judul"
        v-model="formPayload.subtitle"
        placeholder="Masukkan sub judul"
      />

      <BaseInput
        type="textarea"
        label="Deskripsi"
        v-model="formPayload.description"
        placeholder="Masukkan deskripsi"
      />

      <BaseSelect
        v-if="['SERVICE', 'FEATURE'].includes(formPayload?.type)"
        label="Ikon (opsional)"
        v-model="formPayload.icon"
        :options="availableIcons"
        placeholder="Pilih ikon"
      >
        <template #option="{ option }">
          <div class="flex items-center gap-2">
            <i :class="option.value" class="text-lg"></i>
            <span>{{ option.label }}</span>
          </div>
        </template>

        <template #selected="{ option }">
          <div class="flex items-center gap-2">
            <i :class="option.value" class="text-lg"></i>
            <span>{{ option.label }}</span>
          </div>
        </template>
      </BaseSelect>


      <BaseInput
        v-if="formPayload.type === 'TESTIMONIAL'"
        type="number"
        label="Rating (opsional)"
        v-model="formPayload.rating"
        min="1"
        max="5"
        placeholder="Masukkan rating (1-5)"
      />

      <div>
        <BaseInput id="media-upload" label="File" type="file" @update:file="handleFileUpload" />
        <div v-if="previewImage" class="mt-2 flex justify-center items-center">
          <img
            :src="
              previewImage.startsWith('data:') ? previewImage : `${__BASE_URL__}${previewImage}`
            "
            alt="Preview"
            class="h-20 w-20 object-cover rounded shadow"
          />
        </div>
      </div>

      <BaseInput
        type="number"
        label="Urutan Tampil (opsional)"
        v-model="formPayload.order"
        min="1"
        placeholder="Masukkan urutan tampil"
      />

      <div class="flex gap-3">
        <BaseButton
          type="submit"
          variant="teal"
          class="flex-1"
          label="Simpan"
          icon="fa-solid fa-floppy-disk"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  mode: { type: String, required: true },
})
const emit = defineEmits(['save', 'edit'])

const modalOpen = defineModel()
const store = useCompanyContentStore()
const mediaStore = useCompanyMediaStore()
const profileStore = useCompanyProfileStore()

const companyId = computed(() => profileStore.items[0]?.id || null)
const { formPayload } = storeToRefs(store)

const previewImage = ref(null)

const contentTypes = [
  { label: 'Hero', value: 'HERO' },
  { label: 'About', value: 'ABOUT' },
  { label: 'Service', value: 'SERVICE' },
  { label: 'Feature', value: 'FEATURE' },
  { label: 'Testimonial', value: 'TESTIMONIAL' },
  { label: 'Sponsor', value: 'SPONSOR' },
]

async function handleFileUpload(file) {
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)
  formData.append('companyId', companyId.value)
  formData.append('type', formPayload.value.type || 'GENERAL')

  const uploaded = await mediaStore.createItemWithFormData(formData)
  formPayload.value.mediaId = uploaded.id
  previewImage.value = uploaded.url
}

function submitForm() {
  formPayload.value.companyId = companyId.value
  emit(props.mode === 'create' ? 'save' : 'edit')
}

const availableIcons = [
  { label: 'Antar Jemput Laundry', value: 'fa-solid fa-truck', icon: 'fa-solid fa-truck' },
  { label: 'Kurir Motor', value: 'fa-solid fa-motorcycle', icon: 'fa-solid fa-motorcycle' },
  { label: 'Cepat & Efisien', value: 'fa-solid fa-bolt', icon: 'fa-solid fa-bolt' },
  { label: 'Selesai Tepat Waktu', value: 'fa-solid fa-clock', icon: 'fa-solid fa-clock' },
  { label: 'Cuci Bersih', value: 'fa-solid fa-soap', icon: 'fa-solid fa-soap' },
  { label: 'Air Bersih', value: 'fa-solid fa-droplet', icon: 'fa-solid fa-droplet' },
  { label: 'Pakaian Rapi', value: 'fa-solid fa-shirt', icon: 'fa-solid fa-shirt' },
  { label: 'Kualitas Terbaik', value: 'fa-solid fa-star', icon: 'fa-solid fa-star' },
  { label: 'Harga Terjangkau', value: 'fa-solid fa-tag', icon: 'fa-solid fa-tag' },
  { label: 'Pelayanan Ramah', value: 'fa-solid fa-user', icon: 'fa-solid fa-user' },
  { label: 'Promo Menarik', value: 'fa-solid fa-gift', icon: 'fa-solid fa-gift' },
  { label: 'Lokasi Mudah', value: 'fa-solid fa-location-dot', icon: 'fa-solid fa-location-dot' },
  { label: 'Bantuan / CS', value: 'fa-solid fa-comments', icon: 'fa-solid fa-comments' },
  { label: 'Telepon / Pemesanan', value: 'fa-solid fa-phone', icon: 'fa-solid fa-phone' },
  { label: 'Langganan / Paket', value: 'fa-solid fa-list', icon: 'fa-solid fa-list' },
]

</script>
