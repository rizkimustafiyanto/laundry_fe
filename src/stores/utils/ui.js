import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    showModal: false,
    modalStatus: '',
    modalMessage: '',

    showConfirm: false,
    confirmTitle: '',
    confirmMessage: '',
    confirmRequireReason: false,
    confirmReason: '',
    confirmResolve: null,
    confirmReject: null,
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

    confirm({ title, message, requireReason = false }) {
      this.confirmTitle = title
      this.confirmMessage = message
      this.confirmRequireReason = requireReason
      this.confirmReason = ''
      this.showConfirm = true

      return new Promise((resolve, reject) => {
        this.confirmResolve = resolve
        this.confirmReject = reject
      })
    },
    confirmYes() {
      if (this.confirmResolve)
        this.confirmResolve(this.confirmRequireReason ? this.confirmReason : true)
      this._resetConfirm()
    },
    confirmNo() {
      if (this.confirmReject) this.confirmReject(new Error('cancelled'))
      this._resetConfirm()
    },
    _resetConfirm() {
      this.showConfirm = false
      this.confirmTitle = ''
      this.confirmMessage = ''
      this.confirmRequireReason = false
      this.confirmReason = ''
      this.confirmResolve = null
      this.confirmReject = null
    },
  },
})
