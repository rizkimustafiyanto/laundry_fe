<template>
  <div class="py-1">
    <label v-if="label" :for="id" class="block mb-2 text-sm font-medium" :class="themeClass.label">
      {{ label }}
    </label>

    <div class="relative">
      <div
        v-if="icon && type !== 'textarea' && type !== 'file'"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
        :class="themeClass.icon"
      >
        <font-awesome-icon :icon="['fas', icon]" />
      </div>

      <template v-if="type === 'textarea'">
        <textarea
          :id="id"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          :rows="rows"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-2 transition resize-y min-h-[100px]"
          :class="themeClass.input"
          :required="required"
        />
      </template>

      <template v-else-if="type === 'file'">
        <input
          :id="id"
          type="file"
          :disabled="disabled"
          @change="handleFileChange"
          class="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-2 transition"
          :class="themeClass.input"
          :required="required"
        />
      </template>

      <template v-else-if="type === 'number'">
        <input
          :id="id"
          type="number"
          :placeholder="placeholder"
          :max="max"
          :min="min"
          :value="modelValue"
          :disabled="disabled"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-2 transition"
          :class="[themeClass.input, themeClass.textColor]"
          :required="required"
        />
      </template>

      <template v-else>
        <input
          :id="id"
          :type="computedType"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full p-2.5 border rounded-xl focus:outline-none focus:ring-2 transition"
          :class="[themeClass.input, { 'pl-10': icon, 'pr-10': isPassword }]"
          :required="required"
        />

        <button
          v-if="isPassword"
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3"
          :class="themeClass.iconButton"
          @click="togglePassword"
        >
          <font-awesome-icon :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']" />
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useThemeClass } from '@/composables/useThemeClass.js'

const { themeClass } = useThemeClass()

const props = defineProps({
  id: String,
  label: String,
  modelValue: {
    type: [String, Number],
    required() {
      return this.type !== 'file'
    },
  },
  min: [String, Number],
  max: [String, Number],
  rows: String,
  type: {
    type: String,
    default: 'text',
  },
  placeholder: String,
  icon: String,
  required: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'update:file'])

const showPassword = ref(false)

const isPassword = computed(() => props.type === 'password')
const computedType = computed(() => {
  if (isPassword.value) return showPassword.value ? 'text' : 'password'
  return props.type
})

function togglePassword() {
  showPassword.value = !showPassword.value
}

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    emit('update:file', file)
  }
}
</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button {
  filter: invert(0%);
}
.dark input[type='number']::-webkit-inner-spin-button {
  filter: invert(100%);
}
</style>
