<template>
  <div p-4 space-y-4>
    <div flex>
      <label flex-1>{{ $t('setting.locale') }}</label>
      <Dropdown v-model="config.locale" :options="localeOptions" optionLabel="label" optionValue="value" />
    </div>
    <div flex>
      <label flex-1>{{ $t('setting.checkUpdate') }}</label>
      <Checkbox v-model="config.checkUpdate" :binary="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useConfigStore()

const { config } = storeToRefs(store)

const localeOptions = [
  {
    label: '简体中文',
    value: 'zh-CN',
  },
  {
    label: 'English (United States)',
    value: 'en-US',
  },
]

</script>
