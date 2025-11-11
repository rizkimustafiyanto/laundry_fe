<template>
  <div v-if="profile" class="w-full overflow-hidden text-gray-800">
    <!-- ==== BACKGROUND BODY (NEW MODERN OVERLAY) ==== -->
    <div
      v-if="bgbodymaain.length > 0"
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
        class="absolute inset-0 bg-gradient-to-b from-[#0f172a]/70 via-[#0f172a]/50 to-[#020617]/80 backdrop-blur-[2px]"
      />
      <div
        class="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
      />
    </div>

    <div class="relative z-[2]">
      <!-- ===== HERO (Clean & bold modern) ===== -->
      <section
        class="relative min-h-[90vh] flex items-center justify-center text-center px-5 fade-up"
      >
        <img
          v-if="profile.heroImageUrl"
          :src="heroImage"
          class="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div class="relative z-10 max-w-3xl text-white">
          <h1 class="text-5xl md:text-7xl font-extrabold drop-shadow-lg mb-5 tracking-tight">
            {{ profile.heroTitle || profile.name }}
          </h1>
          <p
            v-if="profile.heroSubtitle"
            class="text-lg md:text-2xl opacity-80 mb-8 font-light leading-relaxed"
          >
            {{ profile.heroSubtitle }}
          </p>

          <a
            v-if="profile.ctaUrl && profile.ctaText"
            :href="profile.ctaUrl"
            class="inline-flex bg-teal-500 hover:bg-teal-600 px-8 py-4 rounded-full font-semibold shadow-lg transition-all hover:-translate-y-1 text-lg"
          >
            {{ profile.ctaText }}
          </a>
        </div>
      </section>

      <!-- ===== ABOUT (Glass but warmer tone) ===== -->
      <section
        v-if="about"
        id="about"
        class="py-28 bg-white/60 backdrop-blur-xl text-center fade-up border-b border-white/20"
      >
        <div class="max-w-4xl mx-auto px-6">
          <h2 class="text-4xl font-bold mb-7 text-gray-900">{{ about.title || 'Tentang Kami' }}</h2>
          <p class="text-lg text-gray-700 leading-relaxed">{{ about.description }}</p>
        </div>
      </section>

      <!-- ===== SERVICES (Subtle warm gray modern) ===== -->
      <section
        id="services"
        class="py-28 bg-gradient-to-b from-[#f8fafc]/70 to-white/60 backdrop-blur-lg fade-up"
        v-if="services.length"
      >
        <div class="max-w-7xl mx-auto px-6 text-center">
          <h2 class="text-4xl font-bold mb-14 text-gray-900">Layanan Unggulan</h2>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div
              v-for="service in services"
              :key="service.id"
              class="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-white/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                v-if="service.icon"
                class="w-20 h-20 mx-auto flex items-center justify-center bg-teal-100 text-teal-600 rounded-full text-4xl mb-6"
              >
                <i :class="service.icon" />
              </div>

              <h3 class="text-2xl font-semibold mb-3 text-gray-800">{{ service.title }}</h3>
              <p class="text-gray-600">{{ service.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== SPONSORS ===== -->
      <section
        id="sponsors"
        class="py-20 bg-white/60 backdrop-blur-lg fade-up border-t border-white/30"
        v-if="sponsors.length"
      >
        <div class="max-w-6xl mx-auto text-center px-6">
          <h2 class="text-2xl font-semibold mb-10 text-gray-800">Partner & Sponsor</h2>
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

      <!-- ===== TESTIMONIAL (Glass cards, modern clean) ===== -->
      <section
        id="testimonial"
        class="py-28 bg-gradient-to-b from-white/60 to-[#f8fafc]/50 backdrop-blur-lg fade-up"
        v-if="testimonials.length"
      >
        <div class="max-w-6xl mx-auto text-center px-6">
          <h2 class="text-4xl font-bold mb-14 text-gray-800">Testimoni</h2>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="testi in testimonials"
              :key="testi.id"
              class="p-7 bg-white/70 backdrop-blur-lg rounded-3xl shadow-lg border border-white/30 hover:shadow-xl transition"
            >
              <p class="italic text-gray-600 mb-4">“{{ testi.description }}”</p>
              <div class="flex justify-between items-center mt-4">
                <span class="font-semibold text-gray-800">{{ testi.title }}</span>
                <span v-if="testi.rating" class="text-yellow-500 font-medium"
                  >⭐ {{ testi.rating }}/5</span
                >
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ===== GALLERY (Modern hover zoom) ===== -->
      <section
        id="gallery"
        class="py-28 bg-white/60 backdrop-blur-xl fade-up"
        v-if="galleries.length"
      >
        <div class="max-w-6xl mx-auto text-center px-6">
          <h2 class="text-4xl font-bold mb-12 text-gray-900">Galeri</h2>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div v-for="g in galleries" :key="g.id" class="overflow-hidden rounded-2xl shadow-md">
              <img
                :src="`${__BASE_URL__}${g.url}`"
                class="w-full h-48 object-cover hover:scale-110 transition duration-500"
              />
            </div>
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

const testimonials = computed(() => contents.value.filter((c) => c.type === 'TESTIMONIAL') || [])

const galleries = computed(() => medias.value.filter((m) => m.type === 'GALLERY') || [])

const bgbodymaain = computed(() => medias.value.filter((m) => m.type === 'BODY_MAIN') || [])

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

const bgImageUrl = computed(() => {
  if (!bgbodymaain.value.length) return null
  return `${__BASE_URL__}${bgbodymaain.value[0].url}`
})

watch(bgImageUrl, (val) => {
  console.log('BG URL →', val)
})

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
</style>
