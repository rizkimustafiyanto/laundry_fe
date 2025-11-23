<template>
  <div
    :class="[themeClass.baseDiv.secondary, 'p-6 rounded-xl shadow-lg backdrop-blur-md space-y-4']"
  >
    <div v-for="(group, type) in groupedItems" :key="type" class="space-y-2">
      <h2 class="text-xl font-bold" :class="themeClass.text.primary">
        {{ typeLabel(type) }}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          v-for="item in group"
          :key="item.id"
          class="p-4 rounded-xl shadow-md backdrop-blur-md group flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          :class="themeClass.baseDiv.mist"
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

          <p v-if="item.description" class="text-sm opacity-70 line-clamp-2">
            {{ item.description }}
          </p>
        </div>

        <div
          v-if="group.length === 0"
          class="col-span-full rounded-xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center space-y-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          :class="[themeClass.border.secondary, themeClass.baseDiv.secondary]"
        >
          <i class="fa-regular fa-image text-5xl opacity-40" :class="themeClass.text.secondary"></i>

          <p class="text-base font-semibold tracking-wide" :class="themeClass.text.secondary">
            Belum ada gambar
          </p>

          <p class="text-sm opacity-60">Silakan tambahkan media untuk mengisi bagian ini</p>

          <BaseButton
            v-if="type === MAIN_TYPE"
            @click="openEditModal(null, type)"
            icon="fa-solid fa-plus"
            size="sm"
            class="mt-4"
            variant="secondary"
          >
            Tambah {{ typeLabel(type) }}
          </BaseButton>
        </div>

        <div
          v-if="type === MAIN_TYPE"
          class="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
          :class="themeClass.border.secondary"
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

const MAIN_TYPE = 'BG_MAIN'
const GENERAL_TYPE = 'GENERAL'

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

const groupedItems = computed(() => {
  const groups = {
    [GENERAL_TYPE]: [],
    [MAIN_TYPE]: [],
  }

  for (const item of items.value) {
    if (item.type === MAIN_TYPE) {
      groups[MAIN_TYPE].push(item)
    } else {
      groups[GENERAL_TYPE].push(item)
    }
  }

  return groups
})

const typeLabel = (type) => {
  const labels = {
    [MAIN_TYPE]: 'Background Picture',
    [GENERAL_TYPE]: 'General',
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
