<template>
  <BaseCard type="single" variant="glass">
    <div class="flex justify-between items-center py-2">
      <h1 class="text-xl font-bold">Profil Saya</h1>
      <BaseButton @click="editModal()" label="Edit Profil" variant="secondary" size="sm" />
    </div>

    <div class="flex flex-col py-4 gap-4">
      <div class="flex items-center gap-5 mb-4 md:mb-0">
        <img
          :src="profile?.photo || defaultAvatar"
          alt="Foto Profil"
          class="w-28 h-28 rounded-full object-cover ring-2 ring-indigo-500"
        />
        <div class="flex-1 min-w-0">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-1 break-words">
            {{ profile?.name }}
          </h2>
          <p class="mb-1 text-sm break-words" :class="themeClass.labelMail">
            {{ profile?.email }}
          </p>
          <span
            class="inline-block text-sm px-2 py-1 mt-2 rounded-xl font-medium"
            :class="themeClass.labelAccess"
          >
            {{ formatText(profile?.role) }}
          </span>
        </div>
      </div>

      <div class="flex flex-col justify-center md:items-start">
        <h2 class="text-lg font-medium mb-1" :class="themeClass.labelName">BIO</h2>
        <p class="text-sm break-words whitespace-pre-wrap" :class="themeClass.labelMuted">
          {{ profile?.bio || 'Belum ada bio' }}
        </p>
      </div>
    </div>

    <ProfileForm
      v-model="editProfile"
      :data-profile="profile"
      @file-selected="selectedFile = $event"
      @save="saveProfile"
    />
  </BaseCard>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass'

import { formatText } from '@/utils/formatters'
import { useUserStore } from '@/stores/services/user.service'

import ProfileForm from '../form/ProfileForm.vue'
import defaultAvatar from '@/assets/icons/user.png'

const { themeClass } = useThemeClass()

defineProps({
  profile: { type: Object, default: () => {} },
})

const editProfile = ref(false)
const selectedFile = ref(null)
const userStore = useUserStore()

const editModal = () => {
  editProfile.value = true
}

const saveProfile = async (updatedProfile) => {
  const payload = {
    name: updatedProfile.name,
    email: updatedProfile.email,
    gender: updatedProfile.gender,
    phone: updatedProfile.phone,
    address: updatedProfile.address,
    bio: updatedProfile.bio,
    dateOfBirth: updatedProfile.dateOfBirth,
  }

  if (selectedFile.value) {
    payload.file = selectedFile.value
  }

  await userStore.updateProfile(payload)
  editProfile.value = false
}
</script>
