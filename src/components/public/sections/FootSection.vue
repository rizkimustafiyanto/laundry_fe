<template>
  <div :class="themeClass.baseDiv.dark + ' py-12 text-gray-100'" class="w-full">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0"
      >
        <!-- Company Info -->
        <div class="flex flex-col items-start space-y-4">
          <img
            :src="`${__BASE_URL__}${company.logoUrl}`"
            alt="Logo"
            class="w-28 h-auto object-contain"
          />
          <h2 class="text-xl font-bold">{{ company.name }}</h2>
          <p class="text-sm max-w-xs">{{ company.about }}</p>
        </div>

        <!-- Contact Info -->
        <div class="flex flex-col space-y-2 text-sm">
          <div><span class="font-semibold">Email:</span> {{ company.email }}</div>
          <div><span class="font-semibold">Phone:</span> {{ company.phone }}</div>
          <div><span class="font-semibold">Address:</span> {{ company.address }}</div>
        </div>

        <!-- Social Media -->
        <div class="flex flex-col space-y-2">
          <span class="font-semibold">Follow Us</span>
          <div class="flex space-x-3">
            <a
              v-if="company.facebookUrl"
              :href="company.facebookUrl"
              target="_blank"
              class="hover:text-blue-500"
              >FB</a
            >
            <a
              v-if="company.instagramUrl"
              :href="company.instagramUrl"
              target="_blank"
              class="hover:text-pink-500"
              >IG</a
            >
            <a
              v-if="company.twitterUrl"
              :href="company.twitterUrl"
              target="_blank"
              class="hover:text-blue-400"
              >TT</a
            >
            <a
              v-if="company.linkedinUrl"
              :href="company.linkedinUrl"
              target="_blank"
              class="hover:text-blue-700"
              >LN</a
            >
            <a
              v-if="company.tiktokUrl"
              :href="company.tiktokUrl"
              target="_blank"
              class="hover:text-black"
              >TT</a
            >
          </div>
        </div>

        <!-- Sponsors -->
        <div v-if="company.sponsors?.length" class="flex flex-col space-y-2">
          <span class="font-semibold">Sponsors</span>
          <div class="flex space-x-3">
            <a
              v-for="sponsor in company.sponsors"
              :key="sponsor.id"
              :href="sponsor.websiteUrl"
              target="_blank"
            >
              <img
                :src="`${__BASE_URL__}${sponsor.logoUrl}`"
                :alt="sponsor.sponsorName"
                class="w-16 h-auto object-contain"
              />
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="mt-8 text-center text-sm text-gray-400">
        &copy; {{ new Date().getFullYear() }} {{ company.name }}. All rights reserved.
      </div>
    </div>
  </div>
</template>

<script setup>
const themeClass = useThemeClass()
const store = useCompanyProfileStore()
const { items } = storeToRefs(store)

const company = ref(items.value[0] || {})

// Watch items, update company if items changes
watch(items, (newItems) => {
  company.value = newItems[0] || {}
})
</script>
