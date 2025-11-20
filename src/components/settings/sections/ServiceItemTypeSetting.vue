<template>
  <div>
    <BaseLoadingSpinner v-if="isPrepare" type="mini" class="mx-auto my-10" />

    <div v-else>
      <h2
        class="text-2xl font-bold mt-8 mb-6 flex items-center gap-2"
        :class="themeClass.text.secondary"
      >
        <i :class="['fa-solid fa-gear', themeClass.icon.primary]"></i>
        Service & Item Type Settings
      </h2>

      <div class="grid md:grid-cols-2 gap-6">
        <BaseCard variant="dark" class="p-5 space-y-4 rounded-xl shadow-sm">
          <h3
            class="text-lg font-semibold flex items-center gap-2"
            :class="themeClass.text.secondary"
          >
            <i :class="['fa-solid fa-hand-holding-droplet', themeClass.icon.info]"></i>
            Service Types
          </h3>

          <BaseInput
            label="Nama Service Type"
            v-model="serviceTypeForm.name"
            placeholder="Contoh: Laundry, Dry Clean"
          />

          <BaseInput
            label="Deskripsi Service Type"
            v-model="serviceTypeForm.description"
            placeholder="Tulis disini ..."
          />

          <div class="flex justify-end gap-2">
            <BaseButton
              label="Reset"
              variant="secondary"
              size="sm"
              icon="fa-solid fa-rotate-left"
              @click="resetServiceTypeForm"
            />
            <BaseButton
              :label="serviceTypeForm.id ? 'Update' : 'Simpan'"
              variant="teal"
              size="sm"
              icon="fa-solid fa-save"
              @click="saveServiceType"
            />
          </div>

          <div class="overflow-x-auto mt-4">
            <table class="w-full text-sm border-collapse rounded-lg overflow-hidden">
              <thead :class="themeClass.baseDiv.secondary">
                <tr>
                  <th class="text-left px-3 py-2 font-medium" :class="themeClass.text.secondary">
                    Nama
                  </th>
                  <th class="text-right px-3 py-2 font-medium" :class="themeClass.text.secondary">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="st in serviceTypeStore.items"
                  :key="st.id"
                  class="border-t transition hover:bg-gray-800/30"
                  :class="themeClass.border.airy"
                >
                  <td class="px-3 py-2" :class="themeClass.text.secondary">
                    {{ formatText(st.name) }}
                  </td>
                  <td class="px-3 py-2 text-right space-x-2">
                    <BaseButton
                      size="xs"
                      variant="secondary"
                      icon="fa-solid fa-pen"
                      @click="editServiceType(st)"
                      title="Edit"
                    />
                    <BaseButton
                      size="xs"
                      variant="danger"
                      icon="fa-solid fa-trash"
                      @click="serviceTypeStore.deleteItem(st.id)"
                      title="Hapus"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseCard>

        <BaseCard variant="dark" class="p-5 space-y-4 rounded-xl shadow-sm">
          <h3
            class="text-lg font-semibold flex items-center gap-2"
            :class="themeClass.text.secondary"
          >
            <i :class="['fa-solid fa-shirt', themeClass.icon.warning]"></i>
            Item Types
          </h3>

          <BaseInput
            label="Nama Item Type"
            v-model="itemTypeForm.name"
            placeholder="Contoh: Pakaian, Sprei"
          />

          <BaseInput
            label="Deskripsi Item Type"
            v-model="itemTypeForm.description"
            placeholder="Tulis disini ..."
          />

          <div class="flex justify-end gap-2">
            <BaseButton
              label="Reset"
              variant="secondary"
              size="sm"
              icon="fa-solid fa-rotate-left"
              @click="resetItemTypeForm"
            />
            <BaseButton
              :label="itemTypeForm.id ? 'Update' : 'Simpan'"
              variant="teal"
              size="sm"
              icon="fa-solid fa-save"
              @click="saveItemType"
            />
          </div>

          <div class="overflow-x-auto mt-4">
            <table class="w-full text-sm border-collapse rounded-lg overflow-hidden">
              <thead :class="themeClass.baseDiv.secondary">
                <tr>
                  <th class="text-left px-3 py-2 font-medium" :class="themeClass.text.secondary">
                    Nama
                  </th>
                  <th class="text-right px-3 py-2 font-medium" :class="themeClass.text.secondary">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="it in itemTypeStore.items"
                  :key="it.id"
                  class="border-t transition hover:bg-gray-800/30"
                  :class="themeClass.border.airy"
                >
                  <td class="px-3 py-2" :class="themeClass.text.secondary">
                    {{ formatText(it.name) }}
                  </td>
                  <td class="px-3 py-2 text-right space-x-2">
                    <BaseButton
                      size="xs"
                      variant="secondary"
                      icon="fa-solid fa-pen"
                      @click="editItemType(it)"
                      title="Edit"
                    />
                    <BaseButton
                      size="xs"
                      variant="danger"
                      icon="fa-solid fa-trash"
                      @click="itemTypeStore.deleteItem(it.id)"
                      title="Hapus"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
const themeClass = useThemeClass()

const serviceTypeStore = useServiceTypeStore()
const itemTypeStore = useItemTypeStore()

const isPrepare = ref(true)

const serviceTypeForm = reactive({
  id: null,
  name: '',
  description: '',
})

const resetServiceTypeForm = () => {
  serviceTypeForm.id = null
  serviceTypeForm.name = ''
  serviceTypeForm.description = ''
}

const saveServiceType = async () => {
  serviceTypeStore.formPayload = { ...serviceTypeForm }
  if (serviceTypeForm.id) {
    await serviceTypeStore.updateItem()
  } else {
    await serviceTypeStore.createItem()
  }
  resetServiceTypeForm()
}

const editServiceType = (st) => {
  serviceTypeForm.id = st.id
  serviceTypeForm.name = st.name
  serviceTypeForm.description = st.description
}

const itemTypeForm = reactive({
  id: null,
  name: '',
  description: '',
})

const resetItemTypeForm = () => {
  itemTypeForm.id = null
  itemTypeForm.name = ''
  itemTypeForm.description = ''
}

const saveItemType = async () => {
  itemTypeStore.formPayload = { ...itemTypeForm }
  if (itemTypeForm.id) {
    await itemTypeStore.updateItem()
  } else {
    await itemTypeStore.createItem()
  }
  resetItemTypeForm()
}

const editItemType = (it) => {
  itemTypeForm.id = it.id
  itemTypeForm.name = it.name
  itemTypeForm.description = it.description
}

onMounted(async () => {
  try {
    await Promise.all([serviceTypeStore.fetchItems(), itemTypeStore.fetchItems()])
  } finally {
    isPrepare.value = false
  }
})
</script>
