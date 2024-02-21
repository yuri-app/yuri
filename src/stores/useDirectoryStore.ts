export interface Directory {
  path: string
  url: string
  qrcode: string
}

export const useDirectoryStore = defineStore('directory', () => {
  const configStore = useConfigStore()
  const { config } = storeToRefs(configStore)

  const list = ref<Array<Directory>>([])

  const unwatch = watchImmediate(() => config.value.target?.length, (v) => {
    if (!v) {
      return
    }
    if (list.value.length) {
      unwatch()
      return
    }
    list.value = config.value.target.map(path => ({
      path,
      url: '',
      qrcode: '',
    }))
  })
  watch(() => list.value.length, () => {
    config.value.target = list.value.map(i => i.path)
  })

  return {
    list
  }
})
