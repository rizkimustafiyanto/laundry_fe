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
          <AddressForm
            :address="newAddress"
            @update:address="newAddress = $event"
            @save-address="saveNewAddress"
          />
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
  editMode.value = false
}

const newAddress = ref({
  id: null,
  label: '',
  address_line: '',
  notes: '',
})

const resetNewAddress = () => {
  newAddress.value = {
    id: null,
    label: '',
    address_line: '',
    notes: '',
  }
}

const saveNewAddress = async () => {
  if (!newAddress.value.label || !newAddress.value.address_line || !newAddress.value.notes) {
    ui.show('failed', 'Lengkapi semua data alamat')
    return
  }

  const payload = {
    label: newAddress.value.label,
    addressLine: newAddress.value.address_line,
    notes: newAddress.value.notes,
  }

  if (newAddress.value.id) {
    await userStore.updateAddresses(newAddress.value.id, payload)
  } else {
    await userStore.createAddresses(payload)
  }
  resetNewAddress()
  addressFormVisible.value = false
}

const editAddress = (address) => {
  newAddress.value = { ...address }
  addressFormVisible.value = true
}

const deleteAddress = async (id) => {
  if (!confirm('Yakin ingin menghapus alamat ini?')) return
  await userStore.deleteAddresses(id)
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
