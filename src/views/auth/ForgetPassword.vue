<template>
  <BaseCard
    type="single"
    variant="primary"
    class="min-h-screen flex items-center justify-center bg-gray-100 px-4"
  >
    <BaseCard type="single" variant="secondary" class="w-full max-w-sm">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <h2 class="text-2xl font-bold text-center">Lupa Password</h2>

        <div v-if="message" class="text-center mb-4">
          <p :class="{ 'text-red-500': isError, 'text-green-500': !isError }">{{ message }}</p>
        </div>

        <BaseInput
          v-model="email"
          type="email"
          label="Email"
          placeholder="Masukkan Email Anda"
          required
        />

        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Kirim Link Reset Password
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
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useAuthStore()

const email = ref('')
const message = ref('')
const isError = ref(false)

const handleSubmit = async () => {
  const response = await userStore.forgetPassword(email.value)

  if (response.status === 200) {
    notifySuccess('Congratulation')
    router.push('/login')
  } else {
    notifyError('failed', response.message)
    message.value = response.message
    isError.value = true
  }
}
</script>
