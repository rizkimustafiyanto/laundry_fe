<template>
  <div class="w-full min-h-screen flex flex-col">
    <LoadingSpinner v-if="loading.isLoading" />
    <RouterView />

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
import ResponseModal from '@/components/ResponseModal.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { useUserStore } from '@/stores/services/user'
import { useLoadingStore } from './stores/component/loading'

const ui = useUIStore()
const loading = useLoadingStore()

const userStore = useUserStore()
userStore.listenUserUpdates()
</script>
