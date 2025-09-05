import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    showModal: false,
    modalStatus: '',
    modalMessage: '',
  }),
  actions: {
    show(status, message) {
      this.modalStatus = status
      this.modalMessage = message
      this.showModal = true
    },
    hide() {
      this.showModal = false
      this.modalStatus = ''
      this.modalMessage = ''
    },
  },
})
