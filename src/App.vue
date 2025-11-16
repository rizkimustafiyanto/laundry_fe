<template>
  <div
    class="w-full min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 dark:text-white transition duration-300"
  >
    <BaseLoadingSpinner v-if="loading.isLoading" />

    <router-view v-slot="{ Component }">
      <Transition name="fade-page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>

    <ResponseModal
      :visible="ui.showModal"
      :status="ui.modalStatus"
      :message="ui.modalMessage"
      @close="ui.hide"
    />
    <BaseConfirmation />
  </div>
</template>

<script setup>
const themeStore = useThemeStore()
themeStore.applyTheme()

const ui = useUIStore()
const loading = useLoadingStore()

const userStore = useUserStore()
userStore.listenUserUpdates()

const addressStore = useAddressStore()
addressStore.listenAddressUpdates()

const transactionStore = useTransactionStore()
transactionStore.listenTrnasactionUpdates()

const statStore = useTransactionStatsStore()
statStore.listenStatUpdates()

const orderStore = useOrderStore()
orderStore.listenOrderUpdates()

const authStore = useAuthStore()
authStore.listenAuthUpdates()

const itemStore = useItemTypeStore()
itemStore.listenItemTypeUpdates()

const serviceStore = useServiceTypeStore()
serviceStore.listenServiceTypeUpdates()
</script>
