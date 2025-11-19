<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center animate-fadeIn">
      <h2 class="text-xl font-bold mb-3">Verifikasi Email</h2>

      <div v-if="loading" class="py-6 text-gray-600">
        <div class="loader mx-auto mb-3"></div>
        Sedang memverifikasi email Anda...
      </div>

      <div v-else-if="success" class="text-green-600 py-4">
        <i class="fa-solid fa-circle-check text-4xl mb-2"></i>
        <p class="font-semibold">{{ message }}</p>

        <BaseButton label="Pergi ke Login" variant="success" class="w-full mt-4" @click="toLogin" />
      </div>

      <div v-else class="text-red-600 py-4">
        <i class="fa-solid fa-circle-xmark text-4xl mb-2"></i>
        <p class="font-semibold">{{ message }}</p>

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

  store.verifingEmail(token)
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
  border: 4px solid #ddd;
  border-top-color: #3b82f6;
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
