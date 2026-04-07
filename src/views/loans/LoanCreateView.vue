<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { currentUser } from '../../stores/authStore'
import { getAssets } from '../../services/assetService'
import { getEmployees } from '../../services/employeeService'
import { createLoan } from '../../stores/loanStore'

const route = useRoute()
const router = useRouter()
const errorMessage = ref('')
const isAdmin = computed(() => currentUser.value?.role === 'admin')

const availableAssets = computed(() => getAssets().filter((item) => item.status === 'Available'))
const users = computed(() =>
  isAdmin.value ? getEmployees() : getEmployees().filter((item) => item.employee_id === currentUser.value?.id),
)
const canSubmit = computed(() => availableAssets.value.length > 0 && users.value.length > 0)

const defaultAsset =
  availableAssets.value.find((item) => item.asset_id === String(route.query.asset_id || '')) ?? availableAssets.value[0]

const form = reactive({
  asset_id: defaultAsset?.asset_id ?? '',
  employee_id: currentUser.value?.role === 'staff' ? currentUser.value?.id || '' : users.value[0]?.employee_id ?? '',
  loan_date: new Date().toISOString().slice(0, 10),
})

watch(
  availableAssets,
  (items) => {
    const requestedAssetId = String(route.query.asset_id || '')
    const requestedAsset = items.find((item) => item.asset_id === requestedAssetId)

    if (!form.asset_id || !items.some((item) => item.asset_id === form.asset_id)) {
      form.asset_id = requestedAsset?.asset_id ?? items[0]?.asset_id ?? ''
    }
  },
  { immediate: true },
)

watch(
  users,
  (items) => {
    if (!form.employee_id || !items.some((item) => item.employee_id === form.employee_id)) {
      form.employee_id = items[0]?.employee_id ?? ''
    }
  },
  { immediate: true },
)

const submitForm = async () => {
  errorMessage.value = ''

  if (!availableAssets.value.length) {
    errorMessage.value = 'Belum ada asset berstatus Available untuk dipinjam.'
    return
  }

  if (!users.value.length) {
    errorMessage.value = 'Tambahkan employee terlebih dahulu sebelum membuat loan.'
    return
  }

  try {
    await createLoan({ ...form, employee_id: form.employee_id })
    router.push('/loans')
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<template>
  <section class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Loans › Create</p>
    </div>

    <h1 class="page-title">Create Loan Transaction</h1>

    <p v-if="errorMessage" class="notice">{{ errorMessage }}</p>

    <form class="form-card panel" @submit.prevent="submitForm">
      <div class="form-grid">
        <label class="field">
          <span>Asset</span>
          <select v-model="form.asset_id" required>
            <option v-if="!availableAssets.length" value="">Tidak ada asset available</option>
            <option v-for="item in availableAssets" :key="item.asset_id" :value="item.asset_id">
              {{ item.asset_code }} - {{ item.asset_name }}
            </option>
          </select>
        </label>

        <label class="field">
          <span>Employee</span>
          <select v-model="form.employee_id" required :disabled="!isAdmin">
            <option v-if="!users.length" value="">Belum ada employee tersedia</option>
            <option v-for="item in users" :key="item.employee_id" :value="item.employee_id">
              {{ item.employee_name }} ({{ item.role }})
            </option>
          </select>
        </label>

        <label class="field">
          <span>Loan Date</span>
          <input v-model="form.loan_date" type="date" required />
        </label>
      </div>

      <div class="actions">
        <button type="button" class="btn-secondary" @click="router.push('/loans')">Cancel</button>
        <button type="submit" class="btn-primary" :disabled="!canSubmit">Save Loan</button>
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
.notice { padding: 12px 14px; border: 1px solid #fca5a5; border-radius: 8px; background: #fef2f2; color: #991b1b; }
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
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
@media (max-width: 920px) { .page { padding-inline: 0; } .form-grid { grid-template-columns: 1fr; } }
</style>
