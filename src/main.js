import './assets/tailwind.css'
import './assets/styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import router from './router'
import { useCompanyStore } from './stores/services/company.service'

import BaseTable from './components/BaseTable.vue'
import BaseNavbar from '@/components/BaseNavbar.vue'
import BaseInput from './components/BaseInput.vue'
import BaseSelect from './components/BaseSelect.vue'
import BaseButton from './components/BaseButton.vue'
import BaseCard from './components/BaseCard.vue'
import BaseDropdown from './components/BaseDropdown.vue'
import BaseRadioButton from './components/BaseRadioButton.vue'
import BaseModal from './components/BaseModal.vue'
import BaseLoadingSpinner from './components/BaseLoadingSpinner.vue'
import ResponseModal from './components/ResponseModal.vue'

library.add(fas, far, fab)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('BaseTable', BaseTable)
app.component('BaseNavbar', BaseNavbar)
app.component('BaseInput', BaseInput)
app.component('BaseDropdown', BaseDropdown)
app.component('BaseCard', BaseCard)
app.component('BaseSelect', BaseSelect)
app.component('BaseButton', BaseButton)
app.component('BaseRadioButton', BaseRadioButton)
app.component('BaseModal', BaseModal)
app.component('BaseLoadingSpinner', BaseLoadingSpinner)
app.component('ResponseModal', ResponseModal)

async function initApp() {
  const companyStore = useCompanyStore(pinia)

  try {
    await companyStore.fetchCompanies({ page: 1, limit: 1 })
    const company = companyStore.companies[0]

    if (company) {
      if (company.name) {
        document.title = company.name
      }

      if (company.faviconUrl) {
        let link = document.querySelector("link[rel~='icon']")
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.head.appendChild(link)
        }
        link.href = company.faviconUrl
      }
    }
  } catch (err) {
    console.error('Gagal mengambil company profile:', err)
  }

  app.mount('#app')
}

initApp()
