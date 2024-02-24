<template>
  <div relative h-full overflow-y-auto>
    <div space-y-4 p-4 v-if="list.length">
      <Card v-for="item in list" :key="item.path">
        <template #title> {{ item.path }} </template>
        <template #content v-if="item.qrcode">
          <a :href="item.url" target="_blank">{{ item.url }}</a>
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
    <empty v-else />
    <SpeedDial :model="items" direction="up" class="right-4 bottom-4 fixed" showIcon="pi pi-bars"
      hideIcon="pi pi-times" :tooltip-options="{ position: 'left', event: 'hover' }" />
    <Dialog v-model:visible="helpDialogVisible" modal :header="$t('menu.help')" >
      <div space-y-2 mb-4>
        <div>{{ $t('manual.step1') }}</div>
        <div>{{ $t('manual.step2') }}</div>
        <div>{{ $t('manual.step3') }}</div>
      </div>
      <div text-red>{{ $t('manual.tip') }}</div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import QRCode from 'qrcode'
import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';
import { exists } from '@tauri-apps/plugin-fs'


import { Directory } from '@/stores/useDirectoryStore';

const { t } = useI18n()
const confirm = useConfirm();
const toast = useToast();

const directoryStore = useDirectoryStore()
const { list } = storeToRefs(directoryStore)

const helpDialogVisible = ref(false)
const items = computed(() => [
  {
    label: t('menu.add'),
    icon: 'i-mdi:plus',
    command: openAddDirectoryDialog
  },
  {
    label: t('menu.help'),
    icon: 'i-mdi:help',
    command: () => helpDialogVisible.value = true
  },
])

async function openAddDirectoryDialog() {
  const path = await open({
    directory: true,
  })
  if (!path) {
    return
  }
  const exist = list.value.find(i => i.path == path)
  if (exist) {
    return toast.add({ severity: 'warn', summary: t('toast.summary.warn'), detail: t('tip.pathExist'), life: 3000 })
  }
  addDirectory(path)
}

async function addDirectory(path: string) {
  const url = await invoke<string>('start_static_server', { path })
  const qrcode = await QRCode.toDataURL(url)
  list.value.push({
    path,
    url,
    qrcode
  })
}

async function activate(dir: Directory) {
  const exist = await exists(dir.path)
  if (!exist) {
    return toast.add({ severity: 'error', summary: t('toast.summary.error'), detail: t('tip.pathNotExist'), life: 3000 })
  }
  const url = await invoke<string>('start_static_server', { path: dir.path })
  const qrcode = await QRCode.toDataURL(url)
  dir.url = url
  dir.qrcode = qrcode
}

async function inactivate(dir: Directory) {
  const scope = dir.url.split('/').at(-1)
  await invoke('shutdown_static_server', { scope })
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

</script>
