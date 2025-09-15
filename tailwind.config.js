export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        // =========================
        // Basic solid colors
        // =========================
        primary: { light: '#1d4ed8', dark: '#60a5fa' },       // text-blue-700 / text-blue-200
        secondary: { light: '#374151', dark: '#d1d5db' },     // text-gray-700 / text-gray-200
        success: { light: '#15803d', dark: '#34d399' },       // text-green-700 / text-green-300
        warning: { light: '#b45309', dark: '#f59e0b' },       // text-amber-700 / text-amber-300
        danger: { light: '#b91c1c', dark: '#f87171' },        // text-red-700 / text-red-300
        info: { light: '#0c4a6e', dark: '#22d3ee' },          // text-cyan-700 / text-cyan-300

        // =========================
        // Pastel / soft / glass / mist
        // =========================
        glass: { light: '#ffffff', dark: '#ffffff' },
        mist: { light: '#1f2937', dark: '#e5e7eb' },
        haze: { light: '#1d4ed8', dark: '#93c5fd' },
        smooth: { light: '#374151', dark: '#d1d5db' },
        softBlue: { light: '#1e40af', dark: '#60a5fa' },
        softGreen: { light: '#065f46', dark: '#34d399' },
        softPink: { light: '#be185d', dark: '#f472b6' },
        pastel: { light: '#7c3aed', dark: '#c4b5fd' },
        airy: { light: '#0284c7', dark: '#38bdf8' },

        // =========================
        // Meta / transparent
        // =========================
        meta: { light: '#6b7280', dark: '#9ca3af' },
        subtleMeta: { light: '#6b7280', dark: '#9ca3af' },

        // =========================
        // Dark / stone / lilac / teal / orange / etc
        // =========================
        stone: { light: '#4b5563', dark: '#d1d5db' },
        lilac: { light: '#7c3aed', dark: '#c4b5fd' },
        teal: { light: '#0f766e', dark: '#2dd4bf' },
        orange: { light: '#b45309', dark: '#f97316' },
        lime: { light: '#4d7c0f', dark: '#a3e635' },
        violet: { light: '#7c3aed', dark: '#c4b5fd' },
        indigo: { light: '#4338ca', dark: '#818cf8' },
        brown: { light: '#78350f', dark: '#fbbf24' },
        sky: { light: '#0284c7', dark: '#38bdf8' },
        dark: { light: '#1f2937', dark: '#f3f4f6' },

        // =========================
        // Soft / opacity friendly
        // =========================
        softTeal: { light: '#0f766e', dark: '#2dd4bf' },
        softOrange: { light: '#c2410c', dark: '#fb923c' },
        softViolet: { light: '#6d28d9', dark: '#a78bfa' },
      },
    },
  },
  safelist: [
    {
      pattern: /ring-(blue|gray|red|green|amber|cyan|purple|teal|orange|lime|violet|pink)(-\d{3})?(\/\d{2})?/,
    },
  ],
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
