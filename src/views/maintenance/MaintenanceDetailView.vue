<script setup>
import { reactive } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { findMaintenanceById, updateMaintenance } from '../../stores/maintenanceStore'
import { getAssets } from '../../services/assetService'

const route = useRoute()
const router = useRouter()
const maintenance = findMaintenanceById(route.params.id)
const asset = getAssets().find((item) => item.asset_id === maintenance?.asset_id) ?? null

const form = reactive({
  issue_description: maintenance?.issue_description ?? '',
  maintenance_date: maintenance?.maintenance_date ?? new Date().toISOString().slice(0, 10),
  maintenance_status: maintenance?.maintenance_status ?? 'Repairing',
})

const submitForm = () => {
  if (!maintenance) return
  updateMaintenance(maintenance.maintenance_id, form)
  router.push('/maintenance')
}
</script>

<template>
  <section class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Maintenance › Detail</p>
    </div>

    <h1 class="page-title">Maintenance Detail</h1>

    <div v-if="!maintenance" class="not-found panel">
      <p>Data maintenance tidak ditemukan.</p>
      <RouterLink to="/maintenance" class="back-link">Kembali ke maintenance</RouterLink>
    </div>

    <form v-else class="form-card panel" @submit.prevent="submitForm">
      <div class="summary-card">
        <span>Asset</span>
        <strong>{{ asset?.asset_code }} - {{ asset?.asset_name }}</strong>
      </div>

      <div class="form-grid">
        <label class="field">
          <span>Maintenance Date</span>
          <input v-model="form.maintenance_date" type="date" required />
        </label>

        <label class="field">
          <span>Status</span>
          <select v-model="form.maintenance_status">
            <option>Repairing</option>
            <option>Done</option>
          </select>
        </label>

        <label class="field field--full">
          <span>Issue Description</span>
          <textarea v-model="form.issue_description" rows="4" required></textarea>
        </label>
      </div>

      <p class="info-text">
        Saat status diubah ke `Done`, status asset otomatis kembali ke `Available` dan history akan tercatat.
      </p>

      <div class="actions">
        <button type="button" class="btn-secondary" @click="router.push('/maintenance')">Cancel</button>
        <button type="submit" class="btn-primary">Update Maintenance</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 16px; width: 100%; padding: 20px 20px 80px; box-sizing: border-box; }
.breadcrumb-row { display: flex; align-items: center; width: 100%; min-height: 27px; padding-bottom: 8px; border-bottom: 1px solid #d4d4d4; }
.breadcrumb, .page-title, .not-found p, .info-text { margin: 0; }
.breadcrumb { font-size: 14px; font-weight: 600; color: #737373; }
.page-title { font-size: 24px; font-weight: 700; color: #404040; }
.form-card, .not-found { display: grid; gap: 24px; padding: 24px; }
.summary-card { display: grid; gap: 8px; padding: 16px; border: 1px solid #dbe4ee; border-radius: 12px; background: #fafafa; }
.summary-card span, .info-text { color: #64748b; }
.summary-card strong { color: #404040; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.field { display: grid; gap: 8px; font-weight: 700; color: #404040; }
.field--full { grid-column: 1 / -1; }
.field input, .field select, .field textarea { min-height: 44px; padding: 0 14px; border: 1px solid #d4d4d4; border-radius: 8px; background: #ffffff; }
.field textarea { min-height: 110px; padding-top: 12px; resize: vertical; }
.actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn-primary, .btn-secondary, .back-link { min-height: 40px; padding: 0 16px; border-radius: 8px; font-weight: 700; }
.btn-primary { border: 1px solid #363636; background: linear-gradient(270deg, #171717 0%, #363636 100%); color: #ffffff; cursor: pointer; }
.btn-secondary { border: 1px solid #d4d4d4; background: #ffffff; color: #404040; cursor: pointer; }
.back-link { display: inline-flex; align-items: center; justify-content: center; width: fit-content; border: 1px solid #d4d4d4; background: #ffffff; color: #404040; text-decoration: none; }
@media (max-width: 920px) { .page { padding-inline: 0; } .form-grid { grid-template-columns: 1fr; } }
</style>
