<script setup>
import { computed } from 'vue'
import { getDashboardStatusStats } from '../../services/dashboardService'

const items = computed(() => getDashboardStatusStats())

const labelClass = (label) => {
  if (label === 'Available') return 'chart__label--available'
  if (label === 'Maintenance') return 'chart__label--maintenance'
  return 'chart__label--used'
}
</script>

<template>
  <section class="chart panel">
    <div class="chart__header">
      <h3>Status Asset</h3>
      <p>Distribusi kondisi aset aktif saat ini.</p>
    </div>

    <div class="chart__items">
      <div v-for="item in items" :key="item.label" class="chart__item">
        <span class="chart__label" :class="labelClass(item.label)">{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chart {
  padding: 20px;
}

.chart__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

h3,
p,
strong {
  margin: 0;
}

p {
  color: var(--text-soft);
}

.chart__items {
  display: grid;
  gap: 12px;
}

.chart__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  background: var(--surface-muted);
}

.chart__label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 110px;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
}

.chart__label--available {
  color: #18a957;
  background: #f0fff5;
  border: 1px solid #6ccb92;
}

.chart__label--used {
  color: var(--brand);
  background: #eff6ff;
  border: 1px solid #93c5fd;
}

.chart__label--maintenance {
  color: #e39a21;
  background: #fff9ef;
  border: 1px solid #f0b859;
}
</style>
