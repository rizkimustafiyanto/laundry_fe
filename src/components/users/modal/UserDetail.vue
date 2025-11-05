<template>
  <teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 md:px-0 bg-black bg-opacity-50 backdrop-blur-sm"
      @click.self="close"
    >
      <BaseCard
        type="single"
        variant="secondary"
        class="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl relative"
        :class="[
          themeClass.baseDiv.secondary,
          themeClass.border.secondary,
          'rounded-2xl shadow-lg',
        ]"
      >
        <button
          @click="close"
          class="absolute top-4 right-4 p-2 rounded-full transition"
          :class="[themeClass.icon.subtle]"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div
          class="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0"
        >
          <div class="relative">
            <img
              :src="`${__BASE_URL__}${user.photo}`"
              alt="Foto Profil"
              class="w-28 h-28 rounded-full object-cover ring-2"
              :class="themeClass.border.primary"
              @error="$event.target.src = defaultAvatar"
            />
          </div>

          <div class="text-center sm:text-left space-y-2">
            <h2
              class="text-xl sm:text-xl font-semibold flex items-center justify-center sm:justify-start gap-2"
              :class="themeClass.text.secondary"
            >
              <i class="fa-solid fa-user" :class="themeClass.icon.primary"></i>
              {{ user.name }}
            </h2>
            <p
              :class="[
                themeClass.text.subtleMeta,
                'text-sm flex items-center justify-center sm:justify-start gap-2 px-1',
              ]"
            >
              <i class="fa-solid fa-envelope" :class="themeClass.icon.info"></i>
              {{ user.email }}
            </p>
            <BaseBadge
              variant-text="secondary"
              variant-b-g-color="sky"
              variant-hover="airy"
              text-size="sm"
              rounded="full"
              class="inline-block text-sm px-3 py-1 mt-2 font-medium shadow-sm"
            >
              <i class="fa-solid fa-id-badge mr-1"></i>
              {{ formatText(user?.role) }}
            </BaseBadge>
          </div>
        </div>

        <div class="mt-6">
          <h3
            class="text-lg font-semibold mb-2 flex items-center gap-2"
            :class="themeClass.text.secondary"
          >
            <i class="fa-solid fa-quote-left" :class="themeClass.icon.secondary"></i>
            Bio
          </h3>
          <p class="whitespace-pre-line leading-relaxed" :class="themeClass.text.subtle">
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
