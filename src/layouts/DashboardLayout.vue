<script setup>
import AppHeader from '../components/common/AppHeader.vue'
import AppFooter from '../components/common/AppFooter.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="layout-shell">
    <div class="topbar-sticky">
      <div class="topbar-shell">
        <AppHeader />
      </div>
    </div>

    <section class="content-area">
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
  gap: 12px;
  width: 100%;
  max-width: var(--shell-max);
  min-height: calc(100vh - 58px);
  margin: 0 auto;
  padding: 12px var(--shell-padding) 0;
}

.topbar-sticky {
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  background: var(--bg-page);
  padding-inline: var(--shell-padding);
}

.topbar-shell {
  width: min(100%, var(--shell-max));
  margin: 0 auto;
}

.layout__content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  min-width: 0;
}

@media (max-width: 960px) {
  .topbar-sticky {
    padding-inline: var(--shell-padding-mobile);
  }

  .content-area {
    padding: 12px var(--shell-padding-mobile) 0;
  }
}
</style>
