<script setup>
import AppHeader from '../components/common/AppHeader.vue'
import AppFooter from '../components/common/AppFooter.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="layout-shell">
    <section class="content-area">
      <div class="topbar-sticky">
        <AppHeader />
      </div>

      <main class="layout__content">
        <RouterView />
      </main>
    </section>

    <AppFooter />
  </div>
</template>

<style scoped>
.layout-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--bg-page);
}

.content-area {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  width: 100%;
  max-width: 1440px;
  min-height: calc(100vh - 54px);
  margin: 0 auto;
  padding: 16px 32px 0;
}

.topbar-sticky {
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  display: flex;
  justify-content: center;
  background: var(--bg-page);
}

.layout__content {
  width: 100%;
  max-width: 1376px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
}

@media (max-width: 960px) {
  .content-area {
    padding: 16px;
  }
}
</style>
