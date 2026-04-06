<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppBadge from '../../components/common/AppBadge.vue'
import QrCodeCard from '../../components/qr/QrCodeCard.vue'
import QrScannerPanel from '../../components/qr/QrScannerPanel.vue'
import { getAssets } from '../../services/assetService'
import { getAssetHistories } from '../../services/historyService'
import { getLoans } from '../../services/loanService'

const router = useRouter()
const assets = computed(() => getAssets())
const histories = computed(() => getAssetHistories())
const loans = computed(() => getLoans())
const scannedCode = ref(assets.value.find((item) => item.status === 'In Use')?.qr_code ?? assets.value[0]?.qr_code ?? '')
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

const statusTone = (status) => {
  if (status === 'Available') return 'success'
  if (status === 'Maintenance') return 'danger'
  return 'warning'
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
          <button type="button" class="btn-secondary" :disabled="!activeLoan" @click="openReturnFlow">Return Asset</button>
          <button type="button" class="btn-secondary" @click="openMaintenanceFlow">Report Damage</button>
        </div>
      </article>

      <article v-if="scannedAsset" class="panel card-shell">
        <div class="asset-top">
          <div>
            <p class="eyebrow">Scanned Result</p>
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
            <span>Used By</span>
            <strong>{{ scannedAsset.assigned_employee_name }}</strong>
          </div>
          <div class="detail-item">
            <span>QR Value</span>
            <strong>{{ scannedAsset.qr_code }}</strong>
          </div>
        </div>

        <QrCodeCard :asset-name="scannedAsset.asset_name" :qr-value="scannedAsset.qr_code" />
        <RouterLink :to="`/qr/assets/${scannedAsset.asset_id}`" class="detail-link">Open Asset QR Detail</RouterLink>

        <p class="helper-copy">
          QR code ini bersifat tetap untuk identitas asset. Status asset berubah otomatis setelah aksi
          <strong>Borrow</strong>, <strong>Return</strong>, atau <strong>Report Damage</strong> dijalankan.
        </p>

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
  .btn-primary,
  .btn-secondary {
    flex-basis: 100%;
  }
}
</style>
