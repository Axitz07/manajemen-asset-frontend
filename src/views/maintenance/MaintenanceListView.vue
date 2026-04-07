<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppBadge from '../../components/common/AppBadge.vue'
import { getMaintenances } from '../../services/maintenanceService'

const maintenances = computed(() => getMaintenances())
const openTickets = computed(() => maintenances.value.filter((item) => item.maintenance_status !== 'Done').length)
const doneTickets = computed(() => maintenances.value.filter((item) => item.maintenance_status === 'Done').length)

const statusTone = (status) => {
  if (status === 'Done') return 'success'
  if (status === 'Progress') return 'warning'
  return 'neutral'
}
</script>

<template>
  <section id="maintenance" class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Maintenance</p>
    </div>

    <h1 class="page-title">Maintenance Records</h1>

    <section class="card-shell panel">
      <div class="toolbar">
        <div>
          <h3>Maintenance Tracker</h3>
          <p>Pantau asset yang sedang diperbaiki dan selesaikan tiket dari halaman detail.</p>
        </div>
        <RouterLink to="/maintenance/create" class="btn-primary btn-link">Record Maintenance</RouterLink>
      </div>

      <div class="stats-grid">
        <article class="metric-box">
          <span>Total Records</span>
          <strong>{{ maintenances.length }}</strong>
        </article>
        <article class="metric-box">
          <span>Open Tickets</span>
          <strong>{{ openTickets }}</strong>
        </article>
        <article class="metric-box">
          <span>Done</span>
          <strong>{{ doneTickets }}</strong>
        </article>
      </div>

      <div class="table-shell">
        <table class="data-table">
          <thead>
            <tr>
              <th>ASSET</th>
              <th>ISSUE DESCRIPTION</th>
              <th>START DATE</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in maintenances" :key="item.maintenance_id">
              <td>{{ item.asset_name }}</td>
              <td>{{ item.issue_description }}</td>
              <td>{{ item.maintenance_date }}</td>
              <td><AppBadge :label="item.maintenance_status" :tone="statusTone(item.maintenance_status)" /></td>
              <td>
                <div class="action-group">
                  <RouterLink :to="`/maintenance/${item.maintenance_id}`" class="action-link">Detail</RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  font-weight: 700;
  color: #404040;
}

.card-shell {
  display: grid;
  gap: 20px;
  width: 100%;
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #d4d4d4;
}

.toolbar h3,
.toolbar p {
  margin: 0;
}

.toolbar p {
  color: #64748b;
}

.stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.metric-box {
  flex: 1 1 220px;
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fafafa;
}

.metric-box span {
  color: #64748b;
}

.metric-box strong {
  display: block;
  margin-top: 6px;
  font-size: 28px;
  color: #404040;
}

.table-shell {
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 16px 20px;
  text-align: left;
}

.data-table th {
  background: #fafafa;
  border-bottom: 1px solid #d4d4d4;
  font-size: 15px;
  font-weight: 700;
  color: #404040;
}

.data-table td {
  border-bottom: 1px solid #e5e7eb;
  color: #525252;
}

.action-group {
  display: inline-flex;
  gap: 10px;
}

.action-link {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--brand);
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
}

.action-link.delete {
  color: var(--danger);
}

.btn-primary {
  min-height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid #363636;
  background: linear-gradient(270deg, #171717 0%, #363636 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.data-table tbody tr:last-child td {
  border-bottom: 0;
}

@media (max-width: 920px) {
  .page {
    padding-inline: 0;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
