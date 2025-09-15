<template>
  <div class="max-w-full mx-auto text-center mt-24 px-4 space-y-5">
    <!-- Judul -->
    <h1 class="text-4xl md:text-5xl font-extrabold mb-4" :class="themeClass.text.secondary">
      Selamat Datang di {{ companyName }}
    </h1>

    <!-- Deskripsi -->
    <p class="text-lg md:text-xl pb-8" :class="themeClass.text.secondary">
      {{ companyAbout }}
    </p>

    <!-- Logo -->
    <div class="pb-12">
      <img
        :src="companyLogo"
        :alt="companyName + ' Logo'"
        class="rounded-2xl shadow-lg mx-auto max-h-20 object-cover"
        @error="onLogoError"
      />
    </div>

    <!-- Services -->
    <BaseCard type="grid" :cols="3" gridDirection="row" variant="secondary">
      <BaseCard
        v-for="(service, index) in services"
        :key="index"
        variant="mist"
        classOverride="p-6 hover:shadow-md transition"
      >
        <h3 :class="['text-xl font-semibold mb-2', themeClass.text.teal]">
          {{ service.title }}
        </h3>
        <p :class="themeClass.text.secondary">
          {{ service.description }}
        </p>
      </BaseCard>
    </BaseCard>

    <!-- Galleries (Testimoni/Foto) -->
    <div v-if="companyGalleries.length" class="py-6">
      <h2 class="text-2xl font-bold mb-6" :class="themeClass.text.secondary">Galeri Kami</h2>
      <div class="px-8">
        <BaseSlider
          :slides="companyGalleries"
          captionMode="outside"
          captionVariant="muted"
          image-mode="cover"
          fixed-height="max-h-[15rem] sm:max-h-[18rem] md:max-h-[25rem] min-h-[15rem] sm:min-h-[18rem] md:min-h-[25rem]"
        />
      </div>
    </div>

    <!-- CTA -->
    <div class="pt-12">
      <a
        :href="ctaLink"
        class="inline-block px-6 py-3 rounded-lg shadow font-semibold transition"
        :class="[themeClass.button.teal, themeClass.hoverless.teal]"
      >
        {{ ctaLabel }}
      </a>
    </div>
  </div>
</template>

<script setup>
import defaultLogo from '@/assets/logo.svg'

const store = useCompanyProfileStore()
const { items } = storeToRefs(store)
const themeClass = useThemeClass()

const companyLogo = ref(defaultLogo)
const companyName = ref('LaundryKuy')
const companyAbout = ref(
  'Solusi laundry cepat, bersih, dan terpercaya untuk kebutuhan harian Anda.',
)
const ctaLabel = ref('Pesan Sekarang')
const ctaLink = ref('#')

// galleries khusus untuk slider
const companyGalleries = ref([])

const services = ref([
  {
    title: 'Layanan Antar Jemput',
    description:
      'Kami jemput cucian Anda langsung ke rumah dan antar kembali setelah bersih dan wangi.',
  },
  {
    title: 'Cuci Kering & Lipat',
    description: 'Pakaian Anda dicuci dan dilipat rapi, siap langsung masuk lemari.',
  },
  {
    title: 'Layanan Kilat 24 Jam',
    description: 'Butuh cepat? Gunakan layanan express kami yang selesai dalam 24 jam.',
  },
])

watch(
  items,
  (newItems) => {
    if (newItems && newItems.length > 0) {
      const company = newItems[0]
      companyLogo.value = company.logoUrl ? `${__BASE_URL__}${company.logoUrl}` : defaultLogo
      companyName.value = company.name || 'LaundryKuy'
      companyAbout.value = company.about || companyAbout.value

      // mapping galleries untuk slider
      if (company.galleries && company.galleries.length > 0) {
        companyGalleries.value = company.galleries.filter((g) => !g.deletedAt)
      }

      ctaLabel.value = 'Pesan Sekarang'
      ctaLink.value = '/dashboard'
    }
  },
  { immediate: true },
)

function onLogoError(event) {
  event.target.src = defaultLogo
}
</script>
