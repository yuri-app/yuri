<script setup lang="ts">
const configStore = useConfigStore()

const { config } = storeToRefs(configStore)
</script>

<template>
  <v-locale-provider :locale="config.locale">
    <v-theme-provider with-background>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </v-theme-provider>
  </v-locale-provider>
</template>
