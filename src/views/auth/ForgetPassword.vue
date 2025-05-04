<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <form
      @submit.prevent="handleSubmit"
      class="w-full max-w-sm bg-white p-8 rounded-xl shadow-md space-y-6"
    >
      <h2 class="text-2xl font-bold text-center text-gray-800">Lupa Password</h2>

      <div v-if="message" class="text-center mb-4">
        <p :class="{ 'text-red-500': isError, 'text-green-500': !isError }">{{ message }}</p>
      </div>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Kirim Link Reset Password
      </button>

      <div class="text-center mt-4">
        <router-link to="/login" class="text-blue-600 hover:underline text-sm"
          >Kembali ke Login</router-link
        >
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { useUIStore } from '@/stores/component/ui'

const router = useRouter()
const userStore = useAuthStore()
const ui = useUIStore()

const email = ref('')
const message = ref('')
const isError = ref(false)

const handleSubmit = async () => {
  const response = await userStore.forgetPassword(email.value)

  if (response.status === 200) {
    ui.show('success', `Congratulation`)
    router.push('/login')
  } else {
    ui.show('failed', response.message)
  }
}
</script>
