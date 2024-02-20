import { createVuetify } from 'vuetify'
import { en, zhHans } from 'vuetify/locale'


export const vuetify = createVuetify({
  locale: {
    locale: 'en-US',
    messages: {
      'en-US': en,
      'zh-CN': zhHans,
    },
  },
})
