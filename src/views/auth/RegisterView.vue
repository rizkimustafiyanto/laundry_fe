<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <form
      @submit.prevent="register"
      class="w-full max-w-sm bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      <h2 class="text-2xl font-bold text-center text-gray-800">Register</h2>

      <input
        v-model="name"
        type="text"
        placeholder="Name"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Password"
          class="w-full pr-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
        >
          <font-awesome-icon
            :icon="!showPassword ? 'eye-slash' : 'eye'"
            class="w-5 h-5"
          />
        </button>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Register
      </button>

      <div class="text-center">
        <button
          type="button"
          @click="goToLogin"
          class="text-blue-600 hover:underline text-sm"
        >
          Sudah punya akun? Login
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/auth/user'
import { useUIStore } from '@/stores/modal/ui'

const router = useRouter()
const userStore = useUserStore()
const ui = useUIStore()

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const errorFields = ref({ name: false, email: false, password: false })

const register = async () => {
  errorFields.value = { name: false, email: false, password: false }

  let isValid = true
  if (!name.value) {
    errorFields.value.name = true
    isValid = false
  }
  if (!email.value) {
    errorFields.value.email = true
    isValid = false
  }
  if (!password.value) {
    errorFields.value.password = true
    isValid = false
  }

  if (!isValid) return

  let payload = {
    name: name.value,
    email: email.value,
    password: password.value
  }

  try {
    const result = await userStore.register(payload)

    if (result.status === 201) {
      ui.show('✅ Register Berhasil', `Selamat datang, ${result.user.name}`)
      resetForm()
      goToLogin()
    } else {
      ui.show('❌ Register Gagal', result.message)
    }
  } catch (error) {
    ui.show('❌ Terjadi kesalahan', 'Silakan coba lagi')
  }
}

const resetForm = () => {
  name.value = ''
  email.value = ''
  password.value = ''
  showPassword.value = false
}

const goToLogin = () => {
  router.push('/login')
}
</script>
