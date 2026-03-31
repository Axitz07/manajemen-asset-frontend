<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import AppBadge from '../../components/common/AppBadge.vue'
import QrCodeCard from '../../components/qr/QrCodeCard.vue'
import { getAssets } from '../../services/assetService'
import { getAssetHistories } from '../../services/historyService'
import { getMaintenances } from '../../services/maintenanceService'

const route = useRoute()
const asset = computed(() => getAssets().find((item) => item.asset_id === Number(route.params.id)) ?? null)
const histories = computed(() => getAssetHistories().filter((item) => item.asset_id === asset.value?.asset_id))
const maintenanceRecords = computed(() =>
  getMaintenances().filter((item) => item.asset_id === asset.value?.asset_id),
)

const statusTone = (status) => {
  if (status === 'Available') return 'success'
  if (status === 'Maintenance') return 'danger'
  return 'warning'
}
</script>

<template>
  <section class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › QR › Detail</p>
    </div>

    <h1 class="page-title">QR Asset Detail</h1>

    <div v-if="!asset" class="not-found panel">
      <p>Asset untuk QR detail tidak ditemukan.</p>
      <RouterLink to="/qr" class="back-link">Kembali ke QR Center</RouterLink>
    </div>

    <section v-else class="grid">
      <article class="panel card-shell">
        <QrCodeCard :asset-name="asset.asset_name" :qr-value="asset.qr_code" />
      </article>

      <article class="panel card-shell">
        <div class="asset-top">
          <div>
            <p class="eyebrow">Asset Information</p>
            <h3>{{ asset.asset_name }}</h3>
          </div>
          <AppBadge :label="asset.status" :tone="statusTone(asset.status)" />
        </div>

        <div class="detail-grid">
          <div class="detail-item"><span>Asset Code</span><strong>{{ asset.asset_code }}</strong></div>
          <div class="detail-item"><span>Category</span><strong>{{ asset.category_name }}</strong></div>
          <div class="detail-item"><span>Condition</span><strong>{{ asset.condition }}</strong></div>
          <div class="detail-item"><span>Used By</span><strong>{{ asset.assigned_employee_name }}</strong></div>
        </div>
      </article>

      <article class="panel card-shell">
        <h3>History</h3>
        <div v-for="item in histories" :key="item.history_id" class="list-row">
          <span>{{ item.changed_at }}</span>
          <span>{{ item.note }}</span>
        </div>
      </article>

      <article class="panel card-shell">
        <h3>Maintenance Records</h3>
        <div v-if="maintenanceRecords.length === 0" class="list-row">
          <span>Belum ada maintenance untuk asset ini.</span>
        </div>
        <div v-for="item in maintenanceRecords" :key="item.maintenance_id" class="list-row">
          <span>{{ item.maintenance_date }}</span>
          <span>{{ item.issue_description }} ({{ item.maintenance_status }})</span>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 16px; width: 100%; padding: 20px 20px 80px; box-sizing: border-box; }
.breadcrumb-row { display: flex; align-items: center; width: 100%; min-height: 27px; padding-bottom: 8px; border-bottom: 1px solid #d4d4d4; }
.breadcrumb, .page-title, .not-found p, .eyebrow, h3, strong, span { margin: 0; }
.breadcrumb { font-size: 14px; font-weight: 600; color: #737373; }
.page-title { font-size: 24px; font-weight: 700; color: #404040; }
.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
.card-shell, .not-found { display: grid; gap: 20px; padding: 20px; }
.asset-top { display: flex; justify-content: space-between; gap: 16px; }
.eyebrow, .detail-item span, .list-row { color: #64748b; }
.detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.detail-item { padding: 14px; border: 1px solid #dbe4ee; border-radius: 12px; background: #fafafa; }
.detail-item strong { display: block; margin-top: 6px; color: #404040; }
.list-row { display: grid; gap: 8px; padding: 14px 0; border-bottom: 1px solid #e5e7eb; }
.list-row:last-child { border-bottom: 0; }
.back-link { display: inline-flex; align-items: center; justify-content: center; width: fit-content; min-height: 40px; padding: 0 16px; border: 1px solid #d4d4d4; border-radius: 8px; background: #ffffff; color: #404040; text-decoration: none; font-weight: 700; }
@media (max-width: 920px) { .page { padding-inline: 0; } .grid, .detail-grid { grid-template-columns: 1fr; } }
</style>
