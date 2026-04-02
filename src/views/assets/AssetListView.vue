<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppBadge from '../../components/common/AppBadge.vue'
import { deleteAsset } from '../../stores/assetStore'
import { getAssets } from '../../services/assetService'

const searchQuery = ref('')
const assets = computed(() => getAssets())

const filteredAssets = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()

  if (!keyword) return assets.value

  return assets.value.filter((item) =>
    [item.asset_code, item.asset_name, item.category_name, item.status, item.assigned_employee_name]
      .some((value) => String(value || '').toLowerCase().includes(keyword)),
  )
})

const availableCount = computed(() => assets.value.filter((item) => item.status === 'Available').length)
const inUseCount = computed(() => assets.value.filter((item) => item.status === 'In Use').length)
const maintenanceCount = computed(() => assets.value.filter((item) => item.status === 'Maintenance').length)
const attentionAssets = computed(() => assets.value.filter((item) => item.status !== 'Available'))

const statusTone = (status) => {
  if (status === 'Available') return 'success'
  if (status === 'Maintenance') return 'danger'
  return 'warning'
}

const conditionTone = (condition) => {
  if (condition === 'Baik') return 'success'
  if (condition === 'Rusak Ringan') return 'warning'
  return 'danger'
}

const removeAsset = async (assetId) => {
  if (!window.confirm('Hapus asset ini?')) return
  await deleteAsset(assetId)
}
</script>

<template>
  <section id="assets" class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Inventory</p>
    </div>

    <h1 class="page-title">Assets Management</h1>

    <section class="card-shell panel">
      <div class="toolbar">
        <label class="search-field">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8" />
            <path d="M20 20L16.5 16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search asset by name, code, or user..." />
        </label>

        <div class="toolbar-actions">
          <RouterLink to="/categories" class="btn-secondary btn-link">Manage Categories</RouterLink>
          <RouterLink to="/employees" class="btn-secondary btn-link">Manage Employees</RouterLink>
          <RouterLink to="/history" class="btn-secondary btn-link">View History</RouterLink>
          <button type="button" class="btn-secondary">Export Assets</button>
          <RouterLink to="/assets/create" class="btn-primary btn-link">Add New Asset</RouterLink>
        </div>
      </div>

      <div class="stats-grid">
        <article class="metric-box">
          <span>Total Asset</span>
          <strong>{{ assets.length }}</strong>
        </article>
        <article class="metric-box">
          <span>Available</span>
          <strong>{{ availableCount }}</strong>
        </article>
        <article class="metric-box">
          <span>In Use</span>
          <strong>{{ inUseCount }}</strong>
        </article>
        <article class="metric-box">
          <span>Maintenance</span>
          <strong>{{ maintenanceCount }}</strong>
        </article>
      </div>

      <div class="table-shell">
        <table class="data-table">
          <thead>
            <tr>
              <th>ASSET CODE</th>
              <th>ASSET NAME</th>
              <th>CATEGORY</th>
              <th>YEAR</th>
              <th>CONDITION</th>
              <th>STATUS</th>
              <th>USED BY</th>
              <th>QR CODE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredAssets" :key="item.asset_id">
              <td>{{ item.asset_code }}</td>
              <td>{{ item.asset_name }}</td>
              <td>{{ item.category_name }}</td>
              <td>{{ item.purchase_year }}</td>
              <td><AppBadge :label="item.condition" :tone="conditionTone(item.condition)" /></td>
              <td><AppBadge :label="item.status" :tone="statusTone(item.status)" /></td>
              <td>{{ item.assigned_employee_name }}</td>
              <td>{{ item.qr_code }}</td>
              <td>
                <div class="action-group">
                  <RouterLink :to="`/assets/${item.asset_id}/edit`" class="action-link edit">Edit</RouterLink>
                  <button type="button" class="action-link delete" @click="removeAsset(item.asset_id)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredAssets.length === 0">
              <td colspan="9" class="empty-state">No assets found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="split-grid">
        <article class="sub-card">
          <h3>Assets Needing Attention</h3>
          <div v-for="item in attentionAssets" :key="item.asset_id" class="list-row">
            <div>
              <strong>{{ item.asset_name }}</strong>
              <p>{{ item.asset_code }} • {{ item.category_name }}</p>
            </div>
            <AppBadge :label="item.status" :tone="statusTone(item.status)" />
          </div>
        </article>

        <article class="sub-card">
          <h3>Inventory Notes</h3>
          <ul class="notes-list">
            <li>Gunakan QR code untuk pencarian cepat saat serah terima asset.</li>
            <li>Asset dengan kondisi rusak ringan diarahkan ke maintenance lebih dulu.</li>
            <li>Data pengguna aktif membantu admin saat proses audit inventaris.</li>
          </ul>
        </article>
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

.toolbar,
.split-grid,
.stats-grid {
  display: grid;
  gap: 16px;
}

.toolbar {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #d4d4d4;
}

.search-field {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 7px 12px;
  border: 1px solid #a3a3a3;
  border-radius: 8px;
  background: #ffffff;
}

.search-field input {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
}

.search-icon {
  width: 20px;
  height: 20px;
  color: #737373;
}

.toolbar-actions {
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

.btn-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
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

.stats-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.metric-box,
.sub-card {
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fafafa;
}

.metric-box span,
.sub-card p {
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

.data-table th {
  padding: 16px 20px;
  background: #fafafa;
  border-bottom: 1px solid #d4d4d4;
  font-size: 15px;
  font-weight: 700;
  text-align: left;
  color: #404040;
}

.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  color: #525252;
}

.data-table tbody tr:last-child td {
  border-bottom: 0;
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

.split-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.sub-card h3,
.sub-card strong,
.notes-list {
  margin: 0;
}

.list-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid #e5e7eb;
}

.list-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.list-row:first-of-type {
  padding-top: 16px;
}

.notes-list {
  padding-left: 18px;
  color: #64748b;
}

.notes-list li + li {
  margin-top: 10px;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
}

@media (max-width: 920px) {
  .page {
    padding-inline: 0;
  }

  .toolbar,
  .stats-grid,
  .split-grid {
    grid-template-columns: 1fr;
  }

  .toolbar-actions {
    display: grid;
  }

  .table-shell {
    overflow-x: auto;
  }

  .data-table {
    min-width: 980px;
  }
}
</style>
