<template>
  <div>
    <BaseCard type="single" variant="secondary">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-bold" :class="themeClass.text.secondary">Alamat Order</h1>
        <BaseButton @click="openAddressForm" label="Tambah Alamat" variant="secondary" size="sm" />
      </div>

      <BaseLoadingSpinner v-if="loading" :type="'mini'" />

      <div v-else-if="addresses.length === 0 && !loading" :class="themeClass.text.secondary">
        Belum ada alamat tambahan.
      </div>

      <ul v-else class="space-y-4">
        <li
          v-for="address in addresses"
          :key="address.id"
          class="border py-2 px-4 rounded-lg shadow-sm flex justify-between items-center"
          :class="[
            themeClass.border.airy,
            address.isPrimary ? themeClass.baseDiv.airy : themeClass.baseDiv.secondary,
          ]"
        >
          <div>
            <h3 class="font-semibold text-lg" :class="themeClass.text.secondary">
              {{ address.label }}
            </h3>
            <p class="text-sm whitespace-pre-wrap" :class="themeClass.text.secondary">
              {{ address.addressLine }}
            </p>
            <p class="text-md">
              <strong :class="themeClass.text.secondary">Catatan:</strong>
              <span :class="themeClass.text.secondary">{{ address.notes }}</span>
            </p>
          </div>

          <div class="flex flex-row space-x-2 justify-center items-center md:items-start">
            <BaseButton
              v-if="!address.isPrimary"
              @click="setPrimaryAddress(address.id)"
              icon="pen"
              size="xs"
              variant="primary"
              noBg
            />
            <BaseButton
              @click="editAddressForm(address)"
              icon="edit"
              size="xs"
              variant="secondary"
            />
            <BaseButton
              @click="deleteAddressForm(address.id)"
              icon="trash"
              size="xs"
              variant="pink"
            />
          </div>
        </li>
      </ul>

      <BasePagination
        v-if="pagination.totalData > 0"
        :pagination="pagination"
        @page-change="handlePageChange"
        class="px-1"
        size="md"
      />
    </BaseCard>
    <AddressForm
      v-model="addressModal"
      :address="selectedAddress"
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

const addressModal = ref(false)
const addressMode = ref('create')
const selectedAddress = ref(null)

const pagination = computed(() => addressStore.meta)

const fetchAddressesPage = async (page = 1) => {
  loadingStore.start()
  try {
    await addressStore.fetchItems({ page: page })
  } finally {
    loadingStore.stop()
  }
}

const handlePageChange = (page) => {
  fetchAddressesPage(page)
}

const openAddressForm = () => {
  addressModal.value = true
  addressMode.value = 'create'
}

const editAddressForm = (data) => {
  addressModal.value = true
  addressMode.value = 'edit'
  selectedAddress.value = data
}

const deleteAddressForm = async (id) => {
  await addressStore.deleteItem(id)
}

const setPrimaryAddress = async (id) => {
  await addressStore.updateAddressesPrimary(id)
}

const saveAddress = async (createAddress) => {
  addressStore.formPayload = createAddress
  await addressStore.createItem()
}

const editAddress = async (updateAddress) => {
  addressStore.formPayload = updateAddress
  await addressStore.updateItem(updateAddress.id)
}
</script>
