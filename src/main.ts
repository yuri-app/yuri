import 'uno.css'
import '@unocss/reset/tailwind-compat.css'
import 'primeicons/primeicons.css'
import './base.css'

import { createApp } from "vue";
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import { i18n } from '@/locales'
import Lara from '@/presets/lara';

import routes from '~pages'

import App from "./App.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const pinia = createPinia()

createApp(App)
  .use(i18n)
  .use(router)
  .use(pinia)
  .use(PrimeVue, {
    unstyled: true,
    pt: Lara
  })
  .use(ConfirmationService)
  .use(ToastService)
  .mount("#app");
