<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { MENU_ITEMS } from '../../constants/menu'

const route = useRoute()

const isMenuActive = (path) => route.path === path || route.path.startsWith(`${path}/`)
</script>

<template>
  <aside class="sidebar panel">
    <p class="sidebar__title">Menu MVP</p>

    <nav class="sidebar__nav">
      <RouterLink
        v-for="item in MENU_ITEMS"
        :key="item.label"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isMenuActive(item.path) }"
        :to="item.path"
      >
        <span>{{ item.label }}</span>
        <small>{{ item.caption }}</small>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  padding: 20px;
}

.sidebar__title {
  margin: 0 0 18px;
  font-weight: 700;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar__link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--border-soft);
}

.sidebar__link--active {
  background: var(--brand-soft);
  border-color: #93c5fd;
}

.sidebar__link small {
  color: var(--text-soft);
}
</style>
