<template>
  <div>
    <div
      v-if="!items || items.length === 0"
      class="p-8 rounded-xl shadow-md backdrop-blur-md flex flex-col items-center justify-center text-center border-2 border-dashed cursor-pointer hover:scale-[1.02] transition"
      :class="[themeClass.baseDiv.secondary, themeClass.border.dark, themeClass.hover.secondary]"
      @click="openEditModal()"
    >
      <span class="mb-3" :class="themeClass.text.secondary">No company profile yet</span>
      <BaseButton label="Create Company" size="md" variant="sky" icon="fa-solid fa-plus" />
    </div>

    <div
      v-else
      class="p-6 rounded-xl shadow-md backdrop-blur-md relative flex flex-col gap-6"
      :class="themeClass.baseDiv.secondary"
    >
      <div class="absolute top-7 right-7 z-10 hidden md:flex">
        <BaseButton
          @click="openEditModal(company)"
          label="Edit"
          icon="fa-solid fa-pen"
          size="sm"
          variant="secondary"
        />
      </div>

      <div class="flex absolute top-7 right-7 z-10 md:hidden justify-end">
        <BaseButton
          @click="openEditModal(company)"
          icon="fa-solid fa-pen"
          size="sm"
          variant="secondary"
        />
      </div>

      <div v-if="company.heroImageUrl" class="relative">
        <img
          :src="`${__BASE_URL__}${company.heroImageUrl}`"
          alt="Hero Image"
          class="w-full h-52 md:h-72 object-cover rounded-xl shadow"
        />
        <div
          class="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center text-white rounded-xl p-4"
        >
          <h2 class="text-2xl md:text-3xl font-bold">{{ company.heroTitle }}</h2>
          <p class="mt-2 max-w-2xl">{{ company.heroSubtitle }}</p>
          <a
            v-if="company.ctaText && company.ctaUrl"
            :href="company.ctaUrl"
            target="_blank"
            class="mt-4 inline-block bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg shadow"
          >
            {{ company.ctaText }}
          </a>
        </div>
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
            class="w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center border-2 text-sm"
            :class="[themeClass.border.airy, themeClass.text.secondary]"
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
              <i :class="['fa-solid fa-envelope', themeClass.icon.primary]"></i>
              <span class="font-semibold" :class="themeClass.text.dark">Email:</span>
              <span>{{ company.email }}</span>
            </div>
            <div class="flex gap-2 items-center" :class="themeClass.text.secondary">
              <i :class="['fa-solid fa-phone', themeClass.icon.success]"></i>
              <span class="font-semibold" :class="themeClass.text.dark">Phone:</span>
              <span>{{ company.phone }}</span>
            </div>
            <div class="flex gap-2 items-center sm:col-span-2" :class="themeClass.text.secondary">
              <i :class="['fa-solid fa-location-dot', themeClass.icon.danger]"></i>
              <span class="font-semibold" :class="themeClass.text.dark">Address:</span>
              <span>{{ company.address }}</span>
            </div>
          </div>

          <div class="flex flex-wrap justify-center items-center md:justify-start gap-4 mt-3">
            <a
              v-if="company.facebookUrl"
              :href="company.facebookUrl"
              target="_blank"
              :class="themeClass.icon.primary"
            >
              <i class="fa-brands fa-facebook text-xl"></i>
            </a>
            <a
              v-if="company.instagramUrl"
              :href="company.instagramUrl"
              target="_blank"
              :class="themeClass.icon.softPink"
            >
              <i class="fa-brands fa-instagram text-xl"></i>
            </a>
            <a
              v-if="company.twitterUrl"
              :href="company.twitterUrl"
              target="_blank"
              :class="themeClass.icon.info"
            >
              <i class="fa-brands fa-twitter text-xl"></i>
            </a>
            <a
              v-if="company.linkedinUrl"
              :href="company.linkedinUrl"
              target="_blank"
              :class="themeClass.icon.lilac"
            >
              <i class="fa-brands fa-linkedin text-xl"></i>
            </a>
            <a
              v-if="company.tiktokUrl"
              :href="company.tiktokUrl"
              target="_blank"
              :class="themeClass.icon.dark"
            >
              <i class="fa-brands fa-tiktok text-xl"></i>
            </a>
          </div>
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

onBeforeMount(async () => {
  if (!items.value.length) {
    await store.fetchItems()
  }
})
</script>
