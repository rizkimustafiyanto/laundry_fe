<template>
  <div class="mb-4">
    <label v-if="label" :for="id" class="block mb-2 text-sm font-medium text-gray-900">
      {{ label }}
    </label>

    <div class="relative">
      <!-- Prefix Icon -->
      <div
        v-if="icon && type !== 'textarea' && type !== 'file'"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400"
      >
        <font-awesome-icon :icon="['fas', icon]" />
      </div>

      <!-- Textarea -->
      <template v-if="type === 'textarea'">
        <textarea
          :id="id"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y min-h-[100px]"
          :required="required"
        />
      </template>

      <!-- Input for File -->
      <template v-else-if="type === 'file'">
        <input
          :id="id"
          type="file"
          :disabled="disabled"
          @change="handleFileChange"
          class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          :required="required"
        />
      </template>

      <!-- Input for other types -->
      <template v-else>
        <input
          :id="id"
          :type="computedType"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          :class="{
            'pl-10': icon,
            'pr-10': isPassword,
          }"
          :required="required"
        />

        <!-- Password Toggle -->
        <button
          v-if="isPassword"
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
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

const props = defineProps({
  id: String,
  label: String,
  modelValue: String,
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
