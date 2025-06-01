<template>
  <div>
    <BaseLoadingSpinner v-if="isMiniLoading" :type="'mini'" />

    <div v-if="profile && !isMiniLoading" class="max-w-4xl mx-auto space-y-6">
      <ProfileCard :profile="profile" :editMode="editMode" @toggle-edit="editMode = !editMode" />

      <div v-if="editMode" class="mt-6">
        <ProfileForm
          :editableProfile="profile"
          @save="saveProfile"
          @file-selected="selectedFile = $event"
        />
      </div>

      <AddressSection
        :addresses="addresses"
        :addressFormVisible="addressFormVisible"
        @toggle-address-form="addressFormVisible = !addressFormVisible"
        @edit-address="editAddress"
        @delete-address="deleteAddress"
      >
        <template #address-form>
          <AddressForm :address="newAddress" @save-address="saveNewAddress" />
        </template>
      </AddressSection>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/component/ui'
import { useLoadingStore } from '@/stores/component/loading'
import { useUserStore } from '@/stores/services/user.js'

import ProfileCard from '@/components/user/profile/ProfileCard.vue'
import ProfileForm from '@/components/user/profile/ProfileForm.vue'
import AddressSection from '@/components/user/profile/AddressSection.vue'
import AddressForm from '@/components/user/profile/AddressForm.vue'

const editMode = ref(false)
const addressFormVisible = ref(false)
const selectedFile = ref(null)

const ui = useUIStore()
const loading = useLoadingStore()
const userStore = useUserStore()

const { profile, addresses } = storeToRefs(userStore)

const isMiniLoading = computed(() => loading.isMiniLoading)

const saveProfile = async (updatedProfile) => {
  loading.startMini()
  try {
    const formData = new FormData()
    formData.append('name', updatedProfile.name)
    formData.append('email', updatedProfile.email)
    formData.append('gender', updatedProfile.gender)
    formData.append('phone', updatedProfile.phone)
    formData.append('address', updatedProfile.address)
    formData.append('bio', updatedProfile.bio)

    if (selectedFile.value) {
      formData.append('file', selectedFile.value)
    }

    await userStore.updateProfile(formData)

    ui.show('success', 'Profil berhasil disimpan!')
    editMode.value = false
  } catch (err) {
    ui.show('failed', err?.response?.data?.message || 'Gagal menyimpan profil')
  } finally {
    loading.stopMini()
  }
}

const newAddress = ref({
  id: null,
  label: '',
  recipientName: '',
  recipientPhone: '',
  addressDetail: '',
})

const resetNewAddress = () => {
  newAddress.value = {
    id: null,
    label: '',
    recipientName: '',
    recipientPhone: '',
    addressDetail: '',
  }
}

const saveNewAddress = async () => {
  loading.startMini()
  try {
    if (
      !newAddress.value.label ||
      !newAddress.value.recipientName ||
      !newAddress.value.recipientPhone ||
      !newAddress.value.addressDetail
    ) {
      ui.show('failed', 'Lengkapi semua data alamat')
      loading.stopMini()
      return
    }

    if (newAddress.value.id) {
      await userStore.updateAddress(newAddress.value.id, { ...newAddress.value })
      ui.show('success', 'Alamat berhasil diupdate!')
    } else {
      await userStore.addAddress({ ...newAddress.value })
      ui.show('success', 'Alamat berhasil ditambahkan!')
    }
    resetNewAddress()
    addressFormVisible.value = false
  } catch (err) {
    ui.show('failed', err?.response?.data?.message || 'Gagal menyimpan alamat')
  } finally {
    loading.stopMini()
  }
}

const editAddress = (address) => {
  newAddress.value = { ...address }
  addressFormVisible.value = true
}

const deleteAddress = async (id) => {
  if (!confirm('Yakin ingin menghapus alamat ini?')) return

  loading.startMini()
  try {
    await userStore.deleteAddress(id)
    ui.show('success', 'Alamat berhasil dihapus!')
  } catch (err) {
    ui.show('failed', err?.response?.data?.message || 'Gagal menghapus alamat')
  } finally {
    loading.stopMini()
  }
}

const loadProfile = async () => {
  loading.startMini()
  try {
    await userStore.fetchProfile()
    await userStore.fetchAddresses()
  } finally {
    loading.stopMini()
  }
}

onMounted(async () => {
  loading.start()
  try {
    await loadProfile()
  } finally {
    loading.stop()
  }
})
</script>
