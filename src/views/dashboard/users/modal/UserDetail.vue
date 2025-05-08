<template>
  <teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click.self="close"
    >
      <div class="w-[40vw] max-w-4xl bg-white p-8 rounded-2xl shadow-xl">
        <div class="flex items-center space-x-6">
          <img
            :src="user.profilePicture || defaultAvatar"
            alt="Foto Profil"
            class="w-28 h-28 rounded-full object-cover ring-2 ring-indigo-500"
          />
          <div>
            <h2 class="text-3xl font-semibold text-gray-800">{{ user.name }}</h2>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
            <span
              class="mt-2 inline-block text-sm px-3 py-1 rounded-full font-medium bg-indigo-100 text-indigo-600"
            >
              {{ user.role }}
            </span>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Bio</h3>
          <p class="text-gray-600 whitespace-pre-line">
            {{ user.bio || 'Belum ada bio.' }}
          </p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
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

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=4f46e5&color=ffffff'
</script>
