import 'uno.css'
import '@mdi/font/css/materialdesignicons.css'

import { createApp } from "vue";
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'

import { i18n } from '@/locales'
import { vuetify } from '@/vuetify'

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
  .use(vuetify)
  .mount("#app");
