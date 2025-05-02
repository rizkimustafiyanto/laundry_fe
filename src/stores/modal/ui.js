import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    showModal: false,
    modalTitle: '',
    modalMessage: '',
  }),
  actions: {
    show(title, message) {
      this.modalTitle = title
      this.modalMessage = message
      this.showModal = true
    },
    hide() {
      this.showModal = false
      this.modalTitle = ''
      this.modalMessage = ''
    },
  },
})
