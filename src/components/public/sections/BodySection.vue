<template>
  <div v-if="profile" class="w-full overflow-hidden">
    <!-- HERO -->
<section
  v-if="profile"
  class="relative min-h-[85vh] flex items-center justify-center text-center"
>
  <img
    v-if="profile.heroImageUrl"
    :src="heroImage"
    alt="Hero Background"
    class="absolute inset-0 w-full h-full object-cover brightness-75"
  />
  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>

  <div class="relative z-10 max-w-3xl mx-auto px-6 text-white">
    <h1 class="text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-lg mb-4">
      {{ profile.heroTitle || profile.name }}
    </h1>
    <p v-if="profile.heroSubtitle" class="text-lg md:text-2xl mb-8 opacity-90">
      {{ profile.heroSubtitle }}
    </p>
    <a
      v-if="profile.ctaUrl && profile.ctaText"
      :href="profile.ctaUrl"
      class="inline-block bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full shadow-lg font-semibold transition-all duration-300 hover:-translate-y-1"
    >
      {{ profile.ctaText }}
    </a>
  </div>
</section>


    <!-- ABOUT -->
    <section
      v-if="about"
      class="py-20 bg-white text-center px-6"
    >
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          {{ about.title || 'Tentang Kami' }}
        </h2>
        <p
          v-if="about.description"
          class="text-gray-600 leading-relaxed text-lg"
        >
          {{ about.description }}
        </p>
      </div>
    </section>

    <!-- SERVICES -->
    <section
      v-if="services.length"
      id="services"
      class="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div class="max-w-7xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-12">
          Layanan Kami
        </h2>

        <div
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center"
        >
          <div
            v-for="service in services"
            :key="service.id"
            class="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full max-w-sm border border-gray-100"
          >
            <div
              v-if="service.icon"
              class="w-20 h-20 mx-auto flex items-center justify-center bg-teal-100 text-teal-600 rounded-full text-4xl mb-5 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300"
            >
              <i :class="service.icon" />
            </div>

            <h3 class="text-xl font-semibold text-gray-800 mb-2">
              {{ service.title }}
            </h3>

            <p class="text-gray-600 text-sm leading-relaxed">
              {{ service.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SPONSORS -->
    <section
      v-if="sponsors.length"
      id="sponsors"
      class="py-16 bg-white border-t border-gray-100"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-2xl font-semibold mb-8 text-gray-800">
          Sponsor & Partner Kami
        </h2>
        <div class="flex flex-wrap justify-center items-center gap-10">
          <img
            v-for="media in sponsors"
            :key="media.id"
            :src="`${__BASE_URL__}${media.url}`"
            alt="Sponsor Logo"
            class="h-14 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
          />
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section
      v-if="testimonials.length"
      id="testimonials"
      class="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-12 text-gray-800">
          Apa Kata Pelanggan Kami
        </h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="testi in testimonials"
            :key="testi.id"
            class="bg-white p-8 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <p class="italic text-gray-600 mb-4">
              “{{ testi.description }}”
            </p>
            <div class="flex justify-between items-center">
              <h4 class="font-semibold text-gray-800">
                {{ testi.title }}
              </h4>
              <p
                v-if="testi.rating"
                class="text-yellow-500 font-medium"
              >
                ⭐ {{ testi.rating }}/5
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- GALLERY -->
    <section
      v-if="galleries.length"
      id="gallery"
      class="py-20 bg-white border-t border-gray-100"
    >
      <div class="max-w-6xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-12 text-gray-800">
          Galeri Kami
        </h2>

        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <img
            v-for="g in galleries"
            :key="g.id"
            :src="`${__BASE_URL__}${g.url}`"
            alt="Gallery"
            class="rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 object-cover w-full h-48"
          />
        </div>
      </div>
    </section>
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
  profile.value?.heroImageUrl
    ? `${__BASE_URL__}${profile.value.heroImageUrl}`
    : defaultLogo
)


const about = computed(() =>
  contents.value.find((c) => c.type === 'ABOUT') || null
)

const services = computed(() =>
  contents.value.filter((c) => c.type === 'SERVICE') || []
)

const sponsors = computed(() =>
  medias.value.filter((m) => m.type === 'SPONSOR') || []
)

const testimonials = computed(() =>
  contents.value.filter((c) => c.type === 'TESTIMONIAL') || []
)

const galleries = computed(() =>
  medias.value.filter((m) => m.type === 'GALLERY') || []
)

onMounted(async () => {
  await Promise.all([
    profileStore.fetchItems(),
    contentStore.fetchItems(),
    mediaStore.fetchItems(),
  ])
})
</script>
