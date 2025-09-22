<template>
  <div class="space-y-6">
    <BaseSlider
      v-model:selected="selectedSlide"
      :slides="items"
      :slidesPerView="1"
      :showCaption="true"
      :pagination="{ clickable: true }"
      @slideClick="goToPage"
      class="rounded-xl shadow-md overflow-hidden"
    />

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="item in items"
        :key="item.id"
        class="p-4 rounded-xl shadow-md backdrop-blur-md group flex flex-col"
        :class="themeClass.baseDiv.secondary"
      >
        <div class="relative">
          <img
            :src="`${__BASE_URL__}${item.imageUrl}`"
            alt="gallery"
            class="w-full h-48 object-cover rounded-lg shadow-sm transition group-hover:scale-[1.02]"
          />

          <div
            class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition"
          >
            <BaseButton @click="openEditModal(item)" icon="edit" size="sm" variant="secondary" />
            <BaseButton @click="deleteItem(item.id)" icon="trash" size="sm" variant="danger" />
          </div>
        </div>

        <h3 class="text-lg font-semibold mt-3 line-clamp-2">{{ item.caption }}</h3>
      </div>

      <div
        class="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer text-center hover:scale-[1.02] transition"
        :class="[themeClass.border.dark, themeClass.hover.secondary]"
        @click="openEditModal(null)"
      >
        <span class="text-2xl font-bold" :class="themeClass.text.secondary">+</span>
        <span class="mt-2 text-sm" :class="themeClass.text.secondary">Add New Gallery</span>
      </div>
    </div>

    <teleport to="body">
      <CompanyGalleryForm
        v-model="modalOpen"
        :item="currentItem"
        :mode="modalMode"
        @save="handleSave"
        @edit="handleEdit"
        @saveWithFormData="handleSaveWithFormData"
        @editWithFormData="handleEditWithFormData"
      />
    </teleport>
  </div>
</template>

<script setup>
import CompanyGalleryForm from '../form/CompanyGalleryForm.vue'

const store = useCompanyGalleryStore()
const { items } = storeToRefs(store)
const themeClass = useThemeClass()

const modalOpen = ref(false)
const modalMode = ref('edit')
const currentItem = ref(null)
const selectedSlide = ref(null)

const openEditModal = (item) => {
  modalMode.value = item ? 'edit' : 'create'
  currentItem.value = item ? { ...item } : null
  modalOpen.value = true
}

const handleSave = async () => {
  await store.createItem()
  modalOpen.value = false
}

const handleEdit = async () => {
  await store.updateItem(currentItem.value.id)
  modalOpen.value = false
}

const handleSaveWithFormData = async (formData) => {
  await store.createItemWithFormData(formData)
  modalOpen.value = false
}

const handleEditWithFormData = async (formData) => {
  await store.updateItemWithFormData(currentItem.value.id, formData)
  modalOpen.value = false
}

const deleteItem = (id) => store.deleteItem(id)

const goToPage = (slide) => {
  if (slide.link) {
    window.open(slide.link, '_blank')
  } else {
    openEditModal(slide)
  }
}

onBeforeMount(async () => {
  if (!items.value.length) {
    await store.fetchItems()
  }
})
</script>
