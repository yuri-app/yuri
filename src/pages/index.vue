<template>
  <div relative h-full>
    <div space-y-4 p-4>
      <Card v-for="item in list" :key="item.path">
        <template #title> {{ item.path }} </template>
        <template #content v-if="item.qrcode">
          <a :href="`http://${item.url}`" target="_blank">{{ item.url }}</a>
          <img :src="item.qrcode" width="128" height="128">
        </template>
        <template #footer>
          <div space-x-2>
            <Button v-if="item.qrcode" icon="i-mdi:power-off text-6" :label="$t('card.shutdown')" severity="secondary"
              @click="inactivate(item)" />
            <Button v-else icon="i-mdi:power text-6" :label="$t('card.start')" @click="activate(item)" />
            <Button icon="i-mdi:close-thick text-6" :label="$t('card.remove')" severity="danger" @click="remove(item)" />
          </div>
        </template>
      </Card>
    </div>
    <SpeedDial :model="items" direction="up" class="right-4 bottom-4" :transitionDelay="80" showIcon="pi pi-bars" hideIcon="pi pi-times" :tooltip-options="{ position: 'left', event: 'hover' }" />
  </div>
</template>

<script setup lang="ts">
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import QRCode from 'qrcode'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';


interface Directory {
  path: string
  url: string
  qrcode: string
}

const { t } = useI18n()
const confirm = useConfirm();
const toast = useToast();

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const list = ref<Array<Directory>>([])
const items = computed(() => [
  {
    label: t('menu.add'),
    icon: 'i-mdi:plus',
    command: openDialog
  }
])

async function openDialog() {
  const path = await open({
    directory: true,
  })
  if (!path) {
    return
  }
  if (exist(path)) {
    return toast.add({ severity: 'warn', summary: t('toast.summary.warn'), detail: t('tip.pathExist'), life: 3000 })
  }
  addDirectory(path)
}

function exist(path: string) {
  return list.value.find(i => i.path == path)
}

async function addDirectory(path: string) {
  const url = await invoke<string>('start_server', { path })
  const qrcode = await QRCode.toDataURL(url)
  list.value.push({
    path,
    url,
    qrcode
  })
}

async function activate(dir: Directory) {
  const url = await invoke<string>('start_server', { path: dir.path })
  const qrcode = await QRCode.toDataURL(url)
  dir.url = url
  dir.qrcode = qrcode
}

async function inactivate(dir: Directory) {
  await invoke('stop_server', { url: dir.url })
  dir.url = ''
  dir.qrcode = ''
}

function remove(dir: Directory) {
  confirm.require({
    message: t('dialog.remove'),
    header: t('dialog.confirmation'),
    accept: async () => {
      await inactivate(dir)
      const index = list.value.findIndex(i => i.path == dir.path)
      list.value.splice(index, 1)
      toast.add({ severity: 'success', summary: t('toast.summary.success'), life: 3000 })
    },
  });
}

watchOnce(() => config.value.target?.length, () => {
  list.value = config.value.target.map(path => ({
    path,
    url: '',
    qrcode: '',
  }))
})

watch(() => list.value.length, () => {
  config.value.target = list.value.map(i => i.path)
})

</script>
