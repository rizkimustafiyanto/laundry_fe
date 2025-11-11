<template>
  <div :class="[themeClass.baseDiv.secondary, 'p-6 rounded-xl shadow-lg backdrop-blur-md']">
    <div class="flex items-center mb-6">
      <BaseButton
        variant="sky"
        size="sm"
        class="flex items-center gap-2 w-full"
        icon="fa-solid fa-plus"
        label="Tambah Konten"
        @click="openEditModal(null)"
      />
    </div>

    <div
      v-if="!Object.keys(groupedContent).length"
      class="text-center py-10 text-gray-500 italic"
      :class="themeClass.text.muted"
    >
      Belum ada konten. Klik tombol <strong>Tambah Konten</strong> di atas untuk memulai.
    </div>

    <div v-else>
      <div v-for="(group, type) in groupedContent" :key="type" class="mb-10">
        <h3 class="text-lg font-bold mb-3 flex items-center gap-2" :class="themeClass.text.primary">
          <i class="fa-solid fa-layer-group"></i>
          {{ typeLabel(type) }}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="item in group"
            :key="item.id"
            class="p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3 relative"
            :class="[themeClass.baseDiv.mist, themeClass.border.dark]"
          >
            <div v-if="item.media?.url" class="relative w-full h-40 rounded-lg overflow-hidden">
              <img
                :src="`${__BASE_URL__}${item.media.url}`"
                :alt="item.title || 'content image'"
                class="object-cover w-full h-full"
              />
            </div>

            <div class="flex flex-col flex-1">
              <div class="flex items-center gap-3 mb-2">
                <i v-if="item.icon" :class="[item.icon, 'text-2xl']"></i>
                <h4 class="font-semibold" :class="themeClass.text.secondary">
                  {{ item.title }}
                </h4>
              </div>

              <p v-if="item.subtitle" class="text-sm" :class="themeClass.text.info">
                {{ item.subtitle }}
              </p>

              <p
                v-if="item.description"
                class="text-sm mt-1 leading-relaxed"
                :class="themeClass.text.muted"
              >
                {{ item.description }}
              </p>

              <p v-if="item.rating" class="text-sm mt-1 text-yellow-500">⭐ {{ item.rating }}/5</p>
            </div>

            <div class="flex justify-end gap-2 mt-3">
              <BaseButton
                variant="dark"
                size="sm"
                title="Edit Konten"
                @click="openEditModal(item)"
                icon="fa-solid fa-pen"
              />
              <BaseButton
                variant="danger"
                size="sm"
                title="Hapus Konten"
                @click="deleteItem(item.id)"
                icon="fa-solid fa-trash"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <teleport to="body">
      <CompanyContentForm
        v-model="modalOpen"
        :mode="modalMode"
        @save="handleSave"
        @edit="handleEdit"
      />
    </teleport>
  </div>
</template>

<script setup>
import CompanyContentForm from '../form/CompanyContentForm.vue'

const store = useCompanyContentStore()
const { items } = storeToRefs(store)
const themeClass = useThemeClass()

const modalOpen = ref(false)
const modalMode = ref('edit')

const groupedContent = computed(() => {
  const groups = {}
  for (const item of items.value) {
    if (!groups[item.type]) groups[item.type] = []
    groups[item.type].push(item)
  }
  for (const key in groups) {
    groups[key].sort((a, b) => (a.order || 0) - (b.order || 0))
  }
  return groups
})

const typeLabel = (type) => {
  const labels = {
    HERO: 'Hero Section',
    ABOUT: 'Tentang Kami',
    SERVICE: 'Layanan / Services',
    FEATURE: 'Fitur Unggulan',
    TESTIMONIAL: 'Testimonial Pelanggan',
    SPONSOR: 'Sponsor / Partner',
  }
  return labels[type] || type
}

const openEditModal = (item) => {
  if (!item) store.resetForm()
  if (item) store.formPayload = { ...item }
  modalMode.value = item ? 'edit' : 'create'
  modalOpen.value = true
}

const handleSave = async () => {
  await store.createItem()
  modalOpen.value = false
}

const handleEdit = async () => {
  await store.updateItem(store.formPayload.id)
  modalOpen.value = false
}

const deleteItem = async (id) => {
  await store.deleteItem(id)
}

onBeforeMount(async () => {
  await store.fetchItems()
})
</script>
