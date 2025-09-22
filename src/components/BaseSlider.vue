<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

const themeClass = useThemeClass()

defineProps({
  slides: {
    type: Array,
    default: () => [],
  },
  slidesPerView: {
    type: Number,
    default: 1,
  },
  autoplayOptions: {
    type: [Object, Boolean],
    default: () => ({
      delay: 3000,
      disableOnInteraction: false,
    }),
  },
  showCaption: {
    type: Boolean,
    default: true,
  },
  captionMode: {
    type: String,
    default: 'overlay-bottom',
    validator: (value) => ['overlay-bottom', 'overlay-top', 'outside'].includes(value),
  },
  captionVariant: {
    type: String,
    default: 'muted',
  },
  imageMode: {
    type: String,
    default: 'cover',
    validator: (value) => ['cover', 'contain', 'fill', 'none', 'scale-down'].includes(value),
  },
  fixedHeight: {
    type: String,
    default: 'min-h-[15rem] sm:min-h-[18rem] md:min-h-[20rem]',
  },
  effect: {
    type: String,
    default: 'fade',
  },
  pagination: {
    type: [Boolean, Object],
    default: true,
  },
  navigation: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['slideClick', 'update:selected'])

const handleClick = (slide) => {
  emit('slideClick', slide)
  emit('update:selected', slide)
}
</script>

<template>
  <div class="relative group w-full">
    <Swiper
      v-if="slides.length"
      :modules="[Navigation, Pagination, Autoplay, EffectFade]"
      :slides-per-view="slidesPerView"
      :loop="slides.length > 1"
      :autoplay="slides.length > 1 ? autoplayOptions : false"
      :effect="effect"
      :pagination="pagination"
      :navigation="navigation"
      class="rounded-xl overflow-hidden"
    >
      <SwiperSlide
        v-for="slide in slides"
        :key="slide.id"
        @click="handleClick(slide)"
        class="cursor-pointer flex flex-col"
      >
        <div class="relative w-full">
          <img
            :src="`${__BASE_URL__}${slide.imageUrl}`"
            :alt="slide.caption || 'slide image'"
            class="w-full rounded-xl"
            :class="[fixedHeight, `object-${imageMode}`]"
          />

          <template v-if="showCaption && slide.caption && captionMode !== 'outside'">
            <div
              class="absolute left-4 right-4 px-4 py-2 rounded-lg text-sm sm:text-base overflow-hidden w-fit"
              :class="[
                themeClass.baseDiv[captionVariant] || themeClass.baseDiv.muted,
                captionMode === 'overlay-bottom' ? 'bottom-4' : 'top-4',
              ]"
            >
              <p class="truncate">
                {{ slide.caption }}
              </p>
            </div>
          </template>
        </div>

        <template v-if="showCaption && slide.caption && captionMode === 'outside'">
          <p
            class="mt-2 text-sm sm:text-base"
            :class="themeClass.text[captionVariant] || themeClass.text.secondary"
          >
            {{ slide.caption }}
          </p>
        </template>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  opacity: 0 !important;
  transform: translateX(20px);
  transition: all 0.3s ease-in-out;
}

:deep(.swiper-button-prev) {
  transform: translateX(-20px);
}

.group:hover :deep(.swiper-button-next),
.group:hover :deep(.swiper-button-prev) {
  opacity: 1 !important;
  transform: translateX(0);
}

:deep(.swiper-pagination-bullet) {
  background: #d1d5db;
  opacity: 1;
}
:deep(.swiper-pagination-bullet-active) {
  background: #14b8a6;
}
</style>
