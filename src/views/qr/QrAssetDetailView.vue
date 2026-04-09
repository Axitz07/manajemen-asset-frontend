<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppBadge from '../../components/common/AppBadge.vue'
import QrCodeCard from '../../components/qr/QrCodeCard.vue'
import { getAssets } from '../../services/assetService'
import { getAssetHistories } from '../../services/historyService'
import { getMaintenances } from '../../services/maintenanceService'
import { getLoans } from '../../services/loanService'

const route = useRoute()
const asset = computed(() => getAssets().find((item) => item.asset_id === route.params.id) ?? null)
const histories = computed(() => getAssetHistories().filter((item) => item.asset_id === asset.value?.asset_id))
const maintenanceRecords = computed(() =>
  getMaintenances().filter((item) => item.asset_id === asset.value?.asset_id),
)
const activeLoan = computed(
  () => getLoans().find((item) => item.asset_id === asset.value?.asset_id && item.status === 'Borrowed') ?? null,
)

const statusTone = (status) => {
  if (status === 'Available') return 'success'
  if (status === 'Maintenance') return 'danger'
  if (status === 'Broken') return 'danger'
  return 'warning'
}

const maintenanceTone = (status) => {
  if (status === 'Done') return 'success'
  if (status === 'Progress') return 'warning'
  return 'neutral'
}
</script>

<template>
  <section class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › QR › Detail</p>
    </div>

    <div class="hero card-shell">
      <div>
        <h1 class="page-title">QR Asset Detail</h1>
      </div>

      <div class="hero-meta">
        <div class="meta-chip">
          <span>Maintenance</span>
          <strong>{{ maintenanceRecords.length }}</strong>
        </div>
        <div class="meta-chip">
          <span>History</span>
          <strong>{{ histories.length }}</strong>
        </div>
      </div>
    </div>

    <div v-if="!asset" class="not-found panel">
      <p>Asset untuk QR detail tidak ditemukan.</p>
      <RouterLink to="/qr" class="back-link">Kembali ke QR Center</RouterLink>
    </div>

    <section v-else class="grid">
      <article class="panel card-shell qr-panel">
        <div class="section-head">
          <div />
          <AppBadge :label="asset.status" :tone="statusTone(asset.status)" />
        </div>

        <QrCodeCard :asset-name="asset.asset_name" :qr-value="asset.qr_code" />
      </article>

      <article class="panel card-shell info-panel">
        <div class="asset-top">
          <div>
            <h3>{{ asset.asset_name }}</h3>
          </div>
          <AppBadge :label="asset.status" :tone="statusTone(asset.status)" />
        </div>

        <div class="detail-grid">
          <div class="detail-item"><span>Asset Code</span><strong>{{ asset.asset_code }}</strong></div>
          <div class="detail-item"><span>Category</span><strong>{{ asset.category_name }}</strong></div>
          <div class="detail-item"><span>Condition</span><strong>{{ asset.condition }}</strong></div>
          <div class="detail-item"><span>Employee</span><strong>{{ asset.assigned_employee_name }}</strong></div>
          <div class="detail-item"><span>QR Value</span><strong class="mono">{{ asset.qr_code }}</strong></div>
        </div>

        <div class="status-grid">
          <article class="status-card">
            <span>Current Loan</span>
            <strong>{{ activeLoan ? activeLoan.employee_name : 'No active loan' }}</strong>
            <p>{{ activeLoan ? `Loan date ${activeLoan.loan_date}` : 'Asset ini sedang tidak dipinjam.' }}</p>
          </article>
          <article class="status-card">
            <span>Total Maintenance</span>
            <strong>{{ maintenanceRecords.length }}</strong>
            <p>Riwayat perbaikan yang pernah dicatat untuk asset ini.</p>
          </article>
        </div>

        <RouterLink :to="`/qr?asset_id=${asset.asset_id}`" class="back-link inline-link">Open in QR Center</RouterLink>
      </article>

      <article class="panel card-shell">
        <h3>History</h3>
        <div v-if="histories.length" class="history-list">
          <div v-for="item in histories" :key="item.history_id" class="list-row">
            <span>{{ item.changed_at }}</span>
            <span>{{ item.note }}</span>
          </div>
        </div>
        <div v-else class="empty-state">Belum ada history.</div>
      </article>

      <article class="panel card-shell">
        <h3>Maintenance Records</h3>
        <div v-if="maintenanceRecords.length === 0" class="empty-state">
          Belum ada maintenance.
        </div>
        <div v-for="item in maintenanceRecords" :key="item.maintenance_id" class="list-row">
          <div>
            <span>{{ item.maintenance_date }}</span>
            <strong>{{ item.issue_description }}</strong>
          </div>
          <AppBadge :label="item.maintenance_status" :tone="maintenanceTone(item.maintenance_status)" />
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 18px; width: 100%; padding: 20px 20px 80px; box-sizing: border-box; }
.breadcrumb-row { display: flex; align-items: center; width: 100%; min-height: 27px; padding-bottom: 8px; border-bottom: 1px solid #d4d4d4; }
.breadcrumb, .page-title, .not-found p, .eyebrow, h3, strong, span { margin: 0; }
.breadcrumb { font-size: 14px; font-weight: 600; color: #737373; }
.page-title { font-size: 24px; font-weight: 700; color: #404040; }
.hero { display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap; padding: 16px; }
.hero-meta { display: flex; flex-wrap: wrap; gap: 12px; }
.meta-chip { min-width: 160px; padding: 12px 14px; border: 1px solid #dbe4ee; border-radius: 12px; background: #fafafa; }
.meta-chip span { display: block; color: #64748b; font-size: 13px; }
.meta-chip strong { display: block; margin-top: 6px; color: #111827; word-break: break-word; }
.grid { display: grid; grid-template-columns: minmax(0, 360px) minmax(0, 1fr); gap: 16px; align-items: start; }
.card-shell, .not-found { display: grid; gap: 14px; padding: 16px; }
.section-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
.qr-panel { align-content: start; }
.asset-top { display: flex; justify-content: space-between; gap: 12px; }
.detail-item span, .list-row { color: #64748b; }
.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.detail-item { padding: 12px; border: 1px solid #dbe4ee; border-radius: 12px; background: #fafafa; }
.detail-item strong { display: block; margin-top: 6px; color: #404040; word-break: break-word; }
.status-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.status-card { display: grid; gap: 6px; padding: 12px; border: 1px solid #dbe4ee; border-radius: 12px; background: #fafafa; }
.status-card span, .status-card p { color: #64748b; }
.status-card strong { color: #111827; }
.list-row { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid #e5e7eb; }
.list-row:last-child { border-bottom: 0; }
.back-link { display: inline-flex; align-items: center; justify-content: center; width: fit-content; min-height: 40px; padding: 0 16px; border: 1px solid #d4d4d4; border-radius: 8px; background: #ffffff; color: #404040; text-decoration: none; font-weight: 700; }
.inline-link { justify-self: start; }
.history-list { display: grid; }
.empty-state { padding: 12px 0 0; color: #64748b; }
.mono { font-variant-numeric: tabular-nums; word-break: break-all; }
@media (max-width: 920px) { .page { padding-inline: 0; } .grid, .detail-grid, .status-grid { grid-template-columns: 1fr; } .list-row { flex-direction: column; } .hero, .section-head, .asset-top { flex-direction: column; align-items: flex-start; } }
</style>
