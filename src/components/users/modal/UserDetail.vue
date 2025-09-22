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
        :class="[themeClass.baseDiv.secondary, themeClass.border.secondary]"
      >
        <div
          class="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6"
        >
          <img
            :src="`${__BASE_URL__}${user.photo}`"
            alt="Foto Profil"
            class="w-28 h-28 rounded-full object-cover ring-1"
            :class="themeClass.border.indigo"
            @error="$event.target.src = defaultAvatar"
          />
          <div class="text-center sm:text-left">
            <h2 class="text-2xl sm:text-3xl font-semibold" :class="themeClass.text.secondary">
              {{ user.name }}
            </h2>
            <p :class="[themeClass.text.subtleMeta, 'text-sm p-1']">{{ user.email }}</p>
            <BaseBadge
              variant-text="secondary"
              variant-b-g-color="softPink"
              variant-hover="airy"
              text-size="sm"
              rounded="full"
              class="inline-block text-sm px-2 py-1 mt-2 rounded-xl font-medium"
            >
              {{ formatText(user?.role) }}
            </BaseBadge>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-2" :class="themeClass.text.secondary">Bio</h3>
          <p class="whitespace-pre-line" :class="themeClass.text.subtle">
            {{ user.bio || 'Belum ada bio.' }}
          </p>
        </div>
      </BaseCard>
    </div>
  </teleport>
</template>

<script setup>
import defaultAvatar from '@/assets/icons/user.png'

defineProps({
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

const themeClass = useThemeClass()

const close = () => {
  emit('close')
}
</script>
