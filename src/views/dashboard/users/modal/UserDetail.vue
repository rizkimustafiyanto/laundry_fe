<template>
  <teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 md:px-0 bg-black bg-opacity-50"
      @click.self="close"
    >
      <BaseCard
        type="single"
        variant="secondary"
        class="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
      >
        <div
          class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <img
            :src="user.photo || defaultAvatar"
            alt="Foto Profil"
            class="w-28 h-28 rounded-full object-cover ring-2 ring-indigo-500"
          />
          <div class="text-center sm:text-left">
            <h2 class="text-2xl sm:text-3xl font-semibold">{{ user.name }}</h2>
            <p class="text-sm">{{ user.email }}</p>
            <span
              class="mt-2 inline-block text-sm px-3 py-1 rounded-full font-medium bg-indigo-100 text-indigo-600"
            >
              {{ user.role }}
            </span>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-2">Bio</h3>
          <p class="whitespace-pre-line">
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
