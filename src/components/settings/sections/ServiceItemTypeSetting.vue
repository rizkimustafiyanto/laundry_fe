<template>
  <div>
    <BaseLoadingSpinner v-if="isPrepare" type="mini" />

    <div v-else>
      <h2 class="text-xl font-semibold mt-8 mb-4" :class="themeClass.text.secondary">
        Service & Item Type Settings
      </h2>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- SERVICE TYPE -->
        <BaseCard variant="dark" class="p-4 space-y-4">
          <h3 class="text-lg font-semibold mb-2" :class="themeClass.text.secondary">
            Service Types
          </h3>

          <BaseInput
            label="Nama Service Type"
            v-model="serviceTypeForm.name"
            placeholder="Contoh: Laundry, Dry Clean"
          />

          <div class="flex justify-end gap-2">
            <BaseButton label="Reset" variant="secondary" @click="resetServiceTypeForm" />
            <BaseButton
              :label="serviceTypeForm.id ? 'Update' : 'Simpan'"
              variant="teal"
              @click="saveServiceType"
            />
          </div>

          <table class="w-full text-sm border-collapse mt-4">
            <thead>
              <tr :class="themeClass.text.secondary">
                <th class="text-left p-2">Nama</th>
                <th class="text-right p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="st in serviceTypeStore.items"
                :key="st.id"
                class="border-t border-gray-700"
              >
                <td class="p-2">{{ st.name }}</td>
                <td class="p-2 text-right space-x-2">
                  <BaseButton
                    size="sm"
                    variant="secondary"
                    label="Edit"
                    @click="editServiceType(st)"
                  />
                  <BaseButton
                    size="sm"
                    variant="danger"
                    label="Hapus"
                    @click="serviceTypeStore.deleteItem(st.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </BaseCard>

        <!-- ITEM TYPE -->
        <BaseCard variant="dark" class="p-4 space-y-4">
          <h3 class="text-lg font-semibold mb-2" :class="themeClass.text.secondary">Item Types</h3>

          <BaseInput
            label="Nama Item Type"
            v-model="itemTypeForm.name"
            placeholder="Contoh: Pakaian, Sprei"
          />

          <div class="flex justify-end gap-2">
            <BaseButton label="Reset" variant="secondary" @click="resetItemTypeForm" />
            <BaseButton
              :label="itemTypeForm.id ? 'Update' : 'Simpan'"
              variant="teal"
              @click="saveItemType"
            />
          </div>

          <table class="w-full text-sm border-collapse mt-4">
            <thead>
              <tr :class="themeClass.text.secondary">
                <th class="text-left p-2">Nama</th>
                <th class="text-right p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="it in itemTypeStore.items" :key="it.id" class="border-t border-gray-700">
                <td class="p-2">{{ it.name }}</td>
                <td class="p-2 text-right space-x-2">
                  <BaseButton
                    size="sm"
                    variant="secondary"
                    label="Edit"
                    @click="editItemType(it)"
                  />
                  <BaseButton
                    size="sm"
                    variant="danger"
                    label="Hapus"
                    @click="itemTypeStore.deleteItem(it.id)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
const themeClass = useThemeClass()

// Stores
const serviceTypeStore = useServiceTypeStore()
const itemTypeStore = useItemTypeStore()

const isPrepare = ref(true)

// =====================
// SERVICE TYPE FORM
// =====================
const serviceTypeForm = reactive({
  id: null,
  name: '',
})

const resetServiceTypeForm = () => {
  serviceTypeForm.id = null
  serviceTypeForm.name = ''
}

const saveServiceType = async () => {
  serviceTypeStore.formPayload = { ...serviceTypeForm }
  if (serviceTypeForm.id) {
    await serviceTypeStore.updateItem(serviceTypeForm.id)
  } else {
    await serviceTypeStore.createItem()
  }
  resetServiceTypeForm()
}

const editServiceType = (st) => {
  serviceTypeForm.id = st.id
  serviceTypeForm.name = st.name
}

// =====================
// ITEM TYPE FORM
// =====================
const itemTypeForm = reactive({
  id: null,
  name: '',
})

const resetItemTypeForm = () => {
  itemTypeForm.id = null
  itemTypeForm.name = ''
}

const saveItemType = async () => {
  itemTypeStore.formPayload = { ...itemTypeForm }
  if (itemTypeForm.id) {
    await itemTypeStore.updateItem(itemTypeForm.id)
  } else {
    await itemTypeStore.createItem()
  }
  resetItemTypeForm()
}

const editItemType = (it) => {
  itemTypeForm.id = it.id
  itemTypeForm.name = it.name
}

onMounted(async () => {
  try {
    await Promise.all([serviceTypeStore.fetchItems(), itemTypeStore.fetchItems()])
  } finally {
    isPrepare.value = false
  }
})
</script>
