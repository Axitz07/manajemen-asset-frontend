<script setup>
import { computed } from 'vue'
import AppBadge from '../../components/common/AppBadge.vue'
import { getAssetHistories } from '../../services/historyService'

const histories = computed(() => getAssetHistories())

const toneFromStatus = (status) => {
  if (status === 'Available') return 'success'
  if (status === 'Maintenance') return 'danger'
  return 'warning'
}
</script>

<template>
  <section id="history" class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › History</p>
    </div>

    <h1 class="page-title">Asset History</h1>

    <section class="card-shell panel">
      <article class="timeline-card">
        <h3>Latest Changes</h3>
        <div v-for="item in histories" :key="item.history_id" class="timeline-row">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-top">
              <strong>{{ item.asset_name }}</strong>
              <span>{{ item.changed_at }}</span>
            </div>
            <div class="timeline-status">
              <AppBadge :label="item.old_status" :tone="toneFromStatus(item.old_status)" />
              <span class="arrow">→</span>
              <AppBadge :label="item.new_status" :tone="toneFromStatus(item.new_status)" />
            </div>
            <p>{{ item.note }}</p>
          </div>
        </div>
      </article>

      <div class="table-shell">
        <table class="data-table">
          <thead>
            <tr>
              <th>ASSET CODE</th>
              <th>ASSET NAME</th>
              <th>OLD STATUS</th>
              <th>NEW STATUS</th>
              <th>CHANGED AT</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in histories" :key="item.history_id">
              <td>{{ item.asset_code }}</td>
              <td>{{ item.asset_name }}</td>
              <td>{{ item.old_status }}</td>
              <td>{{ item.new_status }}</td>
              <td>{{ item.changed_at }}</td>
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

.breadcrumb,
h3,
p,
strong {
  margin: 0;
}

.breadcrumb {
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

.timeline-card {
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fafafa;
}

.timeline-row {
  display: grid;
  grid-template-columns: 12px minmax(0, 1fr);
  gap: 12px;
  padding-top: 16px;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--brand);
  margin-top: 6px;
}

.timeline-top,
.timeline-status {
  display: flex;
  align-items: center;
  gap: 12px;
}

.timeline-top {
  justify-content: space-between;
}

.timeline-top span,
.timeline-content p {
  color: #64748b;
}

.timeline-status {
  margin: 10px 0;
}

.arrow {
  color: #94a3b8;
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

.data-table tbody tr:last-child td {
  border-bottom: 0;
}

@media (max-width: 920px) {
  .page {
    padding-inline: 0;
  }

  .timeline-top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
