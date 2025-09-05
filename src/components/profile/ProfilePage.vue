<template>
  <div class="space-y-4">
    <ProfileSection :profile="dataProfile" />
    <AddressSection :addresses="dataAddress" />
  </div>
</template>

<script setup>
import { computed, onBeforeMount } from 'vue'
import { useLoadingStore } from '@/stores/utils/loading'
import { useUserStore } from '@/stores/services/user.service'
import { useAddressStore } from '@/stores/services/address.service'

import ProfileSection from '@/components/profile/sections/ProfileSection.vue'
import AddressSection from '@/components/profile/sections/AddressSection.vue'

const userStore = useUserStore()
const addressStore = useAddressStore()
const loading = useLoadingStore()

const dataProfile = computed(() => userStore.profile)
const dataAddress = computed(() => addressStore.addresses)

onBeforeMount(async () => {
  loading.start()
  try {
    await userStore.fetchProfile()
    await addressStore.fetchAddresses()
  } finally {
    loading.stop()
  }
})
</script>
