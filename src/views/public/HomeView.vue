<template>
  <div :class="themeClass.baseDiv.glass">
    <HomePage />
  </div>
</template>

<script setup>
import HomePage from '@/components/public/HomePage.vue'

const themeClass = useThemeClass()
</script>
