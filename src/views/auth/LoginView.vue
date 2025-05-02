<template>
  <div class="w-full min-h-screen flex items-center justify-center bg-gray-100">
    <form
      @submit.prevent="login"
      class="max-w-xl min-w-[200px] mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl space-y-6"
    >
      <h2 class="text-2xl font-semibold text-center text-gray-700">Login</h2>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      <div class="relative">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Password"
          class="w-full pr-9 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md transition-all duration-300 hover:bg-blue-600 hover:scale-105"
      >
        Login
      </button>

      <!-- Tombol tambahan -->
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
import { useUserStore } from '@/stores/auth/user'
import { useUIStore } from '@/stores/modal/ui'

const router = useRouter()
const userStore = useUserStore()
const ui = useUIStore()
const showPassword = ref(false)

const email = ref('')
const password = ref('')

const login = async () => {
  const result = await userStore.login(email.value, password.value)

  if (result.status === 200) {
    ui.show('✅ Login Berhasil', `Selamat datang, ${result.user.name}`)
    
    if (userStore.role === 'SUPER_ADMIN') {
      router.push('/admin/dashboard')
    } else if (userStore.role === 'OWNER') {
      router.push('/owner/dashboard')
    } else if (userStore.role === 'CUSTOMER') {
      router.push('/customer/dashboard')
    } else {
      router.push('/unauthorized')
    }
  } else {
    ui.show('❌ Login Gagal', result.message)
  }
}

const goToRegister = () => {
  router.push('/register')
}

const goToForgotPassword = () => {
  router.push('/forget-password')
}
</script>