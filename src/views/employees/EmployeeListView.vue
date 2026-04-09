<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppBadge from '../../components/common/AppBadge.vue'
import { getEmployees } from '../../services/employeeService'

const employees = computed(() => getEmployees())
const activeBorrowers = computed(() => employees.value.filter((item) => item.active_loans > 0).length)
const employeesWithPhone = computed(() => employees.value.filter((item) => item.phone).length)
</script>

<template>
  <section id="employees" class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Employees</p>
    </div>

    <h1 class="page-title">Employees</h1>

    <section class="card-shell panel">
      <div class="toolbar">
        <div>
          <p class="eyebrow">Borrower Master Data</p>
          <h3>Employee Records for Loan Flow</h3>
          <p>Employee di halaman ini adalah data peminjam yang dipakai saat transaksi asset loan.</p>
        </div>
        <RouterLink to="/employees/create" class="btn-primary btn-link">Add Employee</RouterLink>
      </div>

      <div class="stats-grid">
        <article class="metric-box">
          <span>Total Employees</span>
          <strong>{{ employees.length }}</strong>
        </article>
        <article class="metric-box">
          <span>With Phone Number</span>
          <strong>{{ employeesWithPhone }}</strong>
        </article>
        <article class="metric-box">
          <span>Active Borrowers</span>
          <strong>{{ activeBorrowers }}</strong>
        </article>
        <article class="metric-box">
          <span>Total Loans</span>
          <strong>{{ employees.reduce((sum, item) => sum + item.total_loans, 0) }}</strong>
        </article>
      </div>

      <div class="borrower-note">
        <strong>Alur sistem</strong>
        <p>
          Employee bukan akun login. Akun login ada di tabel <code>users</code>, sedangkan halaman
          ini menyimpan data orang yang boleh tercatat sebagai peminjam asset.
        </p>
      </div>

      <div class="table-shell">
        <table class="data-table">
          <thead>
            <tr>
              <th>EMPLOYEE</th>
              <th>EMAIL</th>
              <th>PHONE</th>
              <th>ACTIVE LOANS</th>
              <th>TOTAL LOANS</th>
              <th>BORROWER STATUS</th>
              <th>JOINED</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in employees" :key="item.employee_id">
              <td>{{ item.employee_name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.phone || '-' }}</td>
              <td>{{ item.active_loans }}</td>
              <td>{{ item.total_loans }}</td>
              <td>
                <AppBadge
                  :label="item.active_loans > 0 ? 'Active Borrower' : 'Idle Borrower'"
                  :tone="item.active_loans > 0 ? 'warning' : 'neutral'"
                />
              </td>
              <td>{{ item.created_at }}</td>
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

.breadcrumb {
  margin: 0;
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

.toolbar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #d4d4d4;
}

.toolbar h3,
.toolbar p {
  margin: 0;
}

.toolbar p {
  color: #64748b;
}

.eyebrow {
  margin: 0 0 4px;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.metric-box {
  flex: 1 1 220px;
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

.borrower-note {
  display: grid;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fafafa;
}

.borrower-note strong {
  color: #111827;
}

.borrower-note p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
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

.btn-primary {
  min-height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid #363636;
  background: linear-gradient(270deg, #171717 0%, #363636 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

@media (max-width: 920px) {
  .page {
    padding-inline: 0;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .table-shell {
    overflow-x: auto;
  }

  .data-table {
    min-width: 920px;
  }
}
</style>
