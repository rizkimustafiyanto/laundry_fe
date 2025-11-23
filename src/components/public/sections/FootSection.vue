<template>
  <div class="bg-[#1A1A1A] py-12 text-gray-100 w-full relative z-[2]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0"
      >
        <div class="flex flex-col items-start space-y-4">
          <img :src="companySafe.logoUrl" alt="Logo" class="w-28 h-auto object-contain" />
          <h2 v-if="companySafe.name" class="text-xl font-bold">{{ companySafe.name }}</h2>
          <p v-if="companySafe.about" class="text-sm max-w-xs">{{ companySafe.about }}</p>
        </div>

        <div class="flex flex-col space-y-2 text-sm">
          <div v-if="companySafe.email">
            <span class="font-semibold">Email:</span> {{ companySafe.email }}
          </div>
          <div v-if="companySafe.phone">
            <span class="font-semibold">Phone:</span> {{ companySafe.phone }}
          </div>
          <div v-if="companySafe.address">
            <span class="font-semibold">Address:</span> {{ companySafe.address }}
          </div>
        </div>

        <div v-if="companySafe.hasSocial" class="flex flex-col space-y-2">
          <span class="font-semibold">Follow Us</span>
          <div class="flex space-x-3">
            <a
              v-if="companySafe.facebookUrl"
              :href="companySafe.facebookUrl"
              target="_blank"
              :class="themeClass.icon.primary"
              title="Follow on Facebook"
            >
              <i class="fa-brands fa-facebook text-xl"></i>
            </a>
            <a
              v-if="companySafe.instagramUrl"
              :href="companySafe.instagramUrl"
              target="_blank"
              :class="themeClass.icon.softPink"
              title="Follow on Instagram"
            >
              <i class="fa-brands fa-instagram text-xl"></i>
            </a>
            <a
              v-if="companySafe.twitterUrl"
              :href="companySafe.twitterUrl"
              target="_blank"
              :class="themeClass.icon.info"
              title="Follow on Twitter"
            >
              <i class="fa-brands fa-twitter text-xl"></i>
            </a>
            <a
              v-if="companySafe.linkedinUrl"
              :href="companySafe.linkedinUrl"
              target="_blank"
              :class="themeClass.icon.primary"
              title="Follow on LinkedIn"
            >
              <i class="fa-brands fa-linkedin text-xl"></i>
            </a>
            <a
              v-if="companySafe.tiktokUrl"
              :href="companySafe.tiktokUrl"
              target="_blank"
              :class="themeClass.icon.dark"
              title="Follow on TikTok"
            >
              <i class="fa-brands fa-tiktok text-xl"></i>
            </a>
          </div>
        </div>

        <div v-if="companySafe.sponsors.length" class="flex flex-col space-y-2">
          <span class="font-semibold">Sponsors</span>
          <div class="flex space-x-3">
            <a
              v-for="sponsor in companySafe.sponsors"
              :key="sponsor.id"
              :href="sponsor.link || '#'"
              target="_blank"
            >
              <img
                :src="sponsor.logoUrl || '/default-sponsor.png'"
                :alt="sponsor.sponsorName || 'Sponsor'"
                class="w-8 h-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center text-sm text-gray-400">
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

const themeClass = useThemeClass()

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
