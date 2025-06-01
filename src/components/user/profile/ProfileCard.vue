<template>
  <BaseCard type="single" variant="primary">
    <div class="flex justify-between items-start mb-6">
      <h1 class="text-3xl font-bold">Profil Saya</h1>
      <BaseButton
        @click="$emit('toggle-edit')"
        :label="editMode ? 'Batal' : 'Edit Profil'"
        :variant="editMode ? 'danger' : 'secondary'"
        class="w-40"
      />
    </div>

    <div class="flex items-center space-x-6">
      <img
        :src="profile.photo || defaultAvatar"
        alt="Foto Profil"
        class="w-28 h-28 rounded-full object-cover ring-2 ring-indigo-500"
      />
      <div class="flex-1">
        <h2 class="text-2xl font-medium text-gray-900 dark:text-white mb-1">{{ profile.name }}</h2>
        <p class="truncate text-sm text-gray-500 dark:text-gray-400 mb-1">{{ profile.email }}</p>
        <span
          class="inline-block text-sm px-3 py-1 rounded-full font-medium bg-indigo-100 text-indigo-600"
        >
          {{ profile.role }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import defaultAvatar from '@/assets/icons/user.png'

defineProps({
  profile: Object,
  editMode: Boolean,
})

defineEmits(['toggle-edit'])
</script>
