<template>
  <div class="relative inline-block text-left">
    <button
      @click="toggleDropdown"
      type="button"
      :class="[
        'inline-flex items-center font-medium rounded-xl text-sm px-3 py-1.5 border focus:outline-none focus:ring-2 transition',
        themeClass.button,
      ]"
    >
      {{ labelHead }}
      <font-awesome-icon :icon="isOpen ? 'angle-down' : 'angle-up'" class="ml-2" />
    </button>

    <div
      v-show="isOpen"
      class="absolute right-0 mt-2 z-10 w-full rounded-xl shadow ring-1 ring-black ring-opacity-5 focus:outline-none"
      :class="themeClass.dropdown"
    >
      <ul class="py-1 text-sm">
        <li v-for="(item, index) in items" :key="index">
          <a
            href="#"
            @click.prevent="selectItem(item)"
            :class="themeClass.item"
            class="block px-4 py-2"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'

const { themeClass } = useThemeClass()

const props = defineProps({
  label: String,
  items: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['select'])

const isOpen = ref(false)
const labelHead = ref(props.label)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectItem = (item) => {
  isOpen.value = false
  labelHead.value = item.label
  emit('select', item.value)
}
</script>

<style scoped>
/* Optional: You can add transitions or animations here if needed */
</style>
