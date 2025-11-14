<template>
  <div class="space-y-10">
    <div v-for="(group, type) in groupedItems" :key="type" class="space-y-2">
      <h2 class="text-xl font-bold" :class="themeClass.text.primary">
        {{ typeLabel(type) }}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="item in group"
          :key="item.id"
          class="p-4 rounded-xl shadow-md backdrop-blur-md group flex flex-col transition hover:shadow-lg"
          :class="themeClass.baseDiv.secondary"
        >
          <div class="relative">
            <img
              :src="`${__BASE_URL__}${item.url}`"
              alt="media"
              class="w-full h-48 object-cover rounded-lg shadow-sm transition-transform duration-200 group-hover:scale-[1.02]"
            />

            <div
              class="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition"
            >
              <BaseButton
                @click="openEditModal(item)"
                icon="fa-solid fa-pen"
                size="sm"
                variant="secondary"
                :title="`Edit ${item.title}`"
              />
              <BaseButton
                @click="deleteItem(item.id)"
                icon="fa-solid fa-trash"
                size="sm"
                variant="danger"
                :title="`Hapus ${item.title}`"
              />
            </div>
          </div>

          <h3 class="text-lg font-semibold mt-3 line-clamp-2" :class="themeClass.text.secondary">
            {{ item.title }}
          </h3>
          <p v-if="item.description" class="text-sm text-gray-500 line-clamp-2">
            {{ item.description }}
          </p>
        </div>

        <div
          class="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer text-center transition hover:scale-[1.02]"
          :class="[themeClass.border.dark, themeClass.hover.secondary]"
          @click="openEditModal(null, type)"
        >
          <i class="fa-solid fa-plus text-2xl mb-2" :class="themeClass.icon.secondary"></i>
          <span class="text-sm font-medium" :class="themeClass.text.secondary">
            Tambah {{ typeLabel(type) }}
          </span>
        </div>
      </div>
    </div>

    <teleport to="body">
      <CompanyMediaForm
        v-model="modalOpen"
        :item="currentItem"
        :mode="modalMode"
        @saved="refresh"
      />
    </teleport>
  </div>
</template>

<script setup>
import CompanyMediaForm from '../form/CompanyMediaForm.vue'

const store = useCompanyMediaStore()
const { items } = storeToRefs(store)
const themeClass = useThemeClass()

const modalOpen = ref(false)
const modalMode = ref('edit')
const currentItem = ref(null)

const openEditModal = (item, defaultType = null) => {
  modalMode.value = item ? 'edit' : 'create'
  currentItem.value = item ? { ...item } : { type: defaultType }
  modalOpen.value = true
}

const deleteItem = async (id) => {
  await store.deleteItem(id)
  refresh()
}

const refresh = async () => {
  modalOpen.value = false
}

const ALL_MEDIA_TYPES = ['SPONSOR', 'TESTIMONI', 'BG_MAIN']

const groupedItems = computed(() => {
  const groups = {}

  for (const type of ALL_MEDIA_TYPES) {
    groups[type] = []
  }

  for (const item of items.value) {
    if (!groups[item.type]) {
      groups[item.type] = []
    }
    groups[item.type].push(item)
  }

  return groups
})

const typeLabel = (type) => {
  const labels = {
    SPONSOR: 'Sponsor',
    TESTIMONI: 'Testimoni',
    BG_MAIN: 'Background Picture',
  }
  return labels[type] || type
}

onBeforeMount(async () => {
  if (!items.value.length) {
    await store.fetchItems()
  }
  refresh()
})
</script>
