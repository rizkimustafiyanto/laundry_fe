import { computed } from 'vue'
import { useThemeStore } from '@/stores/utils/theme.js'

export function useThemeClass() {
  const themeStore = useThemeStore()
  const theme = computed(() => themeStore.theme || 'light')

  const variants = {
    primary: {
      light: 'text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100',
      dark: 'text-blue-200 bg-blue-700 border-blue-500 hover:bg-blue-600',
    },
    secondary: {
      light: 'text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100',
      dark: 'text-gray-200 bg-gray-700 border-gray-500 hover:bg-gray-600',
    },
    success: {
      light: 'text-green-700 bg-green-50 border-green-200 hover:bg-green-100',
      dark: 'text-green-300 bg-green-800 border-green-600 hover:bg-green-700',
    },
    warning: {
      light: 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100',
      dark: 'text-amber-300 bg-amber-800 border-amber-600 hover:bg-amber-700',
    },
    danger: {
      light: 'text-red-700 bg-red-50 border-red-200 hover:bg-red-100',
      dark: 'text-red-300 bg-red-800 border-red-600 hover:bg-red-700',
    },
    info: {
      light: 'text-cyan-700 bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
      dark: 'text-cyan-300 bg-cyan-800 border-cyan-600 hover:bg-cyan-700',
    },
    pink: {
      light: 'text-pink-700 bg-pink-50 border-pink-200 hover:bg-pink-100',
      dark: 'text-pink-300 bg-pink-800 border-pink-600 hover:bg-pink-700',
    },
    stone: {
      light: 'text-stone-700 bg-stone-50 border-stone-200 hover:bg-stone-100',
      dark: 'text-stone-300 bg-stone-800 border-stone-600 hover:bg-stone-700',
    },
    lilac: {
      light: 'text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100',
      dark: 'text-purple-300 bg-purple-800 border-purple-600 hover:bg-purple-700',
    },
    teal: {
      light: 'text-teal-700 bg-teal-50 border-teal-200 hover:bg-teal-100',
      dark: 'text-teal-300 bg-teal-800 border-teal-600 hover:bg-teal-700',
    },
    orange: {
      light: 'text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100',
      dark: 'text-orange-300 bg-orange-800 border-orange-600 hover:bg-orange-700',
    },
    lime: {
      light: 'text-lime-700 bg-lime-50 border-lime-200 hover:bg-lime-100',
      dark: 'text-lime-300 bg-lime-800 border-lime-600 hover:bg-lime-700',
    },
    violet: {
      light: 'text-violet-700 bg-violet-50 border-violet-200 hover:bg-violet-100',
      dark: 'text-violet-300 bg-violet-800 border-violet-600 hover:bg-violet-700',
    },
    indigo: {
      light: 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      dark: 'text-indigo-300 bg-indigo-800 border-indigo-600 hover:bg-indigo-700',
    },
    brown: {
      light: 'text-amber-800 bg-amber-50 border-amber-200 hover:bg-amber-100',
      dark: 'text-amber-400 bg-amber-900 border-amber-600 hover:bg-amber-700',
    },
    sky: {
      light: 'text-sky-700 bg-sky-50 border-sky-200 hover:bg-sky-100',
      dark: 'text-sky-300 bg-sky-800 border-sky-600 hover:bg-sky-700',
    },
    dark: {
      light: 'text-gray-800 bg-gray-100 border-gray-300 hover:bg-gray-200',
      dark: 'text-gray-100 bg-gray-900 border-gray-700 hover:bg-gray-800',
    },
    glass: {
      light: 'text-white bg-white/20 border-white/30 hover:bg-white/30',
      dark: 'text-white bg-white/10 border-white/20 hover:bg-white/20',
    },
    mist: {
      light: 'text-gray-800 bg-gray-100/40 border-gray-200/40 hover:bg-gray-100/50',
      dark: 'text-gray-200 bg-gray-800/40 border-gray-700/40 hover:bg-gray-800/50',
    },
    haze: {
      light: 'text-blue-700 bg-blue-100/30 border-blue-200/30 hover:bg-blue-100/40',
      dark: 'text-blue-300 bg-blue-700/30 border-blue-500/30 hover:bg-blue-700/40',
    },
  }

  const themeClass = computed(() => {
    const mode = theme.value === 'dark' ? 'dark' : 'light'

    const baseDivVariants = {}
    for (const key in variants) {
      baseDivVariants[key] =
        mode === 'dark'
          ? `bg-${variants[key][mode].split(' ')[1].replace('bg-', '')} text-white`
          : `bg-${variants[key][mode].split(' ')[1].replace('bg-', '')} text-${variants[key][mode].split(' ')[0].replace('text-', '')}`
    }

    return {
      baseDiv: {
        default: mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900',
        ...baseDivVariants,
        muted: mode === 'dark' ? 'bg-gray-800/50 text-white' : 'bg-gray-200/50 text-gray-900',
      },

      thead: mode === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-700',
      trHover: mode === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
      borderColor: mode === 'dark' ? 'border-gray-600' : 'border-gray-300',

      border: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const borderColor = variants[key][mode].split(' ')[2]
          const focusColor = borderColor.replace('border-', 'focus:ring-')
          return [
            key,
            `border-${borderColor.replace('border-', '')} focus:ring-${focusColor.split(':')[1] || focusColor.split('-')[1]}`,
          ]
        }),
      ),

      borderless: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const borderColor = variants[key][mode].split(' ')[2]
          const focusColor = borderColor.replace('border-', 'focus:ring-')

          const borderColorValue = borderColor.replace('border-', '') + '/50'
          const focusColorValue = (focusColor.split(':')[1] || focusColor.split('-')[1]) + '/50'

          return [key, `border-${borderColorValue} focus:ring-${focusColorValue}`]
        }),
      ),

      dropdown:
        mode === 'dark'
          ? 'bg-gray-800 text-white ring-gray-700'
          : 'bg-white text-gray-700 ring-gray-300',

      label: Object.fromEntries(Object.keys(variants).map((key) => [key, variants[key][mode]])),

      text: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const textColor = variants[key][mode].split(' ')[0]
          return [key, textColor]
        }),
      ),

      textless: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const textColor = variants[key][mode].split(' ')[0]
          const textWithOpacity = textColor ? `${textColor}/50` : ''
          return [key, textWithOpacity]
        }),
      ),

      button: Object.fromEntries(Object.keys(variants).map((key) => [key, variants[key][mode]])),

      item: Object.fromEntries(Object.keys(variants).map((key) => [key, variants[key][mode]])),

      icon: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const textColor = variants[key][mode].split(' ')[0]
          return [key, textColor]
        }),
      ),

      hover: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const hoverClass = variants[key][mode].split(' ').find((c) => c.startsWith('hover'))
          return [key, hoverClass || '']
        }),
      ),

      hoverless: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const hoverClass = variants[key][mode].split(' ').find((c) => c.startsWith('hover'))
          const hoverWithOpacity = hoverClass ? `${hoverClass}/50` : ''
          return [key, hoverWithOpacity]
        }),
      ),

      hoverText: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const textColor = variants[key][mode].split(' ').find((c) => c.startsWith('text-'))
          const hoverTextClass = textColor ? textColor.replace('text-', 'hover:text-') : ''
          return [key, hoverTextClass]
        }),
      ),

      hoverTextLess: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const textColor = variants[key][mode].split(' ').find((c) => c.startsWith('text-'))
          const hoverTextClass = textColor ? textColor.replace('text-', 'hover:text-') : ''
          const hoverTextWithOpacity = hoverTextClass ? `${hoverTextClass}/50` : ''
          return [key, hoverTextWithOpacity]
        }),
      ),

      input: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const bgColor = variants[key][mode].split(' ')[1]
          const borderColor = variants[key][mode].split(' ')[2]
          const textColor = variants[key][mode].split(' ')[0]
          const focusColor = borderColor.replace('border-', 'focus:ring-')
          return [
            key,
            `bg-${bgColor.replace('bg-', '')} text-${textColor.replace('text-', '')} border-${borderColor.replace('border-', '')} focus:ring-${focusColor.split(':')[1] || focusColor.split('-')[1]}`,
          ]
        }),
      ),

      select: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const bgColor = variants[key][mode].split(' ')[1]
          const borderColor = variants[key][mode].split(' ')[2]
          const textColor = variants[key][mode].split(' ')[0]
          const focusColor = borderColor.replace('border-', 'focus:ring-')
          return [
            key,
            `bg-${bgColor.replace('bg-', '')} text-${textColor.replace('text-', '')} border-${borderColor.replace('border-', '')} focus:ring-${focusColor.split(':')[1] || focusColor.split('-')[1]}`,
          ]
        }),
      ),

      tooltip: {
        primary: mode === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800',
        dark: mode === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-700 text-gray-200',
      },

      scrollbar: Object.fromEntries(
        Object.keys(variants).map((key) => {
          const classes = variants[key][mode].split(' ')
          const textClass = classes.find((c) => c.startsWith('text-')) || 'text-gray-700'

          const thumbColor = textClass.replace('text-', '')

          return [key, `scrollbar-thin scrollbar-thumb-${thumbColor} scrollbar-track-transparent`]
        }),
      ),
    }
  })

  return themeClass
}
