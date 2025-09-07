<template>
  <div class="space-y-4">
    <ProfileSection :profile="profile" />
    <AddressSection :addresses="items" />
  </div>
</template>

<script setup>
import ProfileSection from '@/components/profile/sections/ProfileSection.vue'
import AddressSection from '@/components/profile/sections/AddressSection.vue'

const userStore = useUserStore()
const addressStore = useAddressStore()
const loading = useLoadingStore()
const { items } = storeToRefs(addressStore)
const { item: profile } = storeToRefs(userStore)

onMounted(async () => {
  loading.start()
  try {
    await userStore.fetchProfile()
    await addressStore.fetchItems()
  } finally {
    loading.stop()
  }
})
</script>
