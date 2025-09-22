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

const transactionStore = useTransactionStore()
transactionStore.listenOrderUpdates()

const addressStore = useAddressStore()
addressStore.listenAddressUpdates()

const statStore = useTransactionStatsStore()
statStore.listenStatUpdates()

const authStore = useAuthStore()
authStore.listenAuthUpdates()
</script>
