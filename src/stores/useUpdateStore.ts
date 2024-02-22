import type { Update } from '@tauri-apps/plugin-updater'
import { check } from '@tauri-apps/plugin-updater'
import { relaunch } from '@tauri-apps/plugin-process'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

export const useUpdateStore = defineStore('update', () => {
  const { t } = useI18n()
  const toast = useToast()
  const confirm = useConfirm()

  const configStore = useConfigStore()

  const { config } = storeToRefs(configStore)

  const updating = ref(false)

  async function start(showInfo = false) {
    updating.value = true
    let update: Update | null
    try {
      update = await check({
        timeout: 6,
      })
    }
    catch (e) {
      updating.value = false
      return toast.add({ severity: 'error', summary: t('toast.summary.error'), detail: t('updater.checkUpdate'), life: 3000 })
    }

    if (update) {
      confirm.require({
        message: t('updater.content', {
          version: update!.version,
        }),
        header: t('dialog.confirmation'),
        accept: async () => {
          try {
            await update!.downloadAndInstall()
            await relaunch()
          }
          catch {
            updating.value = false
            return toast.add({ severity: 'error', summary: t('toast.summary.error'), detail: t('updater.updating'), life: 3000 })
          }
        },
        reject: () => {
          updating.value = false
        }
      });
    }
    else {
      updating.value = false
      if (showInfo) {
        toast.add({ severity: 'info', summary: t('toast.summary.info'), detail: t('updater.latest'), life: 3000 })
      }
    }
  }

  watchOnce(() => config.value.checkUpdate, async (v) => {
    if (v) {
      start()
    }
  })

  return {
    start,
    updating,
  }
})
