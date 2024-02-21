import { resolve } from 'node:path'

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Unocss from 'unocss/vite'
import { presetAttributify, presetUno, presetIcons } from 'unocss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'
import tsconfigPaths from 'vite-tsconfig-paths'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: [resolve('src/locales/**.yaml')],
    }),
    Unocss({
      presets: [presetUno(), presetAttributify(), presetIcons()],
      theme: {
        colors: {
          'primary-50': 'rgb(var(--primary-50))',
          'primary-100': 'rgb(var(--primary-100))',
          'primary-200': 'rgb(var(--primary-200))',
          'primary-300': 'rgb(var(--primary-300))',
          'primary-400': 'rgb(var(--primary-400))',
          'primary-500': 'rgb(var(--primary-500))',
          'primary-600': 'rgb(var(--primary-600))',
          'primary-700': 'rgb(var(--primary-700))',
          'primary-800': 'rgb(var(--primary-800))',
          'primary-900': 'rgb(var(--primary-900))',
          'primary-950': 'rgb(var(--primary-950))',
          'surface-0': 'rgb(var(--surface-0))',
          'surface-50': 'rgb(var(--surface-50))',
          'surface-100': 'rgb(var(--surface-100))',
          'surface-200': 'rgb(var(--surface-200))',
          'surface-300': 'rgb(var(--surface-300))',
          'surface-400': 'rgb(var(--surface-400))',
          'surface-500': 'rgb(var(--surface-500))',
          'surface-600': 'rgb(var(--surface-600))',
          'surface-700': 'rgb(var(--surface-700))',
          'surface-800': 'rgb(var(--surface-800))',
          'surface-900': 'rgb(var(--surface-900))',
          'surface-950': 'rgb(var(--surface-950))'
        }
      },
      content: {
        pipeline: {
          include: [
            "./index.html",
            "./src/**/*.{vue,js,ts,jsx,tsx}",
            "./node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}"
          ]
        }
      }
    }),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        'vue-i18n',
        'vue-router',
        'pinia',
      ],
      dirs: ['./src/stores/**'],
      vueTemplate: true,
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      dts: 'src/components.d.ts',
      resolvers: [
        PrimeVueResolver()
      ]
    }),
    Pages(),
    tsconfigPaths({
      loose: true,
    }),
  ],

  envPrefix: ['VITE_', 'TAURI_ENV_'],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
}));
