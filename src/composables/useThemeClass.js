import { computed } from 'vue'
import { useThemeStore } from '@/stores/component/theme.js'

export function useThemeClass() {
  const themeStore = useThemeStore()

  const theme = computed(() => themeStore.theme || 'light')

  const themeClass = computed(() => {
    return {
      baseDiv: theme.value === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900',
      label: theme.value === 'dark' ? 'text-gray-200' : 'text-gray-900',
      labelName : 'text-sm font-medium text-gray-900 dark:text-white',
      labelMail : 'truncate text-sm text-gray-500 dark:text-gray-400',
      thead: theme.value === 'dark' ? 'text-gray-200 bg-gray-700' : 'text-gray-700 bg-gray-300',
      trHover: theme.value === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
      color2: theme.value === 'dark' ? 'text-gray-200 border border-gray-500 hover:bg-gray-600' : 'text-gray-500 border border-gray-300 hover:bg-gray-100',
      icon: theme.value === 'dark' ? 'text-gray-400' : 'text-gray-500',
      input: theme.value === 'dark' ? 'border-gray-600 bg-gray-800 text-white focus:ring-gray-500' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500',
      iconButton: theme.value === 'dark' ? 'text-gray-400' : 'text-gray-500',
      button: theme.value === 'dark'
        ? 'text-gray-200 bg-gray-800 border-gray-600 hover:bg-gray-700 hover:text-white'
        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-800',
      dropdown: theme.value === 'dark'
        ? 'bg-gray-800 text-white ring-gray-700'
        : 'bg-white text-gray-700 ring-gray-300',
      item: theme.value === 'dark'
        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
      spinner: theme.value === 'dark' ? 'text-gray-300' : 'text-gray-700',
      variantPrimary: theme.value === 'dark' ? 'bg-gray-800' : 'bg-white',
      variantSecondary: theme.value === 'dark' ? 'bg-gray-700' : 'bg-blue-50',
      optionLabel: theme.value === 'dark' ? 'text-gray-200' : 'text-gray-700',
      radio: theme.value === 'dark' ? 'text-blue-500 focus:ring-blue-500' : 'text-blue-600 focus:ring-blue-500',
      select: theme.value === 'dark' ? 'bg-gray-800 text-white border-gray-600 focus:ring-blue-500' : 'bg-white text-gray-900 border-gray-300 focus:ring-blue-500',
    }
  })

  return { themeClass }
}
