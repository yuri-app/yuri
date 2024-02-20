<template>
  <div>
    <div @click="openDialog">+</div>
    <div>
      <div v-for="{ path, url, qrcode } in list" :key="path" @click="detect(path, qrcode)">
        <div>
          <div v-if="qrcode" flex>
            <div text-5>
              {{ url }}
            </div>
            <img :src="qrcode" width="128" height="128">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import QRCode from 'qrcode'

const { t } = useI18n()

const configStore = useConfigStore()
const { config } = storeToRefs(configStore)

const list = ref<Array<{
  path: string,
  url: string,
  qrcode: string,
}>>([])

async function openDialog() {
  const path = await open({
    directory: true,
  })
  if (!path) {
    return
  }
  if (exist(path)) {
    return t('tip.pathExist')
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

async function activate(path: string) {
  const url = await invoke<string>('start_server', { path })
  const qrcode = await QRCode.toDataURL(url)
  const item = list.value.find(i => i.path == path)
  if (!item) {
    return
  }
  item.url = url
  item.qrcode = qrcode
}

function detect(path: string, qrcode: string) {
  if (qrcode.length == 0) {
    activate(path)
  }
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
