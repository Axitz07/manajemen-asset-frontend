<script setup>
import { computed } from 'vue'
import SummaryCard from '../components/dashboard/SummaryCard.vue'
import StatusChart from '../components/dashboard/StatusChart.vue'
import RecentActivity from '../components/dashboard/RecentActivity.vue'
import { getDashboardSummary } from '../services/dashboardService'

const quickStats = computed(() => getDashboardSummary())
</script>

<template>
  <section id="dashboard" class="dashboard-page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Dashboard</p>
    </div>

    <h1 class="page-title">Asset Management Dashboard</h1>

    <section class="dashboard-card panel">
      <section class="dashboard__stats">
        <SummaryCard
          v-for="item in quickStats"
          :key="item.title"
          :title="item.title"
          :value="item.value"
          :note="item.note"
          :tone="item.tone"
        />
      </section>

      <section class="dashboard__grid">
        <StatusChart />
        <RecentActivity />
      </section>
    </section>
  </section>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 20px 20px 64px;
  box-sizing: border-box;
}

.breadcrumb-row {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 27px;
  padding-bottom: 8px;
  border-bottom: 1px solid #d4d4d4;
}

.breadcrumb {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #737373;
}

.page-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.3;
  font-weight: 700;
  color: #404040;
}

.dashboard-card {
  display: grid;
  gap: 20px;
  width: 100%;
  padding: 20px;
}

.dashboard__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.dashboard__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.dashboard__stats :deep(> *) {
  flex: 1 1 220px;
}

.dashboard__grid > * {
  flex: 1 1 320px;
  min-width: 0;
}

@media (max-width: 920px) {
  .dashboard-page {
    padding-inline: 0;
  }

  .dashboard__stats :deep(> *),
  .dashboard__grid > * {
    flex-basis: 100%;
  }
}
</style>
