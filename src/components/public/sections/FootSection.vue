<template>
  <div class="bg-[#1A1A1A] py-10 text-gray-100 w-full relative z-[2]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div
          class="flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:col-span-1"
        >
          <img :src="companySafe.logoUrl" alt="Logo" class="w-24 md:w-28 h-auto object-contain" />

          <h2 v-if="companySafe.name" class="text-lg md:text-xl font-semibold">
            {{ companySafe.name }}
          </h2>

          <p v-if="companySafe.about" class="text-sm text-gray-300 leading-relaxed">
            {{ companySafe.about }}
          </p>
        </div>

        <div
          class="flex flex-col space-y-3 text-sm items-center md:items-start text-center md:text-left md:col-span-1"
        >
          <div
            v-if="companySafe.email"
            class="flex flex-col md:flex-row items-center md:items-start gap-2"
          >
            <span class="font-semibold">Email:</span>
            <span class="text-gray-300 break-all">{{ companySafe.email }}</span>
          </div>

          <div
            v-if="companySafe.phone"
            class="flex flex-col md:flex-row items-center md:items-start gap-2"
          >
            <span class="font-semibold">Phone:</span>
            <span class="text-gray-300">{{ companySafe.phone }}</span>
          </div>

          <div
            v-if="companySafe.address"
            class="flex flex-col md:flex-row items-center md:items-start gap-2"
          >
            <span class="font-semibold">Address:</span>
            <span class="text-gray-300 leading-relaxed">{{ companySafe.address }}</span>
          </div>
        </div>

        <div
          v-if="companySafe.hasSocial"
          class="flex flex-col space-y-4 items-center md:items-start text-center md:text-left md:col-span-1"
        >
          <span class="font-semibold">Follow Us</span>

          <div class="flex items-center justify-center md:justify-start flex-wrap gap-4">
            <a
              v-if="companySafe.facebookUrl"
              :href="companySafe.facebookUrl"
              target="_blank"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition"
            >
              <i class="fa-brands fa-facebook text-lg"></i>
            </a>

            <a
              v-if="companySafe.instagramUrl"
              :href="companySafe.instagramUrl"
              target="_blank"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-pink-500 hover:bg-pink-600 transition"
            >
              <i class="fa-brands fa-instagram text-lg"></i>
            </a>

            <a
              v-if="companySafe.twitterUrl"
              :href="companySafe.twitterUrl"
              target="_blank"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500 hover:bg-sky-600 transition"
            >
              <i class="fa-brands fa-twitter text-lg"></i>
            </a>

            <a
              v-if="companySafe.linkedinUrl"
              :href="companySafe.linkedinUrl"
              target="_blank"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 hover:bg-blue-800 transition"
            >
              <i class="fa-brands fa-linkedin text-lg"></i>
            </a>

            <a
              v-if="companySafe.tiktokUrl"
              :href="companySafe.tiktokUrl"
              target="_blank"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-black hover:bg-gray-800 transition"
            >
              <i class="fa-brands fa-tiktok text-lg"></i>
            </a>
          </div>
        </div>

        <div
          v-if="companySafe.sponsors.length"
          class="flex flex-col space-y-4 items-center md:items-start text-center md:text-left md:col-span-1"
        >
          <span class="font-semibold">Sponsors</span>

          <div class="flex items-center justify-center md:justify-start flex-wrap gap-4">
            <a
              v-for="sponsor in companySafe.sponsors"
              :key="sponsor.id"
              :href="sponsor.link || '#'"
              target="_blank"
            >
              <img
                :src="sponsor.logoUrl || '/default-sponsor.png'"
                :alt="sponsor.sponsorName || 'Sponsor'"
                class="w-10 md:w-12 h-auto object-contain grayscale hover:grayscale-0 transition"
              />
            </a>
          </div>
        </div>
      </div>

      <div class="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        &copy; {{ new Date().getFullYear() }} {{ companySafe.name || 'Company' }}. All rights
        reserved.
      </div>
    </div>
  </div>
</template>

<script setup>
const store = useCompanyProfileStore()
const contentStore = useCompanyContentStore()
const mediaStore = useCompanyMediaStore()

const { items } = storeToRefs(store)
const { items: content } = storeToRefs(contentStore)
const { items: medias } = storeToRefs(mediaStore)

const company = ref(items.value[0] || {})
const sponsors = computed(() => content.value.filter((m) => m.type === 'SPONSOR') || [])
const media = computed(() => medias.value.filter((m) => m.type === 'SPONSOR') || [])

watch(items, (newItems) => {
  company.value = newItems[0] || {}
})

const companySafe = computed(() => ({
  name: company.value.name || '',
  email: company.value.email || '',
  phone: company.value.phone || '',
  address: company.value.address || '',
  about: company.value.about || '',
  logoUrl: company.value.logoUrl ? `${__BASE_URL__}${company.value.logoUrl}` : '/default-logo.png',
  facebookUrl: company.value.facebookUrl || '',
  instagramUrl: company.value.instagramUrl || '',
  twitterUrl: company.value.twitterUrl || '',
  linkedinUrl: company.value.linkedinUrl || '',
  tiktokUrl: company.value.tiktokUrl || '',
  sponsors:
    sponsors.value?.map((s) => {
      const sponsorMedia = media.value.find((m) => m.id === s.mediaId)

      return {
        ...s,
        logoUrl: sponsorMedia?.url ? `${__BASE_URL__}${sponsorMedia.url}` : '/default-sponsor.png',
        sponsorName: s.title || 'Sponsor',
      }
    }) || [],
  hasSocial:
    company.value.facebookUrl ||
    company.value.instagramUrl ||
    company.value.twitterUrl ||
    company.value.linkedinUrl ||
    company.value.tiktokUrl,
}))
</script>
