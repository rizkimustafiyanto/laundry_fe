<template>
  <BaseCard type="single" variant="glass">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">Alamat Order</h1>
      <BaseButton @click="openAddressForm" label="Tambah Alamat" variant="secondary" size="sm" />
    </div>

    <BaseLoadingSpinner v-if="loading" :type="'mini'" />
    <div v-else-if="addresses.length === 0 && !loading" class="text-gray-500">
      Belum ada alamat tambahan.
    </div>

    <ul v-else class="space-y-4">
      <li
        v-for="address in addresses"
        :key="address.id"
        class="border py-2 px-4 rounded-lg shadow-sm flex justify-between items-center"
        :class="[
          themeClass.borderColor,
          address.isPrimary ? themeClass.baseDiv.secondary : themeClass.baseDiv.glass,
        ]"
      >
        <div>
          <h3 class="font-semibold text-lg">{{ address.label }}</h3>
          <p class="text-sm whitespace-pre-wrap" :class="themeClass.text.secondary">
            {{ address.addressLine }}
          </p>
          <p class="text-md"><strong>Catatan:</strong> {{ address.notes }}</p>
        </div>
        <div class="flex flex-row space-x-2 justify-center items-center md:items-start">
          <BaseButton
            v-if="!address.isPrimary"
            @click="setPrimaryAddress(address.id)"
            icon="pen"
            size="xs"
            noBg
          />
          <BaseButton @click="editAddressForm(address)" icon="edit" size="xs" variant="secondary" />
          <BaseButton
            @click="deleteAddressForm(address.id)"
            icon="trash"
            size="xs"
            variant="danger"
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

    <AddressForm
      v-model="addressModal"
      :address="selectedAddress"
      :mode="addressMode"
      @save="saveAddress"
      @edit="editAddress"
    />
  </BaseCard>
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
  await addressStore.createItem(createAddress)
}

const editAddress = async (updateAddress) => {
  await addressStore.updateItem(updateAddress.id, updateAddress)
}
</script>
