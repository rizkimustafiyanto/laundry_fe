<template>
  <div>
    <BaseCard type="single" variant="secondary">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl font-bold flex items-center gap-2" :class="themeClass.text.secondary">
          <i :class="['fa-solid fa-map-location-dot', themeClass.icon.primary]"></i>
          Alamat Order
        </h1>
        <BaseButton
          @click="openAddressForm"
          label="Tambah Alamat"
          variant="secondary"
          size="sm"
          icon="fa-solid fa-plus"
        />
      </div>

      <BaseLoadingSpinner v-if="loading" type="mini" class="mx-auto my-6" />

      <div
        v-else-if="addresses.length === 0"
        class="text-center py-6 rounded-lg border border-dashed flex flex-col items-center"
        :class="themeClass.border.airy"
      >
        <i :class="['fa-solid fa-inbox text-4xl mb-3', themeClass.icon.secondary]"></i>
        <p class="text-sm" :class="themeClass.text.secondary">Belum ada alamat tambahan.</p>
      </div>

      <ul v-else class="space-y-4">
        <li
          v-for="address in addresses"
          :key="address.id"
          class="p-5 rounded-xl shadow-sm transition-all duration-200 hover:shadow-lg flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
          :class="[
            themeClass.border.airy,
            address.isPrimary ? themeClass.baseDiv.airy : themeClass.baseDiv.secondary,
          ]"
        >
          <div class="flex-1 space-y-2">
            <h3
              class="font-semibold text-sm flex items-center gap-2"
              :class="themeClass.text.secondary"
            >
              <i
                v-if="address.isPrimary"
                :class="['fa-solid fa-star', themeClass.icon.warning]"
                title="Alamat Utama"
              ></i>
              {{ address.label }}
            </h3>

            <p class="text-sm flex items-start gap-2" :class="themeClass.text.secondary">
              <i :class="['fa-solid fa-map-pin mt-0.5', themeClass.icon.danger]"></i>
              {{ address.addressLine }}
            </p>

            <p class="text-sm flex items-start gap-2">
              <i :class="['fa-solid fa-note-sticky mt-0.5', themeClass.icon.info]"></i>
              <span :class="themeClass.text.secondary">
                <strong>Catatan:</strong> {{ address.notes || '-' }}
              </span>
            </p>

            <a
              v-if="address.latitude && address.longitude"
              :href="`https://www.google.com/maps?q=${address.latitude},${address.longitude}`"
              target="_blank"
              class="inline-flex items-center gap-2 mt-3 text-sm font-medium transition"
              :class="[themeClass.text.link, themeClass.hoverText.link]"
            >
              <i class="fa-solid fa-up-right-from-square"></i> Lihat di Maps
            </a>
          </div>

          <div class="flex flex-row sm:flex-col gap-2 sm:items-end">
            <BaseButton
              v-if="!address.isPrimary"
              @click="setPrimaryAddress(address.id)"
              icon="fa-solid fa-star"
              size="xs"
              variant="primary"
              noBg
              title="Jadikan Utama"
            />
            <BaseButton
              @click="editAddressForm(address)"
              icon="fa-solid fa-pen"
              size="xs"
              variant="secondary"
              title="Edit Alamat"
            />
            <BaseButton
              @click="deleteAddressForm(address.id)"
              icon="fa-solid fa-trash"
              size="xs"
              variant="pink"
              title="Hapus Alamat"
            />
          </div>
        </li>
      </ul>

      <div class="mt-6">
        <BasePagination
          v-if="pagination.totalData > 0"
          :pagination="pagination"
          @page-change="handlePageChange"
          class="px-1"
          size="md"
        />
      </div>
    </BaseCard>

    <AddressForm
      v-model="addressModal"
      :mode="addressMode"
      @save="saveAddress"
      @edit="editAddress"
    />
  </div>
</template>

<script setup>
import AddressForm from '../form/AddressForm.vue'

const addressStore = useAddressStore()
const loadingStore = useLoadingStore()
const themeClass = useThemeClass()

const loading = computed(() => loadingStore.isMiniLoading)
const addresses = computed(() => addressStore.items)
const pagination = computed(() => addressStore.meta)

const addressModal = ref(false)
const addressMode = ref('create')

const fetchAddressesPage = async (page = 1) => {
  loadingStore.start()
  try {
    await addressStore.fetchItems({ page })
  } finally {
    loadingStore.stop()
  }
}
const handlePageChange = (page) => fetchAddressesPage(page)

const openAddressForm = () => {
  addressStore.resetForm()
  addressMode.value = 'create'
  addressModal.value = true
}

const editAddressForm = (data) => {
  addressStore.formPayload = { ...data }
  addressMode.value = 'edit'
  addressModal.value = true
}

const deleteAddressForm = async (id) => {
  await addressStore.deleteItem(id)
}
const setPrimaryAddress = async (id) => {
  await addressStore.updateAddressesPrimary(id)
}

const saveAddress = async () => {
  await addressStore.createItem()
}
const editAddress = async () => {
  await addressStore.updateItem(addressStore.formPayload.id)
}
</script>
