<template>
  <div>
    <div
      v-if="!items || items.length === 0"
      class="p-8 rounded-xl shadow-md backdrop-blur-md flex flex-col items-center justify-center text-center border-2 border-dashed cursor-pointer hover:scale-[1.02] transition"
      :class="[themeClass.baseDiv.secondary, themeClass.border.dark, themeClass.hover.secondary]"
      @click="openEditModal()"
    >
      <span :class="themeClass.text.secondary" class="mb-3">No company profile yet</span>
      <BaseButton label="Create Company" size="md" variant="sky" icon="plus" />
    </div>

    <div
      v-else
      class="p-6 rounded-xl shadow-md backdrop-blur-md relative flex flex-col gap-6"
      :class="[themeClass.baseDiv.secondary]"
    >
      <div class="absolute top-4 right-4 hidden md:flex gap-2">
        <BaseButton
          @click="openEditModal(company)"
          label="Edit"
          icon="edit"
          size="sm"
          variant="secondary"
        />
        <BaseButton @click="deleteItem(company.id)" icon="trash" size="sm" variant="danger" />
      </div>

      <div class="flex md:hidden justify-end gap-2">
        <BaseButton @click="openEditModal(company)" icon="edit" size="sm" variant="secondary" />
      </div>

      <div class="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div class="flex-shrink-0">
          <img
            v-if="company.logoUrl"
            :src="`${__BASE_URL__}${company.logoUrl}`"
            alt="Company Logo"
            class="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 shadow-sm mx-auto md:mx-0"
          />
          <div
            v-else
            class="w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center border-2 border-gray-300 text-sm text-gray-500"
          >
            No Logo
          </div>
        </div>

        <div class="flex-1 space-y-3 text-center md:text-left">
          <h2 class="text-2xl font-bold">{{ company.name }}</h2>
          <p
            class="whitespace-pre-wrap break-words leading-relaxed"
            :class="themeClass.text.secondary"
          >
            {{ company.about }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div class="flex gap-2 items-center" :class="themeClass.text.secondary">
              <span class="font-semibold" :class="themeClass.text.dark">📧 Email:</span>
              <span>{{ company.email }}</span>
            </div>
            <div class="flex gap-2 items-center" :class="themeClass.text.secondary">
              <span class="font-semibold" :class="themeClass.text.dark">📞 Phone:</span>
              <span>{{ company.phone }}</span>
            </div>
            <div class="flex gap-2 items-center sm:col-span-2" :class="themeClass.text.secondary">
              <span class="font-semibold" :class="themeClass.text.dark">📍 Address:</span>
              <span>{{ company.address }}</span>
            </div>
          </div>

          <div class="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
            <a
              v-if="company.facebookUrl"
              :href="company.facebookUrl"
              target="_blank"
              :class="themeClass.text.primary"
            >
              <i class="fab fa-facebook text-xl"></i>
            </a>
            <a
              v-if="company.instagramUrl"
              :href="company.instagramUrl"
              target="_blank"
              :class="themeClass.text.pink"
            >
              <i class="fab fa-instagram text-xl"></i>
            </a>
            <a
              v-if="company.twitterUrl"
              :href="company.twitterUrl"
              target="_blank"
              :class="themeClass.text.info"
            >
              <i class="fab fa-twitter text-xl"></i>
            </a>
            <a
              v-if="company.linkedinUrl"
              :href="company.linkedinUrl"
              target="_blank"
              :class="themeClass.text.lilac"
            >
              <i class="fab fa-linkedin text-xl"></i>
            </a>
            <a
              v-if="company.tiktokUrl"
              :href="company.tiktokUrl"
              target="_blank"
              :class="themeClass.text.dark"
            >
              <i class="fab fa-tiktok text-xl"></i>
            </a>
          </div>
        </div>
      </div>

      <div v-if="company.galleries.length > 0" class="mt-4">
        <h3 class="font-semibold mb-3">Gallery</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <img
            v-for="(img, i) in company.galleries"
            :key="i"
            :src="`${__BASE_URL__}${img.imageUrl}`"
            class="w-full h-28 md:h-32 object-cover rounded-lg shadow-sm hover:scale-[1.03] transition"
          />
        </div>
      </div>
    </div>

    <teleport to="body">
      <CompanyProfileForm
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
