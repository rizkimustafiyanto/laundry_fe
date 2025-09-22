<template>
  <div>
    <section
      class="relative bg-cover bg-center min-h-[80vh] flex items-center justify-center"
      :style="{ backgroundImage: `url(${logoSrc})` }"
    >
      <div class="absolute inset-0 bg-black/50"></div>
      <div class="relative z-10 text-center text-white px-6">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-4">
          {{ companyName }}
        </h1>
        <p class="text-lg md:text-2xl mb-6 max-w-2xl mx-auto">
          {{ companyAbout }}
        </p>
        <a
          :href="ctaLink"
          class="inline-block bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-lg shadow-lg font-semibold transition"
        >
          {{ ctaLabel }}
        </a>
      </div>
    </section>

    <section id="services" class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-12">Layanan Kami</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <BaseCard
            v-for="(service, index) in services"
            :key="index"
            class="p-8 bg-white shadow-md rounded-xl hover:shadow-xl transition"
          >
            <div
              class="w-16 h-16 mx-auto mb-4 bg-teal-100 text-teal-600 flex items-center justify-center rounded-full text-3xl"
            >
              <font-awesome-icon :icon="service.icon" />
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ service.title }}</h3>
            <p class="text-gray-600">{{ service.description }}</p>
          </BaseCard>
        </div>
      </div>
    </section>

    <section id="gallery" class="py-20">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-12">Galeri Kami</h2>
        <BaseSlider
          v-if="companyGalleries.length"
          :slides="companyGalleries"
          captionMode="overlay-top"
          captionVariant="muted"
          image-mode="cover"
          fixed-height="h-[20rem] md:h-[28rem]"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import defaultLogo from '@/assets/logo.svg'

const store = useCompanyProfileStore()
const { items } = storeToRefs(store)

const logoSrc = ref(defaultLogo)
const companyName = ref('LaundryKuy')
const companyAbout = ref(
  'Solusi laundry cepat, bersih, dan terpercaya untuk kebutuhan harian Anda.',
)
const ctaLabel = ref('Pesan Sekarang')
const ctaLink = ref('/dashboard')

const companyGalleries = ref([])

const services = ref([
  {
    title: 'Layanan Antar Jemput',
    description: 'Kami jemput cucian Anda langsung ke rumah dan antar kembali setelah bersih.',
    icon: 'truck',
  },
  {
    title: 'Cuci Kering & Lipat',
    description: 'Pakaian dicuci dan dilipat rapi, siap masuk lemari.',
    icon: 'tshirt',
  },
  {
    title: 'Layanan Kilat 24 Jam',
    description: 'Butuh cepat? Gunakan layanan express selesai dalam 24 jam.',
    icon: 'clock',
  },
])

watch(
  items,
  (newItems) => {
    if (newItems && newItems.length > 0) {
      const company = newItems[0]
      companyName.value = company.name || 'LaundryKuy'
      companyAbout.value = company.about || companyAbout.value
      logoSrc.value = newItems[0].logoUrl ? `${__BASE_URL__}${newItems[0].logoUrl}` : defaultLogo
      if (company.galleries && company.galleries.length > 0) {
        companyGalleries.value = company.galleries.filter((g) => !g.deletedAt)
      }
    }
  },
  { immediate: true },
)
</script>
