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
        v-if="groupedPricing"
        id="pricing"
        class="py-28 bg-[#1A1A1A]/60 backdrop-blur-sm fade-up shadow-[0_0_40px_rgba(198,166,103,0.15)]"
      >
        <div class="max-w-7xl mx-auto px-6 text-center">
          <h2 class="text-4xl font-bold mb-14 text-[#C6A667]">Daftar Harga</h2>

          <div
            id="pricing-scroll"
            :class="[
              'flex gap-6 pb-6 snap-x snap-mandatory scrollbar-hide overflow-x-auto',
              Object.keys(groupedPricing).length < 4 ? 'lg:justify-center' : '',
            ]"
          >
            <div
              v-for="(group, service) in groupedPricing"
              :key="service"
              class="shrink-0 w-[85%] sm:w-[48%] md:w-[32%] lg:w-[24%] xl:w-[20%] bg-[#0D0D0D]/80 backdrop-blur-xl p-8 rounded-3xl border border-[#C6A667]/20 shadow-md hover:shadow-lg transition-all snap-start"
            >
              <h3 class="text-2xl font-semibold text-[#C6A667] mb-6 tracking-wide">
                {{ formatText(service) }}
              </h3>

              <div class="flex flex-col gap-6">
                <div
                  v-for="price in group.items"
                  :key="price.id"
                  @click="openModal(price)"
                  class="w-full p-5 rounded-2xl bg-[#1A1A1A]/60 border border-[#C6A667]/10 hover:border-[#C6A667]/40 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                >
                  <div class="w-full text-center mb-3">
                    <span class="text-lg font-semibold text-[#F5F5F5]">
                      {{ price.itemType?.name ? formatText(price.itemType?.name) : '-' }}
                    </span>
                  </div>

                  <div class="mt-2 text-[#D4D4D4] text-center">
                    <p class="text-sm opacity-80">Harga / Kg</p>
                    <p class="text-xl font-bold text-[#C6A667] mt-1">
                      Rp {{ price.pricePerKg.toLocaleString('id-ID') }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="text-[#D4D4D4] leading-relaxed text-center mt-10">
                <p v-if="group.description">
                  <strong class="text-[#C6A667] text-lg">Deskripsi Layanan:</strong><br />
                  <span class="opacity-90">{{ group.description }}</span>
                </p>

                <p v-else class="text-[#777] italic">Tidak ada deskripsi untuk layanan ini.</p>
              </div>
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
          <h2 class="text-4xl font-bold mb-14 text-[#C6A667]">Testimoni Pelanggan</h2>

          <div
            class="flex flex-col gap-8 max-h-[520px] overflow-y-auto lg:flex-row lg:overflow-x-auto lg:overflow-y-hidden justify-center scrollbar-hide pb-4"
          >
            <div
              v-for="(testi, i) in testimonials"
              :key="testi.id"
              class="w-full max-w-sm p-7 bg-[#0D0D0D]/80 backdrop-blur-lg rounded-3xl border border-[#C6A667]/20 shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(198,166,103,0.2)] animate-fade-up lg:shrink-0 lg:snap-start"
              :style="{ animationDelay: `${i * 120}ms` }"
            >
              <p class="italic text-[#D4D4D4] mb-6 leading-relaxed">“{{ testi.comment }}”</p>

              <div class="flex justify-between items-center mt-4">
                <span class="font-semibold text-[#F5F5F5]">
                  {{ testi.user.name }}
                </span>

                <span v-if="testi.rating" class="text-[#C6A667] font-medium text-sm">
                  ⭐ {{ testi.rating }}/5
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="gallery"
        class="py-28 bg-[#1A1A1A]/60 backdrop-blur-sm fade-up"
        v-if="galleries.length"
      >
        <div class="max-w-6xl mx-auto text-center px-6">
          <h2 class="text-4xl font-bold mb-12 text-[#C6A667]">Galeri</h2>

          <div
            class="flex flex-col sm:grid sm:grid-cols-2 sm:gap-4 max-h-[520px] overflow-y-auto lg:flex lg:flex-row lg:gap-6 lg:overflow-x-auto lg:overflow-y-hidden justify-center items-start scrollbar-hide pb-4"
          >
            <div
              v-for="g in galleries"
              :key="g.id"
              class="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition w-full sm:w-auto lg:w-[260px] lg:shrink-0 lg:snap-start"
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

          <div
            class="flex flex-col items-center gap-10 max-h-[420px] overflow-y-auto lg:flex-row lg:overflow-x-auto lg:overflow-y-hidden justify-center scrollbar-hide pb-4"
          >
            <img
              v-for="(media, i) in sponsors"
              :key="media.id"
              :src="media.logoUrl"
              class="h-14 grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100 lg:shrink-0 lg:snap-start"
              :style="{ animationDelay: `${i * 80}ms` }"
            />
          </div>
        </div>
      </section>
    </div>
    <PricingModal v-model="showModal" :price="selectedPrice" />
  </div>
</template>

<script setup>
import defaultLogo from '@/assets/logo.svg'
import PricingModal from '../PricingModal.vue'

const profileStore = useCompanyProfileStore()
const contentStore = useCompanyContentStore()
const mediaStore = useCompanyMediaStore()
const pricingStore = usePricingStore()
const reviewStore = useCompanyReviewStore()

const { items: profiles } = storeToRefs(profileStore)
const { items: contents } = storeToRefs(contentStore)
const { items: medias } = storeToRefs(mediaStore)
const { items: reviews } = storeToRefs(reviewStore)

const profile = computed(() => profiles.value[0] || null)

const heroImage = computed(() =>
  profile.value?.heroImageUrl ? `${__BASE_URL__}${profile.value.heroImageUrl}` : defaultLogo,
)

const about = computed(() => contents.value.find((c) => c.type === 'ABOUT') || null)
const services = computed(() => contents.value.filter((c) => c.type === 'SERVICE') || [])
const sponsors = computed(() =>
  contents.value
    .filter((c) => c.type === 'SPONSOR')
    .map((s) => {
      const sponsorMedia = medias.value.find((m) => m.id === s.mediaId)

      return {
        ...s,
        logoUrl: sponsorMedia?.url ? `${__BASE_URL__}${sponsorMedia.url}` : defaultLogo,
        sponsorName: s.title || 'Sponsor',
      }
    }),
)
const testimonials = computed(() => reviews.value)

const galleries = computed(
  () => medias.value.filter((m) => !['SPONSOR', 'BG_MAIN'].includes(m.type)) || [],
)
const bgbodymain = computed(() => medias.value.filter((m) => m.type === 'BG_MAIN') || [])

const bgImageUrl = computed(() => {
  if (!bgbodymain.value.length) return null
  return `${__BASE_URL__}${bgbodymain.value[0].url}`
})

const groupedPricing = computed(() => {
  const groups = {}

  pricingStore.items.forEach((price) => {
    const serviceName = price.serviceType?.name || 'Tanpa Layanan'

    if (!groups[serviceName]) {
      groups[serviceName] = {
        description: price.serviceType?.description || null,
        items: [],
      }
    }

    groups[serviceName].items.push(price)
  })

  return groups
})

const showModal = ref(false)
const selectedPrice = ref(null)

const openModal = (price) => {
  selectedPrice.value = price
  showModal.value = true
}

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
  await Promise.all([
    contentStore.fetchItems(),
    mediaStore.fetchItems(),
    pricingStore.fetchItems(),
    reviewStore.fetchByCompany(profile.value.id, { limit: 1000 }),
  ])
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

@media (max-width: 768px) {
  [style*='background-attachment: fixed'] {
    background-attachment: scroll !important;
  }
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  scrollbar-width: none;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-up {
  animation: fadeUp 0.7s ease forwards;
}
</style>
