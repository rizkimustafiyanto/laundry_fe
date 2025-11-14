<template>
  <div v-if="profile" id="top" class="w-full overflow-hidden text-[#F5F5F5] bg-[#0D0D0D]">
    <div
      v-if="bgbodymain.length > 0"
      class="fixed inset-0"
      :style="{
        zIndex: 0,
        backgroundImage: `url(${bgImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }"
    >
      <div
        class="absolute inset-0 bg-gradient-to-b from-[#0D0D0D]/80 via-[#1A1A1A]/70 to-[#0D0D0D]/90"
      />
      <div
        class="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
      />
      <div
        class="absolute inset-0 bg-gradient-radial from-[#C6A667]/10 via-transparent to-transparent animate-pulse-slow"
      />
    </div>

    <div class="relative z-[2]">
      <section
        class="relative min-h-[90vh] flex items-center justify-center text-center px-5 fade-up"
      >
        <img
          v-if="profile.heroImageUrl"
          :src="heroImage"
          class="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
        />

        <div
          class="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/90 via-[#C6A667]/20 to-transparent"
        />

        <svg
          class="absolute inset-0 w-full h-full opacity-10 animate-pulse-slow"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20%" cy="30%" r="60" fill="#ffffff" />
          <circle cx="70%" cy="40%" r="90" fill="#ffffff" />
          <circle cx="50%" cy="70%" r="40" fill="#ffffff" />
        </svg>

        <div class="relative z-10 max-w-3xl text-[#F5F5F5] drop-shadow-lg">
          <h1 class="text-5xl md:text-7xl font-extrabold mb-5 tracking-tight leading-tight">
            {{ profile.heroTitle || profile.name }}
          </h1>
          <p
            v-if="profile.heroSubtitle"
            class="text-lg md:text-2xl opacity-90 mb-8 font-light leading-relaxed text-[#D4D4D4]"
          >
            {{ profile.heroSubtitle }}
          </p>

          <a
            v-if="profile.ctaUrl && profile.ctaText"
            :href="profile.ctaUrl"
            class="inline-flex bg-[#C6A667] hover:bg-[#9E864F] px-8 py-4 rounded-full font-semibold shadow-lg transition-all hover:-translate-y-1 text-lg text-[#0D0D0D]"
          >
            {{ profile.ctaText }}
          </a>
        </div>
      </section>

      <section
        v-if="about"
        id="about"
        class="py-28 bg-[#1A1A1A]/60 backdrop-blur-sm text-center fade-up shadow-[0_0_40px_rgba(198,166,103,0.15)]"
      >
        <div class="max-w-4xl mx-auto px-6">
          <h2 class="text-4xl font-bold mb-7 text-[#C6A667]">
            {{ about.title || 'Tentang Kami' }}
          </h2>
          <p class="text-lg text-[#D4D4D4] leading-relaxed">
            {{ about.description }}
          </p>
        </div>
      </section>

      <section
        id="services"
        class="py-28 bg-[#1A1A1A]/70 backdrop-blur-lg fade-up"
        v-if="services.length"
      >
        <div class="max-w-7xl mx-auto px-6 text-center">
          <h2 class="text-4xl font-bold mb-14 text-[#C6A667]">Layanan Unggulan</h2>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div
              v-for="service in services"
              :key="service.id"
              class="bg-[#0D0D0D]/80 backdrop-blur-md p-8 rounded-3xl shadow-md border border-[#C6A667]/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                v-if="service.icon"
                class="w-20 h-20 mx-auto flex items-center justify-center bg-[#C6A667]/20 text-[#C6A667] rounded-full text-4xl mb-6"
              >
                <i :class="service.icon" />
              </div>

              <h3 class="text-2xl font-semibold mb-3 text-[#F5F5F5]">
                {{ service.title }}
              </h3>
              <p class="text-[#D4D4D4]">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="testimonial"
        class="py-28 bg-[#1A1A1A]/80 backdrop-blur-sm fade-up"
        v-if="testimonials.length"
      >
        <div class="max-w-6xl mx-auto text-center px-6">
          <h2 class="text-4xl font-bold mb-14 text-[#C6A667]">Testimoni</h2>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="testi in testimonials"
              :key="testi.id"
              class="p-7 bg-[#0D0D0D]/80 backdrop-blur-lg rounded-3xl shadow-md border border-[#C6A667]/20 hover:shadow-xl transition"
            >
              <p class="italic text-[#D4D4D4] mb-4">“{{ testi.description }}”</p>
              <div class="flex justify-between items-center mt-4">
                <span class="font-semibold text-[#F5F5F5]">{{ testi.title }}</span>
                <span v-if="testi.rating" class="text-[#C6A667] font-medium"
                  >⭐ {{ testi.rating }}/5</span
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="gallery"
        class="py-28 bg-[#1A1A1A]/80 backdrop-blur-sm fade-up"
        v-if="galleries.length"
      >
        <div class="max-w-6xl mx-auto text-center px-6">
          <h2 class="text-4xl font-bold mb-12 text-[#C6A667]">Galeri</h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div
              v-for="g in galleries"
              :key="g.id"
              class="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <img
                :src="`${__BASE_URL__}${g.url}`"
                class="w-full h-48 object-cover hover:scale-110 transition duration-500 rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="sponsors"
        class="py-20 bg-[#1A1A1A]/70 backdrop-blur-[1px] fade-up"
        v-if="sponsors.length"
      >
        <div class="max-w-6xl mx-auto text-center px-6">
          <h2 class="text-2xl font-semibold mb-10 text-[#C6A667]">Partner & Sponsor</h2>
          <div class="flex flex-wrap justify-center gap-12 items-center">
            <img
              v-for="media in sponsors"
              :key="media.id"
              :src="`${__BASE_URL__}${media.url}`"
              class="h-14 grayscale hover:grayscale-0 transition duration-300 opacity-80 hover:opacity-100"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import defaultLogo from '@/assets/logo.svg'

const profileStore = useCompanyProfileStore()
const contentStore = useCompanyContentStore()
const mediaStore = useCompanyMediaStore()

const { items: profiles } = storeToRefs(profileStore)
const { items: contents } = storeToRefs(contentStore)
const { items: medias } = storeToRefs(mediaStore)

const profile = computed(() => profiles.value[0] || null)

const heroImage = computed(() =>
  profile.value?.heroImageUrl ? `${__BASE_URL__}${profile.value.heroImageUrl}` : defaultLogo,
)

const about = computed(() => contents.value.find((c) => c.type === 'ABOUT') || null)
const services = computed(() => contents.value.filter((c) => c.type === 'SERVICE') || [])
const sponsors = computed(() => medias.value.filter((m) => m.type === 'SPONSOR') || [])
const testimonials = computed(() => contents.value.filter((c) => c.type === 'TESTIMONI') || [])
const galleries = computed(
  () => medias.value.filter((m) => !['SPONSOR', 'BG_MAIN', 'TESTIMONI'].includes(m.type)) || [],
)
const bgbodymain = computed(() => medias.value.filter((m) => m.type === 'BG_MAIN') || [])

const bgImageUrl = computed(() => {
  if (!bgbodymain.value.length) return null
  return `${__BASE_URL__}${bgbodymain.value[0].url}`
})

const animateOnScroll = () => {
  const elements = document.querySelectorAll('.fade-up')
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show')
        }
      })
    },
    { threshold: 0.1 },
  )

  elements.forEach((el) => observer.observe(el))
}

onMounted(async () => {
  await Promise.all([contentStore.fetchItems(), mediaStore.fetchItems()])
  await nextTick()
  animateOnScroll()
})
</script>

<style scoped>
.fade-up {
  opacity: 0;
  transform: translateY(30px);
  transition: all 2s ease-out;
}

.show {
  opacity: 1;
  transform: translateY(0);
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.05);
  }
}
.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

/* Mobile Safari fix */
@media (max-width: 768px) {
  [style*='background-attachment: fixed'] {
    background-attachment: scroll !important;
  }
}
</style>
