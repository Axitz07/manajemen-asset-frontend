<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppBadge from '../../components/common/AppBadge.vue'
import QrCodeCard from '../../components/qr/QrCodeCard.vue'
import QrScannerPanel from '../../components/qr/QrScannerPanel.vue'
import { currentUser } from '../../stores/authStore'
import { getAssets } from '../../services/assetService'
import { getAssetHistories } from '../../services/historyService'
import { getLoans } from '../../services/loanService'
import { getMaintenances } from '../../services/maintenanceService'

const router = useRouter()
const assets = computed(() => getAssets())
const histories = computed(() => getAssetHistories())
const loans = computed(() => getLoans())
const maintenances = computed(() => getMaintenances())
const isAdmin = computed(() => currentUser.value?.role === 'admin')
const scannedCode = ref(assets.value.find((item) => item.status === 'Borrowed')?.qr_code ?? assets.value[0]?.qr_code ?? '')
const scannedAsset = computed(() => assets.value.find((item) => item.qr_code === scannedCode.value) ?? assets.value[0] ?? null)
const relatedHistory = computed(() =>
  histories.value.filter((item) => item.asset_id === scannedAsset.value?.asset_id).slice(0, 4),
)
const activeLoan = computed(
  () =>
    loans.value.find(
      (item) => item.asset_id === scannedAsset.value?.asset_id && item.status === 'Borrowed',
    ) ?? null,
)
const relatedMaintenances = computed(() =>
  maintenances.value.filter((item) => item.asset_id === scannedAsset.value?.asset_id).slice(0, 3),
)
const latestActivity = computed(() => relatedHistory.value[0] ?? null)
const qrInsights = computed(() => {
  if (!scannedAsset.value) return []

  return [
    {
      label: 'Physical Condition',
      value: scannedAsset.value.condition,
    },
    {
      label: 'Operational Status',
      value: scannedAsset.value.status,
    },
    {
      label: 'Assigned Employee',
      value: scannedAsset.value.assigned_employee_name,
    },
    {
      label: 'Recent Activity',
      value: latestActivity.value?.note ?? 'Belum ada history.',
    },
  ]
})

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

const openBorrowFlow = () => {
  if (!scannedAsset.value || scannedAsset.value.status !== 'Available') return
  router.push(`/loans/create?asset_id=${scannedAsset.value.asset_id}`)
}

const openReturnFlow = () => {
  if (!activeLoan.value) return
  router.push(`/loans/${activeLoan.value.loan_id}/return`)
}

const openMaintenanceFlow = () => {
  if (!scannedAsset.value) return
  router.push(`/maintenance/create?asset_id=${scannedAsset.value.asset_id}`)
}

const handleDetected = (rawValue) => {
  const normalized = String(rawValue || '').trim()
  const matchedAsset = assets.value.find((item) => item.qr_code === normalized)

  if (matchedAsset) {
    scannedCode.value = matchedAsset.qr_code
    return
  }
}
</script>

<template>
  <section id="qr" class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › QR Center</p>
    </div>

    <div class="hero card-shell">
      <div>
        <h1 class="page-title">Scan, lookup, dan cetak QR asset</h1>
      </div>

      <div class="hero-meta">
        <div class="meta-chip">
          <span>Total Asset</span>
          <strong>{{ assets.length }}</strong>
        </div>
        <div class="meta-chip">
          <span>QR Terpilih</span>
          <strong>{{ scannedCode || '-' }}</strong>
        </div>
      </div>
    </div>

    <section class="grid">
      <article class="panel card-shell scanner-card">
        <div class="section-head">
          <div>
            <p class="eyebrow">Scanner Preview</p>
            <h3>Camera Scan</h3>
          </div>
          <AppBadge label="Admin View" tone="neutral" />
        </div>

        <QrScannerPanel @detected="handleDetected" />

        <label class="field">
          <span>QR Code Value</span>
          <select v-model="scannedCode">
            <option v-for="item in assets" :key="item.asset_id" :value="item.qr_code">
              {{ item.asset_name }} • {{ item.qr_code }}
            </option>
          </select>
        </label>

        <div class="action-grid">
          <button
            type="button"
            class="btn-primary"
            :disabled="scannedAsset?.status !== 'Available'"
            @click="openBorrowFlow"
          >
            Request Borrow
          </button>
          <button v-if="isAdmin" type="button" class="btn-secondary" :disabled="!activeLoan" @click="openReturnFlow">
            Return Asset
          </button>
          <button v-if="isAdmin" type="button" class="btn-secondary" @click="openMaintenanceFlow">Report Damage</button>
        </div>
      </article>

      <article v-if="scannedAsset" class="panel card-shell result-card">
        <div class="asset-top">
          <div>
            <h3>{{ scannedAsset.asset_name }}</h3>
          </div>
          <AppBadge :label="scannedAsset.status" :tone="statusTone(scannedAsset.status)" />
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <span>Asset Code</span>
            <strong>{{ scannedAsset.asset_code }}</strong>
          </div>
          <div class="detail-item">
            <span>Category</span>
            <strong>{{ scannedAsset.category_name }}</strong>
          </div>
          <div class="detail-item">
            <span>Employee</span>
            <strong>{{ scannedAsset.assigned_employee_name }}</strong>
          </div>
          <div class="detail-item">
            <span>QR Value</span>
            <strong class="mono">{{ scannedAsset.qr_code }}</strong>
          </div>
        </div>

        <div class="insight-grid">
          <article v-for="item in qrInsights" :key="item.label" class="insight-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>

        <div class="asset-tools">
          <QrCodeCard :asset-name="scannedAsset.asset_name" :qr-value="scannedAsset.qr_code" />
          <RouterLink :to="`/qr/assets/${scannedAsset.asset_id}`" class="detail-link">Open Asset QR Detail</RouterLink>
        </div>

        <div class="status-panels">
          <article class="status-card">
            <p class="history-title">Loan Snapshot</p>
            <div v-if="activeLoan" class="status-copy">
              <strong>{{ activeLoan.employee_name }}</strong>
              <span>{{ activeLoan.loan_date }} • {{ activeLoan.status }}</span>
            </div>
            <div v-else class="status-copy">
              <strong>Tidak ada loan aktif</strong>
            </div>
          </article>

          <article class="status-card">
            <p class="history-title">Maintenance Snapshot</p>
            <div v-if="relatedMaintenances.length" class="status-copy">
              <div v-for="item in relatedMaintenances" :key="item.maintenance_id" class="maintenance-row">
                <div>
                  <strong>{{ item.issue_description }}</strong>
                  <span>{{ item.maintenance_date }}</span>
                </div>
                <AppBadge :label="item.maintenance_status" :tone="maintenanceTone(item.maintenance_status)" />
              </div>
            </div>
            <div v-else class="status-copy">
              <strong>Belum ada maintenance</strong>
            </div>
          </article>
        </div>

        <div class="history-box">
          <p class="history-title">Related History</p>
          <div v-if="relatedHistory.length" class="history-list">
            <div v-for="item in relatedHistory" :key="item.history_id" class="history-row">
              <span>{{ item.changed_at }}</span>
              <span>{{ item.note }}</span>
            </div>
          </div>
          <div v-else class="empty-state">Belum ada history.</div>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  padding: 18px 20px 56px;
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
span,
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
  font-size: 22px;
  font-weight: 700;
  color: #404040;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}

.card-shell {
  display: grid;
  gap: 14px;
  padding: 16px;
  min-width: 0;
}

.hero {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 16px;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.meta-chip {
  min-width: 160px;
  padding: 12px 14px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fafafa;
}

.meta-chip span {
  display: block;
  color: #64748b;
  font-size: 13px;
}

.meta-chip strong {
  display: block;
  margin-top: 6px;
  color: #111827;
  word-break: break-word;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.field {
  display: grid;
  gap: 8px;
  font-weight: 700;
  color: #404040;
}

.field select {
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  background: #ffffff;
}

.action-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn-primary,
.btn-secondary {
  flex: 1 1 160px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  font-size: 13px;
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

.btn-primary:disabled,
.btn-secondary:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.asset-top {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.detail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.detail-item {
  flex: 1 1 220px;
  padding: 12px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fafafa;
}

.detail-item span {
  display: block;
  color: #64748b;
}

.detail-item strong {
  display: block;
  margin-top: 6px;
  color: #404040;
  word-break: break-word;
}

.insight-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.insight-card,
.status-card {
  display: grid;
  gap: 6px;
  padding: 12px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fafafa;
}

.insight-card span {
  color: #64748b;
}

.insight-card strong {
  color: #111827;
  word-break: break-word;
}

.status-panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.status-copy {
  display: grid;
  gap: 6px;
  color: #64748b;
}

.status-copy strong {
  color: #111827;
}

.maintenance-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.maintenance-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.asset-tools {
  display: grid;
  gap: 10px;
}

.detail-link {
  width: fit-content;
  color: var(--brand);
  font-weight: 700;
  text-decoration: underline;
}

.history-box {
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
}

.history-title {
  padding: 12px 14px;
  background: #fafafa;
  border-bottom: 1px solid #dbe4ee;
  font-weight: 700;
}

.history-row {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr);
  gap: 12px;
  padding: 12px 14px;
  border-bottom: 1px solid #e5e7eb;
  color: #525252;
}

.history-row:last-child {
  border-bottom: 0;
}

.history-list {
  display: grid;
}

.empty-state {
  padding: 12px 14px;
  color: #64748b;
}

.mono {
  font-variant-numeric: tabular-nums;
  word-break: break-all;
}

@media (max-width: 920px) {
  .page {
    padding-inline: 0;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .hero,
  .section-head,
  .asset-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-row {
    grid-template-columns: 1fr;
  }

  .card-shell,
  .detail-item,
  .insight-grid,
  .status-panels,
  .btn-primary,
  .btn-secondary {
    flex-basis: 100%;
  }

  .insight-grid,
  .status-panels {
    grid-template-columns: 1fr;
  }
}
</style>
