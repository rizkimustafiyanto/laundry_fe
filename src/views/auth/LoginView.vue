<template>
  <div class="w-full min-h-screen flex items-center justify-center bg-gray-100">
    <form
      @submit.prevent="login"
      class="max-w-xl min-w-[200px] mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl space-y-6"
    >
      <h2 class="text-2xl font-semibold text-center text-gray-700">Login</h2>

      <BaseInput type="email" v-model="email" id="email" placeholder="Email" />
      <BaseInput type="password" v-model="password" id="password" placeholder="Password" />

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Login
      </button>

      <div class="flex justify-between mt-4 text-sm text-blue-600">
        <button
          type="button"
          @click="goToRegister"
          class="hover:underline hover:text-blue-800 transition"
        >
          Belum punya akun? Daftar
        </button>
        <button
          type="button"
          @click="goToForgotPassword"
          class="hover:underline hover:text-blue-800 transition"
        >
          Lupa Password?
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { useUIStore } from '@/stores/component/ui'
import BaseInput from '@/components/BaseInput.vue'

const router = useRouter()
const userStore = useAuthStore()
const ui = useUIStore()

const email = ref('')
const password = ref('')

const login = async () => {
  const result = await userStore.login(email.value, password.value)

  if (result.status === 200) {
    ui.show('success', `Selamat datang, ${result.user.name}`)

    if (userStore.role === 'SUPER_ADMIN') {
      router.push('/home')
    } else if (userStore.role === 'OWNER') {
      router.push('/owner/dashboard')
    } else if (userStore.role === 'CUSTOMER') {
      router.push('/customer/dashboard')
    } else {
      router.push('/unauthorized')
    }
  } else {
    ui.show('failed', result.message)
  }
}

const goToRegister = () => {
  router.push('/register')
}

const goToForgotPassword = () => {
  router.push('/forget-password')
}
</script>
