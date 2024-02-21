<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
// const configStore = useConfigStore()

// const { config } = storeToRefs(configStore)
</script>

<template>
  <div flex h-full>
    <nav-bar></nav-bar>
    <main flex-1>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
  <ConfirmDialog />
  <Toast />
</template>
