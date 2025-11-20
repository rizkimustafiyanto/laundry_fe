<template>
  <div
    class="min-h-screen flex items-center justify-center px-4"
    :class="themeClass.background.dark"
  >
    <div
      class="p-6 rounded-lg shadow-lg max-w-md w-full text-center animate-fadeIn"
      :class="themeClass.background.secondary"
    >
      <h2 class="text-xl font-bold mb-3" :class="themeClass.text.dark">Verifikasi Email</h2>

      <div
        v-if="loading"
        class="py-6 flex flex-col items-center gap-3"
        :class="themeClass.text.muted"
      >
        <div class="loader mx-auto" :class="themeClass.text.primary"></div>
        Sedang memverifikasi email Anda...
      </div>

      <div v-else-if="success" class="py-4">
        <i :class="['fa-solid fa-circle-check text-4xl mb-2', themeClass.icon.success]"></i>
        <p :class="['font-semibold', themeClass.text.dark]">{{ message }}</p>

        <BaseButton label="Pergi ke Login" variant="success" class="w-full mt-4" @click="toLogin" />
      </div>

      <div v-else class="py-4">
        <i :class="['fa-solid fa-circle-xmark text-4xl mb-2', themeClass.icon.danger]"></i>
        <p :class="['font-semibold', themeClass.text.dark]">{{ message }}</p>

        <BaseButton
          label="Kembali ke Login"
          variant="danger"
          class="w-full mt-4"
          @click="toLogin"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const themeClass = useThemeClass()

const loading = ref(true)
const success = ref(false)
const message = ref('')

const store = useAuthStore()

async function verify() {
  const token = route.query.token

  if (!token) {
    loading.value = false
    success.value = false
    message.value = 'Token tidak ditemukan.'
    return
  }

  const res = await store.verifingEmail(token)
  if (res) {
    success.value = res.success
    message.value = res.message
  }

  loading.value = false
}

function toLogin() {
  router.push({ name: 'Login' })
}

onMounted(() => {
  verify()
})
</script>

<style>
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loader {
  border-width: 4px;
  border-style: solid;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
