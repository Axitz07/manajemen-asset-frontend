<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { MENU_ITEMS } from '../../constants/menu'
import { appConfig } from '../../lib/env'
import initLogo from '../../assets/ui/logo/init.png'
import { currentUser, logout } from '../../stores/authStore'

const route = useRoute()
const router = useRouter()
const activePath = computed(() => route.path)
const userInitial = computed(() => currentUser.value?.name?.trim()?.charAt(0)?.toUpperCase() ?? 'U')
const visibleMenuItems = computed(() => MENU_ITEMS)

const isMenuActive = (path) => activePath.value === path || activePath.value.startsWith(`${path}/`)

const signOut = () => {
  logout()
  router.push('/login')
}
</script>

<template>
  <header class="navbar">
    <div class="header-logo">
      <img :src="initLogo" :alt="`${appConfig.appName} logo`" class="logo-image" />
    </div>

    <div class="header-content">
      <nav class="menu-list">
        <RouterLink
          v-for="item in visibleMenuItems"
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
            {{ userInitial }}
          </span>
          <div class="user-copy">
            <strong>{{ currentUser?.name || 'Employee' }}</strong>
            <span>{{ currentUser?.role || 'admin' }}</span>
          </div>
          <button type="button" class="logout-button" @click="signOut">Logout</button>
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
  min-width: 0;
  padding: 12px 0 0;
  min-height: 92px;
}

.header-logo {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(68px, 6vw, 80px);
  height: clamp(68px, 6vw, 80px);
  padding: 14px;
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
  width: clamp(36px, 3vw, 48px);
  height: clamp(36px, 3vw, 48px);
  object-fit: contain;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex: 1;
  min-width: 0;
  min-height: 80px;
  padding: 14px clamp(16px, 2vw, 24px);
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #eeeeee;
}

.menu-list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  min-width: 0;
}

.navbar-menu {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 38px;
  padding: 0 14px;
  border-radius: 6px;
  font-weight: 600;
  color: #404040;
  white-space: nowrap;
}

.navbar-menu.active {
  background: var(--brand-soft);
  color: var(--brand);
}

.menu-text {
  font-size: clamp(14px, 1.2vw, 16px);
}

.user-menu-wrapper {
  position: relative;
  padding: 10px 0;
  margin: -10px 0;
  flex: 0 0 auto;
}

.user-box {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: #d4d4d4;
  color: #ffffff;
  font-weight: 800;
}

.user-copy {
  display: grid;
  gap: 2px;
}

.user-copy strong,
.user-copy span {
  margin: 0;
  line-height: 1.2;
}

.user-copy span {
  color: #404040;
  font-size: 13px;
}

.logout-button {
  min-height: 34px;
  padding: 0 12px;
  border: 1px solid #d4d4d4;
  border-radius: 999px;
  background: #ffffff;
  color: #404040;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 920px) {
  .navbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    min-height: auto;
    padding-top: 6px;
  }

  .header-logo {
    width: 100%;
    height: 72px;
    border-radius: 16px;
  }

  .header-content {
    flex-direction: column;
    padding: 18px 16px;
    align-items: stretch;
  }

  .menu-list {
    justify-content: flex-start;
    gap: 10px;
  }

  .user-box {
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .navbar-menu {
    width: 100%;
    justify-content: flex-start;
  }

  .menu-list {
    display: flex;
    flex-direction: column;
  }

  .user-menu-wrapper {
    display: flex;
    justify-content: center;
  }
}
</style>
