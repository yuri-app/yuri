// import { getVersion } from '@tauri-apps/plugin-app'
import { Store } from '@tauri-apps/plugin-store'
import { core } from '@tauri-apps/api'

interface Config {
  version: string
  locale: 'zh-CN' | 'en-US'
  target: string[]
}

const PATH = 'config.json'

export const useConfigStore = defineStore('config', () => {
  const { locale } = useI18n()

  const store = new Store(PATH)
  const config = ref({} as Config)
  async function init() {
    const data: Config = {
      // TODO: upgrade
      version: await core.invoke('plugin:app|version'),
      locale: 'en-US',
      target: []
    }
    const len = await store.length()
    if (len == 0)
      await create(data)

    await read()
    update(data)
  }

  async function create(data: Config) {
    for (const key in data)
      store.set(key, data[key as keyof Config])

    store.save()
  }

  async function read() {
    config.value = Object.fromEntries(await store.entries()) as unknown as Config
  }

  function update(data: Config) {
    const temp = {}
    for (const key in data) {
      if (key == 'version' || !Object.hasOwn(config.value, key))
        temp[key] = data[key]
    }
    Object.assign(config.value, temp)
  }

  init()

  watch(config, (v) => {
    for (const key in v)
      store.set(key, v[key as keyof Config])

    store.save()
  }, {
    deep: true,
  })

  watch(() => config.value.locale, (v) => {
    locale.value = v
  })

  return {
    config,
  }
})
