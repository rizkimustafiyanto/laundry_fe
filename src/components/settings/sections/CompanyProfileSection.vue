<template>
  <div class="p-6 rounded shadow" :class="[themeClass.baseDiv.glass]">
    <div v-if="items.length === 0" class="flex justify-end mb-4">
      <BaseButton @click="openCreateModal" label="Add New" variant="secondary" size="sm" />
    </div>

    <ul class="space-y-2">
      <li
        v-for="c in items"
        :key="c.id"
        class="border py-2 px-4 rounded-lg shadow-sm flex items-center"
        :class="themeClass.borderColor"
      >
        <div class="flex justify-between items-center w-full">
          <div class="text-lg">{{ c.name }} - {{ c.email }}</div>
          <div class="space-x-2">
            <BaseButton @click="openEditModal(c)" icon="edit" size="md" variant="secondary" />
            <BaseButton @click="deleteItem(c.id)" icon="trash" size="md" variant="danger" />
          </div>
        </div>
      </li>
    </ul>

    <!-- Modal Form -->
    <CompanyProfileForm
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
import CompanyProfileForm from '../form/CompanyProfileForm.vue'

const store = useCompanyProfileStore()
const { items } = storeToRefs(store)
const themeClass = useThemeClass()
const modalOpen = ref(false)
const modalMode = ref('create')
const currentItem = ref(null)

store.fetchItems()

const openCreateModal = () => {
  modalMode.value = 'create'
  currentItem.value = null
  store.resetForm()
  modalOpen.value = true
}

const openEditModal = (item) => {
  modalMode.value = 'edit'
  currentItem.value = { ...item }
  modalOpen.value = true
}

const handleSave = () => {
  store.createItem()
  modalOpen.value = false
}

const handleEdit = () => {
  store.updateItem(currentItem.value.id)
  modalOpen.value = false
}

const handleSaveWithFormData = (formData) => {
  store.createItemWithFormData(formData)
  modalOpen.value = false
}

const handleEditWithFormData = (formData) => {
  store.updateItemWithFormData(currentItem.value.id, formData)
  modalOpen.value = false
}

const deleteItem = (id) => store.deleteItem(id)
</script>
