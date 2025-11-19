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

        <BaseButton
          type="submit"
          label="Login"
          variant="primary"
          class="w-full"
          :isLoading="loading"
          :disabled="loading"
        />

        <div class="flex items-center my-4">
          <div class="flex-1 h-px bg-gray-300"></div>
          <span class="px-3 text-sm text-gray-600">atau</span>
          <div class="flex-1 h-px bg-gray-300"></div>
        </div>

        <BaseButton
          label="Login dengan Google"
          @click="loginWithGoogle"
          variant="secondary"
          class="w-full gap-3 py-3 flex items-center justify-center"
          :isLoading="googleLoading"
          :disabled="googleLoading"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            class="h-5 w-5"
            alt="Google logo"
          />
          <span class="font-medium">Login dengan Google</span>
        </BaseButton>

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
const router = useRouter()
const userStore = useAuthStore()
const ui = useUIStore()

const email = ref('')
const password = ref('')
const googleReady = ref(false)
const loading = ref(false)
const googleLoading = ref(false)

const login = async () => {
  if (loading.value) return
  loading.value = true

  await userStore.login(email.value, password.value)
  loading.value = false
}

const handleGoogleResponse = async (response) => {
  googleLoading.value = true
  const idToken = response.credential
  await userStore.loginWithGoogle(idToken)
  googleLoading.value = false
}

onMounted(() => {
  googleReady.value = true
  google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleGoogleResponse,
    ux_mode: 'popup',
  })
})

const loginWithGoogle = () => {
  if (!googleReady.value) return ui.show('failed', 'Google login belum siap.')
  if (googleLoading.value) return

  googleLoading.value = true

  try {
    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        ui.show(
          'failed',
          'Login Google tidak bisa muncul. Mohon cek pengaturan browser dan izinkan third-party cookies.',
        )
      }
      googleLoading.value = false
    })
  } catch (err) {
    console.error(err)
    ui.show('failed', 'Terjadi error saat memulai login Google')
    googleLoading.value = false
  }
}

const goToRegister = () => router.push('/register')
const goToForgotPassword = () => router.push('/forget-password')
</script>
