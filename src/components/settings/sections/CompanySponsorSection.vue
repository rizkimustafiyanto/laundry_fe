<template>
  <div :class="[themeClass.baseDiv.secondary, 'p-6 rounded-xl shadow-lg backdrop-blur-md']">
    <h2 class="text-xl font-semibold mb-4">Company Sponsor</h2>

    <div class="space-y-4 mb-6">
      <div
        v-for="item in items"
        :key="item.id"
        :class="[
          themeClass.baseDiv.mist,
          'p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border',
          themeClass.border.dark,
        ]"
      >
        <div class="flex items-center gap-4 w-full sm:w-auto">
          <img
            v-if="item.logoUrl"
            :src="`${__BASE_URL__}${item.logoUrl}`"
            alt="Logo"
            class="w-12 h-12 object-contain rounded"
          />
          <div class="break-words">
            <h3 class="font-semibold">{{ item.sponsorName }}</h3>
            <a
              v-if="item.websiteUrl"
              :href="item.websiteUrl"
              target="_blank"
              class="text-sm text-blue-500 hover:underline"
            >
              {{ item.websiteUrl }}
            </a>
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <BaseButton variant="dark" :icon="'edit'" size="sm" @click="openEditModal(item)" />
          <BaseButton variant="danger" :icon="'trash'" size="sm" @click="deleteItem(item.id)" />
        </div>
      </div>
    </div>

    <BaseButton variant="sky" class="w-full mb-4" :icon="'plus'" @click="openEditModal(null)" />

    <CompanySponsorForm
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
import CompanySponsorForm from '../form/CompanySponsorForm.vue'

const store = useCompanySponsorStore()
const { items } = storeToRefs(store)
const themeClass = useThemeClass()

const modalOpen = ref(false)
const modalMode = ref('edit')
const currentItem = ref(null)

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

const deleteItem = async (id) => {
  if (confirm('Are you sure you want to delete this sponsor?')) {
    await store.deleteItem(id)
  }
}

onBeforeMount(async () => {
  if (!items.value.length) {
    await store.fetchItems()
  }
})
</script>
