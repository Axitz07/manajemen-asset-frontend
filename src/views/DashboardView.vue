<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
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
      <div class="dashboard-toolbar">
        <label class="search-field">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8" />
            <path d="M20 20L16.5 16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <input type="text" placeholder="Search asset, employee, or code..." />
        </label>

        <div class="dashboard-actions">
          <RouterLink to="/maintenance/create" class="btn-secondary btn-link">Record Maintenance</RouterLink>
          <RouterLink to="/assets/create" class="btn-primary btn-link">Add New Asset</RouterLink>
        </div>
      </div>

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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  padding: 20px 20px 80px;
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
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.dashboard-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-height: 52px;
  padding-bottom: 16px;
  border-bottom: 1px solid #d4d4d4;
}

.search-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 320px;
  min-height: 36px;
  padding: 7px 12px;
  border: 1px solid #a3a3a3;
  border-radius: 8px;
  background: #ffffff;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #737373;
}

.search-field input {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #737373;
}

.dashboard-actions {
  display: inline-flex;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  min-height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  border: 1px solid #363636;
  background: linear-gradient(270deg, #171717 0%, #363636 100%);
  color: #ffffff;
}

.btn-secondary {
  border: 1px solid #d4d4d4;
  background: #ffffff;
  color: #404040;
}

@media (max-width: 920px) {
  .dashboard-page {
    min-height: auto;
    padding-inline: 0;
  }

  .dashboard-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-field,
  .dashboard-actions {
    width: 100%;
  }

  .dashboard-actions {
    display: grid;
  }

  .dashboard__stats,
  .dashboard__grid {
    grid-template-columns: 1fr;
  }
}
</style>
