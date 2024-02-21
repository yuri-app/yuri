<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
// const configStore = useConfigStore()

// const { config } = storeToRefs(configStore)
</script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
  <ConfirmDialog/>
  <Toast/>
</template>
