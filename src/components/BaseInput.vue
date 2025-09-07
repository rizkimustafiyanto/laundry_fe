<template>
  <div class="py-1">
    <label v-if="label" :for="id" class="block mb-2 font-medium" :class="themeClass.text.dark">
      {{ label }}
    </label>

    <div class="relative">
      <!-- Icon kiri -->
      <div
        v-if="icon && type !== 'textarea' && type !== 'file' && type !== 'date'"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
        :class="themeClass.icon.primary"
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
          :autocomplete="autocomplete"
          :rows="rows"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full p-2.5 border focus:outline-none focus:ring-2 transition resize-y min-h-[100px]"
          :class="[themeClass.input.mist, roundedClass]"
          :required="required"
        />
      </template>

      <!-- File Input -->
      <template v-else-if="type === 'file'">
        <input
          ref="inputRef"
          :id="id"
          type="file"
          :disabled="disabled"
          @change="handleFileChange"
          class="w-full p-2.5 border focus:outline-none focus:ring-2 transition"
          :class="[themeClass.input.mist, roundedClass]"
          :required="required"
        />
      </template>

      <!-- Number Input -->
      <template v-else-if="type === 'number'">
        <input
          ref="inputRef"
          :id="id"
          type="number"
          :placeholder="placeholder"
          :max="max"
          :min="min"
          :value="modelValue"
          :disabled="disabled"
          :autocomplete="autocomplete"
          @input="
            $emit(
              'update:modelValue',
              $event.target.value === '' ? '' : Number($event.target.value),
            )
          "
          class="w-full p-2.5 border focus:outline-none focus:ring-2 transition"
          :class="[themeClass.input.mist, themeClass.text.primary, roundedClass]"
          :required="required"
        />
      </template>

      <!-- Date Picker -->
      <template v-else-if="type === 'date'">
        <VueDatePicker
          v-model="innerDate"
          :id="id"
          :placeholder="placeholder"
          :disabled="disabled"
          :enable-time-picker="enableTimePicker"
          :range="range"
          :format="format"
          :required="required"
          :dark="themeClass.baseDiv === 'dark'"
          auto-apply
          :class="roundedClass"
        />
      </template>

      <!-- Default / Text / Password -->
      <template v-else>
        <input
          ref="inputRef"
          :id="id"
          :type="computedType"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          :autocomplete="autocomplete"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full p-2.5 border focus:outline-none focus:ring-2 transition"
          :class="[themeClass.input.mist, roundedClass, { 'pl-10': icon, 'pr-10': isPassword }]"
          :required="required"
        />

        <button
          v-if="isPassword"
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3"
          :class="themeClass.icon.primary"
          @click="togglePassword"
        >
          <font-awesome-icon :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']" />
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const themeClass = useThemeClass()

const props = defineProps({
  id: String,
  label: String,
  modelValue: {
    type: [String, Number, Date, Array],
    default: '',
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
  autocomplete: {
    type: String,
    default: 'off',
  },
  enableTimePicker: { type: Boolean, default: false },
  range: { type: Boolean, default: false },
  format: { type: String, default: 'yyyy-MM-dd' },
  rounded: {
    type: String,
    default: 'xl',
    validator: (val) => ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].includes(val),
  },
})

const emit = defineEmits(['update:modelValue', 'update:file'])

const showPassword = ref(false)
const isPassword = computed(() => props.type === 'password')
const computedType = computed(() =>
  isPassword.value ? (showPassword.value ? 'text' : 'password') : props.type,
)

function togglePassword() {
  showPassword.value = !showPassword.value
}

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) emit('update:file', file)
}

const innerDate = ref(props.modelValue)
watch(innerDate, (val) => emit('update:modelValue', val))
watch(
  () => props.modelValue,
  (val) => (innerDate.value = val),
)

const inputRef = ref(null)

defineExpose({
  focus: () => inputRef.value?.focus?.(),
  $el: inputRef,
})

const roundedClass = computed(() => `rounded-${props.rounded}`)
</script>

<style scoped>
::v-deep(.dp__input) {
  @apply w-full p-2.5 pl-10 border rounded-xl focus:outline-none focus:ring-2 transition border-gray-300 bg-white text-gray-900 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-gray-500;
}
</style>
