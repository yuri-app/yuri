<script setup lang="ts">
// const configStore = useConfigStore()

// const { config } = storeToRefs(configStore)
</script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>
