<template>
  <div class="min-h-screen bg-gray-100 py-10">
    <div v-if="profile" class="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
      <div class="flex justify-between items-start mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Profil Saya</h1>
        <button
          @click="editMode = !editMode"
          class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
        >
          {{ editMode ? 'Batal' : 'Edit Profil' }}
        </button>
      </div>

      <div class="flex items-center space-x-6">
        <img
          :src="profile.photo || defaultAvatar"
          alt="Foto Profil"
          class="w-28 h-28 rounded-full object-cover ring-2 ring-indigo-500"
        />
        <div>
          <h2 class="text-2xl font-semibold text-gray-800">{{ profile.name }}</h2>
          <p class="text-sm text-gray-500">{{ profile.email }}</p>
          <span
            class="mt-2 inline-block text-sm px-3 py-1 rounded-full font-medium bg-indigo-100 text-indigo-600"
          >
            {{ profile.role }}
          </span>
        </div>
      </div>

      <div class="mt-8">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Bio</h3>

        <div v-if="editMode">
          <BaseInput
            id="bio"
            label="Bio"
            type="textarea"
            v-model="editableBio"
            placeholder="Hello"
          />

          <BaseInput
            id="profile-picture"
            label="Foto Profil"
            type="file"
            @update:file="selectedFile = $event"
          />

          <div class="mt-4 text-right">
            <button
              @click="saveProfile"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Simpan
            </button>
          </div>
        </div>

        <p v-else class="text-gray-600 whitespace-pre-line">
          {{ profile.bio || 'Belum ada bio.' }}
        </p>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-20">Memuat data profil...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUIStore } from '@/stores/component/ui'
import { useLoadingStore } from '@/stores/component/loading'
import { useUserStore } from '@/stores/services/user.js'

const editMode = ref(false)
const editableBio = ref('')
const selectedFile = ref(null)

const ui = useUIStore()
const loading = useLoadingStore()
const userStore = useUserStore()

const { profile } = storeToRefs(userStore)

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=4f46e5&color=ffffff'

const saveProfile = async () => {
  if (!profile.value) return

  loading.startMini()

  const formData = new FormData()
  formData.append('name', profile.value.name)
  formData.append('email', profile.value.email)
  formData.append('bio', editableBio.value)

  if (selectedFile.value) {
    formData.append('file', selectedFile.value)
  }

  try {
    await userStore.updateProfile(formData)
    editMode.value = false
    ui.show('success', 'Profil berhasil disimpan!')
  } catch (err) {
    ui.show('failed', err?.response?.data?.message || 'Gagal menyimpan profil')
  } finally {
    loading.stopMini()
  }
}

watch(editMode, (val) => {
  if (val && profile.value) {
    editableBio.value = profile.value.bio || ''
  }
})

const loadProfile = async () => {
  loading.startMini()
  try {
    await userStore.fetchProfile()
  } catch (err) {
    ui.show('failed', err?.response?.data?.message || 'Gagal memuat data user')
  } finally {
    loading.stopMini()
  }
}

onMounted(async () => {
  loading.start()
  try {
    await loadProfile()
  } finally {
    loading.stop()
  }
})
</script>
