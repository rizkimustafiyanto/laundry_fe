<template>
  <BaseCard
    type="single"
    variant="mist"
    class="w-full min-h-screen flex items-center justify-center"
  >
    <BaseCard type="single" variant="secondary" class="w-full max-w-md mt-20">
      <form @submit.prevent="login" class="space-y-6">
        <h2 class="text-2xl font-semibold text-center">Login</h2>

        <BaseInput
          type="email"
          v-model="email"
          id="email"
          label="Email"
          placeholder="Masukkan Email"
          required
        />

        <BaseInput
          type="password"
          v-model="password"
          id="password"
          label="Password"
          placeholder="Masukkan Password"
          required
        />

        <BaseButton type="submit" label="Login" variant="primary" class="w-full" />

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
    </BaseCard>
  </BaseCard>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useUIStore } from '@/stores/utils/ui'

const router = useRouter()
const userStore = useAuthStore()
const ui = useUIStore()

const email = ref('')
const password = ref('')

const login = async () => {
  const result = await userStore.login(email.value, password.value)

  if (result.status === 200) {
    ui.show('success', `Selamat datang, ${result.user.name}`)

    switch (userStore.role) {
      case 'SUPER_ADMIN':
        router.push('/home')
        break
      case 'OWNER':
        router.push('/owner/dashboard')
        break
      case 'CUSTOMER':
        router.push('/customer/dashboard')
        break
      default:
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
