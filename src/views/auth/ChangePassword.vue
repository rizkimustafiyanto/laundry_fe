<template>
  <BaseCard type="single" variant="primary" class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <BaseCard type="single" variant="secondary" class="w-full max-w-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <h2 class="text-2xl font-bold text-center">Ubah Password</h2>

        <div v-if="message" class="text-center mb-4">
          <p :class="{ 'text-red-500': isError, 'text-green-500': !isError }">{{ message }}</p>
        </div>

        <input
          v-model="token"
          type="hidden"
          placeholder="Token Reset Password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <BaseInput
          v-model="newPassword"
          type="password"
          label="Password Baru"
          placeholder="Password Baru"
          required
        />

        <BaseInput
          v-model="confirmPassword"
          type="password"
          label="Konfirmasi Password Baru"
          placeholder="Konfirmasi Password Baru"
          required
        />

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Ganti Password
        </button>

        <div class="text-center mt-4">
          <router-link to="/login" class="text-blue-600 hover:underline text-sm">
            Kembali ke Login
          </router-link>
        </div>
      </form>
    </BaseCard>
  </BaseCard>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { useUIStore } from '@/stores/component/ui'

const route = useRoute()
const router = useRouter()
const userStore = useAuthStore()
const ui = useUIStore()

const token = ref(route.query.token || '')
const newPassword = ref('')
const confirmPassword = ref('')
const message = ref('')
const isError = ref(false)

const handleSubmit = async () => {
  if (newPassword.value !== confirmPassword.value) {
    message.value = 'Konfirmasi password tidak cocok'
    isError.value = true
    return
  }

  let payload = {
    token: token.value,
    newPassword: newPassword.value,
  }
  const response = await userStore.changePassword(payload)

  if (response.status === 200) {
    ui.show('success', `Congratulation, ${response.message}`)
    router.push('/login')
  } else {
    ui.show('failed', response.message)
  }
}
</script>
