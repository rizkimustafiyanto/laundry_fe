<script setup>
const themeClass = useThemeClass()

const props = defineProps({
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

const currentIndex = ref(0)
let autoplayTimer = null

const goTo = (index) => {
  if (!props.slides.length) return
  currentIndex.value = (index + props.slides.length) % props.slides.length
  emit('update:selected', props.slides[currentIndex.value])
}

const nextSlide = () => {
  goTo(currentIndex.value + 1)
}

const prevSlide = () => {
  goTo(currentIndex.value - 1)
}

const handleClick = (slide) => {
  emit('slideClick', slide)
  emit('update:selected', slide)
}

onMounted(() => {
  if (props.slides.length > 1 && props.autoplayOptions) {
    autoplayTimer = setInterval(() => {
      nextSlide()
    }, props.autoplayOptions.delay || 3000)
  }
})

onBeforeUnmount(() => {
  if (autoplayTimer) clearInterval(autoplayTimer)
})
</script>

<template>
  <div class="relative group w-full overflow-hidden rounded-xl">
    <div
      class="flex transition-transform duration-700 ease-in-out"
      :style="{
        transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)`,
        width: `${slides.length * (100 / slidesPerView)}%`,
      }"
    >
      <div
        v-for="slide in slides"
        :key="slide.id"
        class="w-full flex-shrink-0 cursor-pointer"
        :style="{ width: `${100 / slidesPerView}%` }"
        @click="handleClick(slide)"
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
              class="absolute left-4 right-4 px-4 py-2 rounded-lg text-sm sm:text-base w-fit"
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
      </div>
    </div>

    <button
      v-if="navigation && slides.length > 1"
      @click="prevSlide"
      class="absolute top-1/2 -translate-y-1/2 left-2 p-2 rounded-full shadow-lg"
      :class="themeClass.button.secondary"
    >
      <i class="fa fa-chevron-left"></i>
    </button>

    <button
      v-if="navigation && slides.length > 1"
      @click="nextSlide"
      class="absolute top-1/2 -translate-y-1/2 right-2 p-2 rounded-full shadow-lg"
      :class="themeClass.button.secondary"
    >
      <i class="fa fa-chevron-right"></i>
    </button>

    <div
      v-if="pagination && slides.length > 1"
      class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2"
    >
      <span
        v-for="(slide, index) in slides"
        :key="index"
        class="w-3 h-3 rounded-full cursor-pointer transition-all"
        :class="[currentIndex === index ? themeClass.bg.primary : themeClass.bg.muted]"
        @click="goTo(index)"
      ></span>
    </div>
  </div>
</template>
