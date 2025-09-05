<template>
  <BaseCard type="single" variant="primary">
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
        :class="[themeClass.borderColor, address.isPrimary ? themeClass.trHover : '']"
      >
        <div>
          <h3 class="font-semibold text-lg">{{ address.label }}</h3>
          <p class="text-sm whitespace-pre-wrap" :class="themeClass.labelMuted">
            {{ address.addressLine }}
          </p>
          <p class="text-md"><strong>Catatan:</strong> {{ address.notes }}</p>
        </div>
        <div class="flex flex-row space-x-2 justify-center items-center md:items-start">
          <BaseButton @click="setPrimaryAddress(address.id)" icon="pen" size="xs" noBg />
          <BaseButton @click="editAddressForm(address)" icon="edit" size="xs" noBg />
          <BaseButton @click="deleteAddressForm(address.id)" icon="trash" size="xs" noBg />
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
import { ref, computed, onMounted } from 'vue'
import { useAddressStore } from '@/stores/services/address.service'
import { useThemeClass } from '@/composables/useThemeClass'
import BasePagination from '@/components/BasePagination.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import AddressForm from '../form/AddressForm.vue'
import { useLoadingStore } from '@/stores/utils/loading'

const addressStore = useAddressStore()
const loadingStore = useLoadingStore()
const { themeClass } = useThemeClass()

const loading = computed(() => loadingStore.isMiniLoading)

const addresses = computed(() => addressStore.addresses)

const addressModal = ref(false)
const addressMode = ref('create')
const selectedAddress = ref(null)

const currentPage = ref(1)
const limit = ref(5)

const pagination = computed(() => ({
  currentPage: currentPage.value,
  limit: limit.value,
  totalData: addressStore.meta?.totalData || addresses.value.length,
}))

const fetchAddressesPage = async (page = 1) => {
  loadingStore.start()
  try {
    currentPage.value = page
    await addressStore.fetchAddresses({ page, limit: limit.value })
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
  await addressStore.deleteAddresses(id)
}

const setPrimaryAddress = async (id) => {
  await addressStore.updateAddressesPrimary(id)
}

const saveAddress = async (createAddress) => {
  await addressStore.createAddresses(createAddress)
}

const editAddress = async (updateAddress) => {
  await addressStore.updateAddresses(updateAddress.id, updateAddress)
}

onMounted(() => {
  fetchAddressesPage()
})
</script>
