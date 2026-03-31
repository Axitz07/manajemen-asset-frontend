<script setup>
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

const links = [
  { label: 'Assets', path: '/assets' },
  { label: 'Categories', path: '/categories' },
  { label: 'Employees', path: '/employees' },
  { label: 'History', path: '/history' },
]

const isActive = (path) => route.path === path || route.path.startsWith(`${path}/`)
</script>

<template>
  <nav class="support-nav">
    <RouterLink
      v-for="item in links"
      :key="item.path"
      :to="item.path"
      class="support-link"
      :class="{ active: isActive(item.path) }"
    >
      {{ item.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.support-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fafafa;
}

.support-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 8px;
  border: 1px solid #d4d4d4;
  background: #ffffff;
  color: #404040;
  font-weight: 700;
  text-decoration: none;
}

.support-link.active {
  border-color: #93c5fd;
  background: #eff6ff;
  color: var(--brand);
}

@media (max-width: 920px) {
  .support-nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
