<template>
  <nav>
    <Menu :model="items" h-full>
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
        </a>
      </template>
    </Menu>
  </nav>
</template>

<script setup lang="ts">
const { t } = useI18n()

const items = computed(() => [
  {
    label: t('nav.home'),
    icon: 'i-mdi:home',
    route: '/'
  },
  {
    label: t('nav.setting'),
    icon: 'i-mdi:cog',
    route: '/setting'
  },
  {
    label: t('nav.about'),
    icon: 'i-mdi:information',
    route: '/about'
  },
])
</script>
