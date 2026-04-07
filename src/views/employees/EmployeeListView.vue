<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { deleteEmployee } from '../../stores/employeeStore'
import { getEmployees } from '../../services/employeeService'

const employees = computed(() => getEmployees())
const activeBorrowers = computed(() => employees.value.filter((item) => item.active_loans > 0).length)
const adminCount = computed(() => employees.value.filter((item) => item.role === 'admin').length)

const removeEmployee = async (employeeId) => {
  if (!window.confirm('Hapus employee ini?')) return
  await deleteEmployee(employeeId)
}
</script>

<template>
  <section id="employees" class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Employees</p>
    </div>

    <h1 class="page-title">Employees Directory</h1>

    <section class="card-shell panel">
      <div class="toolbar">
        <div>
          <h3>Employee Master Data</h3>
          <p>Kelola akun admin dan staff yang memakai sistem asset management.</p>
        </div>
        <RouterLink to="/employees/create" class="btn-primary btn-link">Add Employee</RouterLink>
      </div>

      <div class="stats-grid">
        <article class="metric-box">
          <span>Total Employees</span>
          <strong>{{ employees.length }}</strong>
        </article>
        <article class="metric-box">
          <span>Admin Employees</span>
          <strong>{{ adminCount }}</strong>
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

      <div class="table-shell">
        <table class="data-table">
          <thead>
            <tr>
              <th>EMPLOYEE</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>ACTIVE LOANS</th>
              <th>TOTAL LOANS</th>
              <th>JOINED</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in employees" :key="item.employee_id">
              <td>{{ item.employee_name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.role }}</td>
              <td>{{ item.active_loans }}</td>
              <td>{{ item.total_loans }}</td>
              <td>{{ item.created_at }}</td>
              <td>
                <div class="action-group">
                  <RouterLink :to="`/employees/${item.employee_id}/edit`" class="action-link edit">Edit</RouterLink>
                  <button type="button" class="action-link delete" @click="removeEmployee(item.employee_id)">
                    Delete
                  </button>
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

.action-group {
  display: inline-flex;
  gap: 10px;
}

.action-link {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--brand);
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
}

.action-link.delete {
  color: var(--danger);
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
}
</style>
