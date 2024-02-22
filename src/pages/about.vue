<script setup lang="ts">
import { open } from '@tauri-apps/plugin-shell'


import logo from '@/assets/logo.svg'

const configStore = useConfigStore()
const updateStore = useUpdateStore()
const { config } = storeToRefs(configStore)
const { updating } = storeToRefs(updateStore)
const { start } = updateStore

const repository = 'https://github.com/yuri-app/yuri'
const version = computed(() => `v${config.value.version}`)

async function update() {
  start(true)
}

</script>

<template>
  <div flex flex-col items-center space-y-4>
    <img :src="logo" width="128" height="128" mt-10>
    <div flex items-baseline>
      <div text-6 font-bold>
        yuri
      </div>
      <div>
        ({{ version }})
      </div>
    </div>
    <div>{{ $t('about.profile') }}</div>
    <Button :label="$t('about.checkUpdate')" :loading="updating" @click="update" />
    <Chip label="Github" icon="pi pi-github" @click="open(repository)" cursor-pointer />
  </div>
</template>
