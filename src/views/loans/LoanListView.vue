<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppBadge from '../../components/common/AppBadge.vue'
import { getLoans } from '../../services/loanService'
import { deleteLoan } from '../../stores/loanStore'

const loans = computed(() => getLoans())

const activeLoans = computed(() => loans.value.filter((item) => item.status === 'Borrowed').length)
const returnedLoans = computed(() => loans.value.filter((item) => item.status === 'Returned').length)

const statusTone = (status) => (status === 'Returned' ? 'success' : 'warning')

const removeLoan = async (loanId) => {
  if (!window.confirm('Hapus transaksi loan ini?')) return
  await deleteLoan(loanId)
}
</script>

<template>
  <section id="loans" class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Loans</p>
    </div>

    <h1 class="page-title">Asset Loans</h1>

    <section class="card-shell panel">
      <div class="toolbar">
        <div>
          <h3>Borrowing Activity</h3>
          <p>Pantau aset yang sedang dipinjam dan riwayat pengembaliannya.</p>
        </div>
        <RouterLink to="/loans/create" class="btn-primary btn-link">Create Loan</RouterLink>
      </div>

      <div class="stats-grid">
        <article class="metric-box">
          <span>Total Transactions</span>
          <strong>{{ loans.length }}</strong>
        </article>
        <article class="metric-box">
          <span>Active Loans</span>
          <strong>{{ activeLoans }}</strong>
        </article>
        <article class="metric-box">
          <span>Returned</span>
          <strong>{{ returnedLoans }}</strong>
        </article>
      </div>

      <div class="table-shell">
        <table class="data-table">
          <thead>
            <tr>
              <th>ASSET</th>
              <th>EMPLOYEE</th>
              <th>LOAN DATE</th>
              <th>RETURN DATE</th>
              <th>STATUS</th>
              <th>NOTE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in loans" :key="item.loan_id">
              <td>{{ item.asset_name }}</td>
              <td>{{ item.employee_name }}</td>
              <td>{{ item.loan_date }}</td>
              <td>{{ item.return_date || '-' }}</td>
              <td><AppBadge :label="item.status" :tone="statusTone(item.status)" /></td>
              <td>{{ item.note || '-' }}</td>
              <td>
                <div class="action-group">
                  <RouterLink
                    v-if="item.status === 'Borrowed'"
                    :to="`/loans/${item.loan_id}/return`"
                    class="action-link"
                  >
                    Return
                  </RouterLink>
                  <span v-else class="muted-text">Done</span>
                  <button type="button" class="action-link delete" @click="removeLoan(item.loan_id)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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

.breadcrumb,
h3,
p {
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

.card-shell {
  display: grid;
  gap: 20px;
  width: 100%;
  padding: 20px;
}

.toolbar,
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

.toolbar p {
  color: #64748b;
}

.btn-primary {
  min-height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid #363636;
  background: linear-gradient(270deg, #171717 0%, #363636 100%);
  color: #ffffff;
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

.stats-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.metric-box {
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fafafa;
}

.metric-box span {
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

.data-table th,
.data-table td {
  padding: 16px 20px;
  text-align: left;
}

.data-table th {
  background: #fafafa;
  border-bottom: 1px solid #d4d4d4;
  font-size: 15px;
  font-weight: 700;
  color: #404040;
}

.data-table td {
  border-bottom: 1px solid #e5e7eb;
  color: #525252;
}

.data-table tbody tr:last-child td {
  border-bottom: 0;
}

.action-link {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--brand);
  text-decoration: underline;
  font-weight: 700;
  cursor: pointer;
}

.action-group {
  display: inline-flex;
  gap: 10px;
  align-items: center;
}

.action-link.delete {
  color: var(--danger);
}

.muted-text {
  color: #94a3b8;
}

@media (max-width: 920px) {
  .page {
    padding-inline: 0;
  }

  .toolbar,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
