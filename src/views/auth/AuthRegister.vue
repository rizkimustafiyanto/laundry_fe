<template>
  <BaseCard type="single" variant="mist" class="min-h-screen flex items-center justify-center">
    <BaseCard type="single" variant="secondary" class="w-full max-w-sm">
      <form @submit.prevent="register" class="space-y-4">
        <h2 class="text-2xl font-bold text-center">Register</h2>

        <BaseInput
          id="name"
          type="text"
          v-model="name"
          label="Nama"
          placeholder="Nama Lengkap"
          required
        />

        <BaseInput
          id="email"
          type="email"
          v-model="email"
          label="Email"
          placeholder="Alamat Email"
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

        <BaseButton type="submit" label="Register" variant="primary" class="w-full" />

        <div class="text-center">
          <button type="button" @click="goToLogin" class="text-blue-600 hover:underline text-sm">
            Sudah punya akun? Login
          </button>
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

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const errorFields = ref({
  name: false,
  email: false,
  password: false,
})

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
    password: password.value,
  }

  try {
    const result = await userStore.register(payload)
    notifySuccess(`Selamat datang, ${result.user.name}`)
    resetForm()
    goToLogin()
  } catch (err) {
    notifyError(err, 'Unexpected Error!')
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
