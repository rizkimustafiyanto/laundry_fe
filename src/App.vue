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
  </div>
</template>

<script setup>
import { useUIStore } from '@/stores/component/ui'
import { useUserStore } from '@/stores/services/user'
import { useOrderStore } from '@/stores/services/order'
import { useLoadingStore } from './stores/component/loading'
import { useThemeStore } from '@/stores/component/theme'

const themeStore = useThemeStore()
themeStore.applyTheme()

const ui = useUIStore()
const loading = useLoadingStore()

const userStore = useUserStore()
userStore.listenUserUpdates()

const orderStore = useOrderStore()
orderStore.listenOrderUpdates()
</script>
