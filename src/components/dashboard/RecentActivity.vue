<script setup>
import { computed } from 'vue'
import { getRecentActivities } from '../../services/dashboardService'

const activities = computed(() => getRecentActivities())
</script>

<template>
  <section class="activity panel">
    <div class="activity__header">
      <h3>Riwayat Terbaru</h3>
      <p>Aktivitas terakhir dari modul aset dan maintenance.</p>
    </div>

    <div class="activity__table">
      <div v-for="item in activities" :key="item" class="activity__row">
        <span class="activity__bullet"></span>
        <span>{{ item }}</span>
      </div>
      <div v-if="activities.length === 0" class="activity__row">
        <span class="activity__bullet"></span>
        <span>Belum ada aktivitas terbaru.</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.activity {
  padding: 20px;
}

.activity__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

h3,
p {
  margin: 0;
}

p {
  color: var(--text-soft);
}

.activity__table {
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  overflow: hidden;
}

.activity__row {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid var(--border-soft);
  color: #525252;
}

.activity__row:last-child {
  border-bottom: 0;
}

.activity__bullet {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--brand);
}
</style>
