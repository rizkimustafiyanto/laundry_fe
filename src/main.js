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
import VueApexCharts from 'vue3-apexcharts'
import { initApp } from './composables/useInitApp'

import BaseBadge from './components/BaseBadge.vue'
import BaseButton from './components/BaseButton.vue'
import BaseCard from './components/BaseCard.vue'
import BaseChart from './components/BaseChart.vue'
import BaseConfirmation from './components/BaseConfirmation.vue'
import BaseDropdown from './components/BaseDropdown.vue'
import BaseInput from './components/BaseInput.vue'
import BaseLoadingSpinner from './components/BaseLoadingSpinner.vue'
import BaseModal from './components/BaseModal.vue'
import BaseNavbar from './components/BaseNavbar.vue'
import BasePagination from './components/BasePagination.vue'
import BaseRadioButton from './components/BaseRadioButton.vue'
import BaseSelect from './components/BaseSelect.vue'
import BaseSlider from './components/BaseSlider.vue'
import BaseSwitch from './components/BaseSwitch.vue'
import BaseTable from './components/BaseTable.vue'
import BaseTab from './components/BaseTab.vue'
import ResponseModal from './components/ResponseModal.vue'

library.add(fas, far, fab)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(VueApexCharts)
app.component('font-awesome-icon', FontAwesomeIcon)

app.component('BaseBadge', BaseBadge)
app.component('BaseButton', BaseButton)
app.component('BaseCard', BaseCard)
app.component('BaseChart', BaseChart)
app.component('BaseConfirmation', BaseConfirmation)
app.component('BaseDropdown', BaseDropdown)
app.component('BaseInput', BaseInput)
app.component('BaseLoadingSpinner', BaseLoadingSpinner)
app.component('BaseModal', BaseModal)
app.component('BaseNavbar', BaseNavbar)
app.component('BasePagination', BasePagination)
app.component('BaseRadioButton', BaseRadioButton)
app.component('BaseSelect', BaseSelect)
app.component('BaseSlider', BaseSlider)
app.component('BaseSwitch', BaseSwitch)
app.component('BaseTab', BaseTab)
app.component('BaseTable', BaseTable)
app.component('ResponseModal', ResponseModal)

// ========================
// Global config
// ========================
app.config.globalProperties.__BASE_URL__ = __BASE_URL__

// ========================
// Initialize App and mount
// ========================
initApp(pinia).finally(() => app.mount('#app'))
