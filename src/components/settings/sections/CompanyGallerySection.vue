<template>
  <div>
    <BaseSlider
      v-model:selected="selectedSlide"
      :slides="items"
      :slidesPerView="1"
      :showCaption="true"
      :pagination="{ clickable: true }"
      @slideClick="goToPage"
      class="mb-3"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="p-4 rounded-xl shadow-md relative"
        :class="themeClass.baseDiv.secondary"
      >
        <img
          :src="`${__BASE_URL__}${item.imageUrl}`"
          alt="gallery"
          class="w-full h-48 object-cover rounded-lg mb-3"
        />
        <h3 class="text-lg font-semibold mb-2">{{ item.caption }}</h3>

        <div class="flex justify-end space-x-2">
          <BaseButton @click="openEditModal(item)" icon="edit" size="sm" variant="mist" />
          <BaseButton @click="deleteItem(item.id)" icon="trash" size="sm" variant="danger" />
        </div>
      </div>

      <div
        class="flex items-center justify-center p-4 rounded-xl border-2 border-dashed cursor-pointer"
        :class="[themeClass.border.dark, themeClass.hover.secondary]"
        @click="openEditModal(null)"
      >
        <span :class="themeClass.text.secondary">+ Add New Gallery</span>
      </div>
    </div>

    <CompanyGalleryForm
      v-model="modalOpen"
      :item="currentItem"
      :mode="modalMode"
      @save="handleSave"
      @edit="handleEdit"
      @saveWithFormData="handleSaveWithFormData"
      @editWithFormData="handleEditWithFormData"
    />
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
