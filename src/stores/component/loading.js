import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    isMiniLoading: false,
  }),
  actions: {
    start() {
      this.isLoading = true
    },
    stop() {
      this.isLoading = false
    },
    startMini() {
      this.isMiniLoading = true
    },
    stopMini() {
      this.isMiniLoading = false
    },
  },
})
