import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [
      vue(),
      vueDevTools(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
        ],
        dts: 'src/auto-imports.d.ts',
        vueTemplate: true,
        dirs: [
          'src/composables',
          'src/stores/**',
          'src/utils',
        ],
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json',
          globalsPropValue: 'readonly',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __BASE_URL__: JSON.stringify(env.VITE_API_URL),
      __APP_ENV__: JSON.stringify(env.APP_ENV)
    },
  }
})
