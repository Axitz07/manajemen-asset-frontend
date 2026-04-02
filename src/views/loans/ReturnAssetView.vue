<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import AppBadge from '../../components/common/AppBadge.vue'
import { getLoans } from '../../services/loanService'
import { returnLoan } from '../../stores/loanStore'

const route = useRoute()
const router = useRouter()
const loan = computed(() => getLoans().find((item) => item.loan_id === Number(route.params.id)) ?? null)

const statusTone = (status) => (status === 'Returned' ? 'success' : 'warning')

const submitReturn = async () => {
  if (!loan.value) return
  await returnLoan(loan.value.loan_id)
  router.push('/loans')
}
</script>

<template>
  <section class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Loans › Return</p>
    </div>

    <h1 class="page-title">Return Asset</h1>

    <div v-if="!loan" class="not-found panel">
      <p>Data peminjaman tidak ditemukan.</p>
      <RouterLink to="/loans" class="back-link">Kembali ke loans</RouterLink>
    </div>

    <section v-else class="form-card panel">
      <div class="summary-grid">
        <div class="summary-item">
          <span>Asset</span>
          <strong>{{ loan.asset_name }}</strong>
        </div>
        <div class="summary-item">
          <span>Employee</span>
          <strong>{{ loan.employee_name }}</strong>
        </div>
        <div class="summary-item">
          <span>Loan Date</span>
          <strong>{{ loan.loan_date }}</strong>
        </div>
        <div class="summary-item">
          <span>Status</span>
          <AppBadge :label="loan.status" :tone="statusTone(loan.status)" />
        </div>
      </div>

      <p class="info-text">
        Saat tombol return ditekan, status loan akan menjadi `Returned` dan status asset otomatis kembali ke
        `Available`.
      </p>

      <div class="actions">
        <button type="button" class="btn-secondary" @click="router.push('/loans')">Cancel</button>
        <button type="button" class="btn-primary" :disabled="loan.status === 'Returned'" @click="submitReturn">
          Confirm Return
        </button>
      </div>
    </section>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 16px; width: 100%; padding: 20px 20px 80px; box-sizing: border-box; }
.breadcrumb-row { display: flex; align-items: center; width: 100%; min-height: 27px; padding-bottom: 8px; border-bottom: 1px solid #d4d4d4; }
.breadcrumb, .page-title, .not-found p, .info-text { margin: 0; }
.breadcrumb { font-size: 14px; font-weight: 600; color: #737373; }
.page-title { font-size: 24px; font-weight: 700; color: #404040; }
.form-card, .not-found { display: grid; gap: 24px; padding: 24px; }
.summary-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.summary-item { display: grid; gap: 8px; padding: 16px; border: 1px solid #dbe4ee; border-radius: 12px; background: #fafafa; }
.summary-item span { color: #64748b; }
.summary-item strong { color: #404040; }
.info-text { color: #64748b; }
.actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn-primary, .btn-secondary, .back-link { min-height: 40px; padding: 0 16px; border-radius: 8px; font-weight: 700; }
.btn-primary { border: 1px solid #363636; background: linear-gradient(270deg, #171717 0%, #363636 100%); color: #ffffff; cursor: pointer; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { border: 1px solid #d4d4d4; background: #ffffff; color: #404040; cursor: pointer; }
.back-link { display: inline-flex; align-items: center; justify-content: center; width: fit-content; border: 1px solid #d4d4d4; background: #ffffff; color: #404040; text-decoration: none; }
@media (max-width: 920px) { .page { padding-inline: 0; } .summary-grid { grid-template-columns: 1fr; } }
</style>
