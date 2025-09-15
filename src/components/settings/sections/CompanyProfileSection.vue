<template>
  <div>
    <div
      v-if="items.length === 0 || !items"
      class="p-6 rounded-xl shadow-lg backdrop-blur-md flex justify-center items-center"
      :class="[themeClass.baseDiv.secondary]"
    >
      <BaseButton @click="openEditModal()" label="Create Company" size="md" variant="mist" />
    </div>
    <div
      v-else
      class="p-6 rounded-xl shadow-lg backdrop-blur-md relative"
      :class="[themeClass.baseDiv.secondary]"
    >
      <div class="hidden md:flex absolute top-4 right-4 space-x-2">
        <BaseButton
          @click="openEditModal(company)"
          label="Edit Company"
          icon="edit"
          size="md"
          variant="secondary"
        />
        <BaseButton @click="deleteItem(company.id)" icon="trash" size="md" variant="danger" />
      </div>

      <div class="flex md:hidden justify-end space-x-2 mb-4">
        <BaseButton @click="openEditModal(company)" icon="edit" size="sm" variant="secondary" />
      </div>

      <div
        class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6"
      >
        <div class="flex-shrink-0">
          <img
            v-if="company.logoUrl"
            :src="`${__BASE_URL__}${company.logoUrl}`"
            alt="Company Logo"
            class="w-32 h-32 rounded-full object-cover border-2 shadow-md mx-auto md:mx-0"
          />
          <div
            v-else
            class="w-32 h-32 rounded-full flex items-center justify-center border-2 border-gray-300 mx-auto md:mx-0"
          >
            No Logo
          </div>
        </div>

        <div class="flex-1 w-full space-y-2">
          <h2 class="text-2xl font-bold text-center md:text-left">{{ company.name }}</h2>
          <p
            :class="themeClass.text.secondary"
            class="text-center md:text-left break-words whitespace-pre-wrap"
          >
            {{ company.about }}
          </p>

          <div class="text-sm text-gray-700 space-y-1 w-full">
            <div class="flex" :class="themeClass.text.secondary">
              <span class="font-semibold w-1/4 md:w-auto" :class="themeClass.text.dark">Email</span>
              <span class="w-3/4">: {{ company.email }}</span>
            </div>

            <div class="flex" :class="themeClass.text.secondary">
              <span class="font-semibold w-1/4 md:w-auto" :class="themeClass.text.dark">Phone</span>
              <span class="w-3/4">: {{ company.phone }}</span>
            </div>

            <div class="flex" :class="themeClass.text.secondary">
              <span class="font-semibold w-1/4 md:w-auto" :class="themeClass.text.dark"
                >Address</span
              >
              <span class="w-3/4">: {{ company.address }}</span>
            </div>
          </div>

          <div class="flex space-x-3 mt-2 flex-wrap justify-center md:justify-start w-full">
            <a
              v-if="company.facebookUrl"
              :href="company.facebookUrl"
              target="_blank"
              class="hover:underline"
              :class="themeClass.text.primary"
              >FB</a
            >
            <a
              v-if="company.instagramUrl"
              :href="company.instagramUrl"
              target="_blank"
              class="hover:underline"
              :class="themeClass.text.pink"
              >IG</a
            >
            <a
              v-if="company.twitterUrl"
              :href="company.twitterUrl"
              target="_blank"
              class="hover:underline"
              :class="themeClass.text.info"
              >TW</a
            >
            <a
              v-if="company.linkedinUrl"
              :href="company.linkedinUrl"
              target="_blank"
              class="hover:underline"
              :class="themeClass.text.lilac"
              >LN</a
            >
            <a
              v-if="company.tiktokUrl"
              :href="company.tiktokUrl"
              target="_blank"
              class="hover:underline"
              :class="themeClass.text.dark"
              >TT</a
            >
          </div>
        </div>
      </div>

      <div v-if="company.galleries.length > 0" class="mt-6">
        <h3 class="font-semibold mb-2">Gallery</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <img
            v-for="(img, i) in company.galleries"
            :key="i"
            :src="`${__BASE_URL__}${img.imageUrl}`"
            class="w-full h-32 object-cover rounded shadow-sm"
          />
        </div>
      </div>
    </div>
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
const modalMode = ref('edit')
const currentItem = ref(null)

const company = computed(() => items.value[0])

const openEditModal = (item) => {
  modalMode.value = item ? 'edit' : 'create'
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

onBeforeMount(async () => {
  if (!items.value.length) {
    await store.fetchItems()
  }
})
</script>
