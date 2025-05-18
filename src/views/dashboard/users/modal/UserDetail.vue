<template>
  <teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="close"
    >
      <BaseCard type="single" variant="secondary" class="w-[40vw] max-w-4xl">
        <!-- HEADER -->
        <div class="flex items-center space-x-6">
          <img
            :src="user.photo || defaultAvatar"
            alt="Foto Profil"
            class="w-28 h-28 rounded-full object-cover ring-2 ring-indigo-500"
          />
          <div>
            <h2 class="text-3xl font-semibold ">{{ user.name }}</h2>
            <p class="text-sm ">{{ user.email }}</p>
            <span
              class="mt-2 inline-block text-sm px-3 py-1 rounded-full font-medium bg-indigo-100 text-indigo-600"
            >
              {{ user.role }}
            </span>
          </div>
        </div>

        <!-- BIO -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold  mb-2">Bio</h3>
          <p class=" whitespace-pre-line">
            {{ user.bio || 'Belum ada bio.' }}
          </p>
        </div>
      </BaseCard>
    </div>
  </teleport>
</template>

<script setup>
import defaultAvatar from '@/assets/icons/user.png'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}
</script>
