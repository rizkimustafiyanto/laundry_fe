// import './assets/main.css'
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
import BaseTable from './components/BaseTable.vue'
import Navbar from '@/components/Navbar.vue'
import BaseInput from './components/BaseInput.vue'
import BaseSelect from './components/BaseSelect.vue'
import BaseCard from './components/BaseCard.vue'
import BaseDropdown from './components/BaseDropdown.vue'
import BaseRadioButton from './components/BaseRadioButton.vue'
import BaseModal from './components/BaseModal.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import ResponseModal from './components/ResponseModal.vue'

library.add(fas, far, fab)
const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.component('BaseTable', BaseTable)
app.component('Navbar', Navbar)
app.component('BaseInput', BaseInput)
app.component('BaseDropdown', BaseDropdown)
app.component('BaseCard', BaseCard)
app.component('BaseSelect', BaseSelect)
app.component('BaseRadioButton', BaseRadioButton)
app.component('BaseModal', BaseModal)
app.component('LoadingSpinner', LoadingSpinner)
app.component('ResponseModal', ResponseModal)

app.use(createPinia())
app.use(router)

app.mount('#app')
