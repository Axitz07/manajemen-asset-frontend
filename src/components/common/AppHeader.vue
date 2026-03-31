<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { MENU_ITEMS } from '../../constants/menu'
import { appConfig } from '../../lib/env'
import initLogo from '../../assets/ui/logo/init.png'

const route = useRoute()
const activePath = computed(() => route.path)

const isMenuActive = (path) => activePath.value === path || activePath.value.startsWith(`${path}/`)
</script>

<template>
  <header class="navbar">
    <div class="header-logo">
      <img :src="initLogo" :alt="`${appConfig.appName} logo`" class="logo-image" />
    </div>

    <div class="header-content">
      <nav class="menu-list">
        <RouterLink
          v-for="item in MENU_ITEMS"
          :key="item.label"
          class="navbar-menu"
          :class="{ active: isMenuActive(item.path) }"
          :to="item.path"
        >
          <span class="menu-text">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="user-menu-wrapper">
        <div class="user-box">
          <span class="user-avatar">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M4 21C4 17.6863 6.68629 15 10 15H14C17.3137 15 20 17.6863 20 21"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
          <span class="chevron-down">
            <svg viewBox="0 0 20 20" fill="none">
              <path
                d="M6 8L10 12L14 8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 1376px;
  margin: 0 auto;
  padding: 16px 0 0;
  min-height: 96px;
}

.header-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  padding: 16px;
  background: #363636;
  border-radius: 16px;
}

.logo-mark {
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.logo-image {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-height: 80px;
  padding: 16px 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #eeeeee;
}

.menu-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.navbar-menu {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  font-weight: 600;
  color: #404040;
}

.navbar-menu.active {
  background: var(--brand-soft);
  color: var(--brand);
}

.menu-text {
  font-size: 16px;
}

.user-menu-wrapper {
  position: relative;
  padding: 10px 0;
  margin: -10px 0;
}

.user-box {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.user-avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: #d4d4d4;
  color: #ffffff;
}

.user-avatar svg {
  width: 24px;
  height: 24px;
}

.chevron-down {
  width: 20px;
  height: 20px;
  color: #404040;
}

@media (max-width: 920px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
    min-height: auto;
  }

  .header-logo {
    width: 100%;
    height: 72px;
    border-radius: 16px;
  }

  .header-content {
    flex-direction: column;
    padding: 22px;
    align-items: stretch;
  }

  .menu-list {
    justify-content: center;
  }

  .user-box {
    justify-content: center;
  }
}
</style>
