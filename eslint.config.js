import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import fs from 'fs'

let autoImportGlobals = {}
try {
  autoImportGlobals = JSON.parse(fs.readFileSync('./.eslintrc-auto-import.json', 'utf-8'))
} catch (e) {
  console.log(e)
}

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,ts,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        onMounted: 'readonly',
        onBeforeMount: 'readonly',
        onBeforeUnmount: 'readonly',
        onUnmounted: 'readonly',
        provide: 'readonly',
        inject: 'readonly',
        nextTick: 'readonly',
        useRouter: 'readonly',
        useRoute: 'readonly',
        defineStore: 'readonly',
        storeToRefs: 'readonly',
        __BASE_URL__: 'readonly',
        ...autoImportGlobals.globals,
      },
    },
  },

  {
    files: [
      'vite.config.{js,mjs,ts}',
      'eslint.config.{js,mjs,ts}',
      'postcss.config.{js,cjs,mjs,ts}',
      'tailwind.config.{js,cjs,mjs,ts}',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...pluginOxlint.configs['flat/recommended'],
  skipFormatting,
])
