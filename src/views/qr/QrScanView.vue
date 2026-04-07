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
const scanMessage = ref('Pilih manual atau gunakan camera scanner untuk membaca QR asset.')
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
      helper: 'Menunjukkan kondisi fisik asset saat ini.',
    },
    {
      label: 'Operational Status',
      value: scannedAsset.value.status,
      helper: 'Menunjukkan apakah asset tersedia, dipinjam, rusak, atau maintenance.',
    },
    {
      label: 'Assigned Employee',
      value: scannedAsset.value.assigned_employee_name,
      helper: activeLoan.value ? 'Sedang tercatat dalam transaksi loan aktif.' : 'Belum ada loan aktif.',
    },
    {
      label: 'Recent Activity',
      value: latestActivity.value?.note ?? 'Belum ada history transaksi.',
      helper: latestActivity.value?.changed_at ?? 'History akan muncul setelah loan atau maintenance berjalan.',
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
    scanMessage.value = `QR ${matchedAsset.qr_code} berhasil dibaca dari camera.`
    return
  }

  scanMessage.value = `QR ${normalized} terbaca, tapi belum cocok dengan asset yang ada.`
}
</script>

<template>
  <section id="qr" class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › QR Center</p>
    </div>

    <h1 class="page-title">QR Scan & Asset Lookup</h1>

    <section class="grid">
      <article class="panel card-shell">
        <h3>Scanner Preview</h3>
        <QrScannerPanel @detected="handleDetected" />

        <label class="field">
          <span>QR Code Value</span>
          <select v-model="scannedCode">
            <option v-for="item in assets" :key="item.asset_id" :value="item.qr_code">
              {{ item.qr_code }} - {{ item.asset_name }}
            </option>
          </select>
        </label>

        <p class="helper-copy">{{ scanMessage }}</p>

        <div class="action-grid">
          <button type="button" class="btn-primary" :disabled="scannedAsset?.status !== 'Available'" @click="openBorrowFlow">
            Request Borrow
          </button>
          <button v-if="isAdmin" type="button" class="btn-secondary" :disabled="!activeLoan" @click="openReturnFlow">Return Asset</button>
          <button v-if="isAdmin" type="button" class="btn-secondary" @click="openMaintenanceFlow">Report Damage</button>
        </div>
      </article>

      <article v-if="scannedAsset" class="panel card-shell">
        <div class="asset-top">
          <div>
            <p class="eyebrow">Scanned Result</p>
            <h3>{{ scannedAsset.asset_name }}</h3>
            <p class="scan-subtitle">Informasi lengkap asset yang ditemukan dari QR yang discan.</p>
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
            <strong>{{ scannedAsset.qr_code }}</strong>
          </div>
        </div>

        <div class="insight-grid">
          <article v-for="item in qrInsights" :key="item.label" class="insight-card">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
            <p>{{ item.helper }}</p>
          </article>
        </div>

        <QrCodeCard :asset-name="scannedAsset.asset_name" :qr-value="scannedAsset.qr_code" />
        <RouterLink :to="`/qr/assets/${scannedAsset.asset_id}`" class="detail-link">Open Asset QR Detail</RouterLink>

        <div class="status-panels">
          <article class="status-card">
            <p class="history-title">Loan Snapshot</p>
            <div v-if="activeLoan" class="status-copy">
              <strong>{{ activeLoan.employee_name }}</strong>
              <span>Dipinjam sejak {{ activeLoan.loan_date }}</span>
              <span>Status transaksi: {{ activeLoan.status }}</span>
            </div>
            <div v-else class="status-copy">
              <strong>Tidak ada loan aktif</strong>
              <span>Asset ini sedang tidak dipinjam oleh employee mana pun.</span>
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
              <span>Belum ada record perbaikan yang tercatat untuk asset ini.</span>
            </div>
          </article>
        </div>

        <div class="history-box">
          <p class="history-title">Related History</p>
          <div v-for="item in relatedHistory" :key="item.history_id" class="history-row">
            <span>{{ item.changed_at }}</span>
            <span>{{ item.note }}</span>
          </div>
        </div>
      </article>
    </section>
  </section>
</template>

<style scoped>
.page {
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
  font-size: 24px;
  font-weight: 700;
  color: #404040;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card-shell {
  display: grid;
  gap: 20px;
  padding: 20px;
  flex: 1 1 360px;
  min-width: 0;
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
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  flex: 1 1 160px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 14px;
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
  gap: 16px;
}

.eyebrow {
  color: #64748b;
  font-size: 14px;
  font-weight: 700;
}

.scan-subtitle {
  margin-top: 6px;
  color: #64748b;
}

.detail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.detail-item {
  flex: 1 1 220px;
  padding: 14px;
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
}

.insight-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.insight-card,
.status-card {
  display: grid;
  gap: 8px;
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fafafa;
}

.insight-card span {
  color: #64748b;
}

.insight-card strong {
  color: #111827;
}

.insight-card p {
  color: #64748b;
  line-height: 1.5;
}

.status-panels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
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
  gap: 12px;
  align-items: flex-start;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.maintenance-row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.detail-link {
  color: var(--brand);
  font-weight: 700;
  text-decoration: underline;
}

.helper-copy {
  color: #64748b;
  line-height: 1.6;
}

.history-box {
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  overflow: hidden;
}

.history-title {
  padding: 14px 16px;
  background: #fafafa;
  border-bottom: 1px solid #dbe4ee;
  font-weight: 700;
}

.history-row {
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr);
  gap: 16px;
  padding: 14px 16px;
  border-bottom: 1px solid #e5e7eb;
  color: #525252;
}

.history-row:last-child {
  border-bottom: 0;
}

@media (max-width: 920px) {
  .page {
    padding-inline: 0;
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
