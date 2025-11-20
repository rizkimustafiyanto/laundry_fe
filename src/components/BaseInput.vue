<template>
  <div class="relative border-none bg-inherit">
    <label
      v-if="label"
      :for="id"
      class="block mb-2 font-medium"
      :class="[themeClass.text.secondary, sizeClass.font]"
    >
      {{ label }}
    </label>

    <div class="relative">
      <div
        v-if="icon && type !== 'textarea' && type !== 'file' && type !== 'date'"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
      >
        <i :class="['fa-solid', `fa-${icon}`, themeClass.icon.primary, sizeClass.icon]"></i>
      </div>

      <template v-if="type === 'textarea'">
        <textarea
          :id="id"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          :autocomplete="autocomplete"
          :rows="rows"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition resize-y scrollbar-none block leading-normal align-top"
          :class="[themeClass.input.mist, roundedClass, sizeClass.font, sizeClass.wrapper]"
          :required="required"
        />
      </template>

      <template v-else-if="type === 'file'">
        <div class="relative w-full">
          <input
            ref="inputRef"
            :id="id"
            type="file"
            class="hidden"
            :disabled="disabled"
            @change="handleFileChange"
            :required="required"
          />

          <label
            :for="id"
            class="flex items-center justify-center gap-2 cursor-pointer border-dashed border-2 transition hover:opacity-90 focus-within:ring-2 focus-within:ring-opacity-50 w-full text-center"
            :class="[
              themeClass.input.mist,
              themeClass.text.secondary,
              themeClass.border.primary,
              roundedClass,
              sizeClass.wrapper,
            ]"
          >
            <i :class="['fa-solid fa-upload', themeClass.icon.primary, sizeClass.icon]"></i>
            <span :class="sizeClass.font">Upload File</span>
          </label>
        </div>
      </template>

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
          class="w-full border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
          :class="[
            themeClass.input.mist,
            themeClass.text.primary,
            roundedClass,
            sizeClass.font,
            sizeClass.wrapper,
          ]"
          :required="required"
        />
      </template>

      <template v-else-if="type === 'date'">
        <input
          ref="inputRef"
          :id="id"
          type="date"
          :placeholder="placeholder"
          :value="modelValue"
          :disabled="disabled"
          :autocomplete="autocomplete"
          @input="$emit('update:modelValue', $event.target.value)"
          class="w-full border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
          :class="[
            themeClass.input.mist,
            roundedClass,
            sizeClass.font,
            sizeClass.wrapper,
            { 'pl-10': icon, 'pr-10': isPassword },
          ]"
          :required="required"
        />
      </template>

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
          class="w-full border focus:outline-none focus:ring-2 focus:ring-opacity-50 transition"
          :class="[
            themeClass.input.mist,
            roundedClass,
            sizeClass.font,
            sizeClass.wrapper,
            { 'pl-10': icon, 'pr-10': isPassword },
          ]"
          :required="required"
        />

        <button
          v-if="isPassword"
          type="button"
          class="absolute inset-y-0 right-0 flex items-center pr-3"
          @click="togglePassword"
        >
          <i
            :class="[
              'fa-solid',
              showPassword ? 'fa-eye-slash' : 'fa-eye',
              themeClass.icon.primary,
              sizeClass.icon,
            ]"
          ></i>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
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
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  rounded: {
    type: String,
    default: 'lg',
    validator: (val) => ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].includes(val),
  },
  sizeVariant: {
    type: String,
    default: 'sm',
    validator: (val) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(val),
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

const inputRef = ref(null)

defineExpose({
  focus: () => inputRef.value?.focus?.(),
  $el: inputRef,
})

const roundedClass = computed(() => `rounded-${props.rounded}`)

const sizeClass = computed(() => {
  switch (props.sizeVariant) {
    case 'xs':
      return { font: 'text-xs', wrapper: 'px-3 py-2 text-xs', icon: 'text-xs' }
    case 'sm':
      return { font: 'text-sm', wrapper: 'px-3 py-2 text-sm', icon: 'text-sm' }
    case 'md':
      return { font: 'text-base', wrapper: 'px-3 py-2 text-base', icon: 'text-base' }
    case 'lg':
      return { font: 'text-lg', wrapper: 'px-3 py-2 text-lg', icon: 'text-lg' }
    case 'xl':
      return { font: 'text-xl', wrapper: 'px-3 py-2 text-xl', icon: 'text-xl' }
    default:
      return { font: 'text-base', wrapper: 'px-3 py-2 text-base', icon: 'text-base' }
  }
})
</script>
