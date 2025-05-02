<template>
  <div class="w-full min-h-screen flex flex-col">
    <RouterView />

    <ResponseModal
      :visible="ui.showModal"
      :title="ui.modalTitle"
      :message="ui.modalMessage"
      @close="ui.hide"
    />
  </div>
</template>

<script setup>
import { useUIStore } from '@/stores/modal/ui'
import ResponseModal from '@/components/ResponseModal.vue'

const ui = useUIStore()
</script>
