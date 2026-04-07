<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAssets } from '../../services/assetService'
import { createMaintenance } from '../../stores/maintenanceStore'

const route = useRoute()
const router = useRouter()
const errorMessage = ref('')

const assets = computed(() => getAssets())
const defaultAsset = assets.value.find((item) => item.asset_id === String(route.query.asset_id || '')) ?? assets.value[0]

const form = reactive({
  asset_id: defaultAsset?.asset_id ?? '',
  issue_description: route.query.issue ? String(route.query.issue) : '',
  maintenance_date: new Date().toISOString().slice(0, 10),
  maintenance_status: 'Pending',
})

const submitForm = async () => {
  errorMessage.value = ''

  try {
    await createMaintenance(form)
    router.push('/maintenance')
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<template>
  <section class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Maintenance › Create</p>
    </div>

    <h1 class="page-title">Create Maintenance Record</h1>

    <p v-if="errorMessage" class="notice">{{ errorMessage }}</p>

    <form class="form-card panel" @submit.prevent="submitForm">
      <div class="form-grid">
        <label class="field">
          <span>Asset</span>
          <select v-model="form.asset_id" required>
            <option v-for="item in assets" :key="item.asset_id" :value="item.asset_id">
              {{ item.asset_code }} - {{ item.asset_name }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Start Date</span>
          <input v-model="form.maintenance_date" type="date" required />
        </label>

        <label class="field">
          <span>Status</span>
          <select v-model="form.maintenance_status">
            <option>Pending</option>
            <option>Progress</option>
            <option>Done</option>
          </select>
        </label>

        <label class="field field--full">
          <span>Issue Description</span>
          <textarea v-model="form.issue_description" rows="4" required></textarea>
        </label>
      </div>

      <div class="actions">
        <button type="button" class="btn-secondary" @click="router.push('/maintenance')">Cancel</button>
        <button type="submit" class="btn-primary">Save Maintenance</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 16px; width: 100%; padding: 20px 20px 80px; box-sizing: border-box; }
.breadcrumb-row { display: flex; align-items: center; width: 100%; min-height: 27px; padding-bottom: 8px; border-bottom: 1px solid #d4d4d4; }
.breadcrumb, .page-title, .notice { margin: 0; }
.breadcrumb { font-size: 14px; font-weight: 600; color: #737373; }
.page-title { font-size: 24px; font-weight: 700; color: #404040; }
.notice { padding: 12px 14px; border: 1px solid #fecaca; border-radius: 8px; background: #fef2f2; color: #b91c1c; }
.form-card { display: grid; gap: 24px; padding: 24px; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.field { display: grid; gap: 8px; font-weight: 700; color: #404040; }
.field--full { grid-column: 1 / -1; }
.field input, .field select, .field textarea { min-height: 44px; padding: 0 14px; border: 1px solid #d4d4d4; border-radius: 8px; background: #ffffff; }
.field textarea { min-height: 110px; padding-top: 12px; resize: vertical; }
.actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn-primary, .btn-secondary { min-height: 40px; padding: 0 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-primary { border: 1px solid #363636; background: linear-gradient(270deg, #171717 0%, #363636 100%); color: #ffffff; }
.btn-secondary { border: 1px solid #d4d4d4; background: #ffffff; color: #404040; }
@media (max-width: 920px) { .page { padding-inline: 0; } .form-grid { grid-template-columns: 1fr; } }
</style>
