<script setup>
import { reactive, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { findEmployeeById, updateEmployee } from '../../stores/employeeStore'

const route = useRoute()
const router = useRouter()
const employee = findEmployeeById(route.params.id)
const form = reactive({
  employee_name: employee?.employee_name ?? '',
  email: employee?.email ?? '',
  role: employee?.role ?? 'staff',
})
const errorMessage = ref('')

const submitForm = async () => {
  if (!employee) return

  errorMessage.value = ''

  try {
    await updateEmployee(route.params.id, form)
    router.push('/employees')
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<template>
  <section class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Employees › Edit</p>
    </div>

    <h1 class="page-title">Edit Employee</h1>

    <p v-if="errorMessage" class="notice">{{ errorMessage }}</p>

    <div v-if="!employee" class="not-found panel">
      <p>Employee tidak ditemukan.</p>
      <RouterLink to="/employees" class="back-link">Kembali ke employees</RouterLink>
    </div>

    <form v-else class="form-card panel" @submit.prevent="submitForm">
      <div class="form-grid">
        <label class="field">
          <span>Employee Name</span>
          <input v-model="form.employee_name" type="text" required />
        </label>
        <label class="field">
          <span>Email</span>
          <input v-model="form.email" type="email" required />
        </label>
        <label class="field">
          <span>Role</span>
          <select v-model="form.role">
            <option value="admin">admin</option>
            <option value="staff">staff</option>
          </select>
        </label>
      </div>

      <div class="actions">
        <button type="button" class="btn-secondary" @click="router.push('/employees')">Cancel</button>
        <button type="submit" class="btn-primary">Update Employee</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 16px; width: 100%; padding: 20px 20px 80px; box-sizing: border-box; }
.breadcrumb-row { display: flex; align-items: center; width: 100%; min-height: 27px; padding-bottom: 8px; border-bottom: 1px solid #d4d4d4; }
.breadcrumb, .page-title, .not-found p { margin: 0; }
.breadcrumb { font-size: 14px; font-weight: 600; color: #737373; }
.page-title { font-size: 24px; font-weight: 700; color: #404040; }
.notice { margin: 0; padding: 12px 14px; border: 1px solid #fecaca; border-radius: 8px; background: #fef2f2; color: #b91c1c; }
.form-card, .not-found { display: grid; gap: 24px; padding: 24px; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.field { display: grid; gap: 8px; font-weight: 700; color: #404040; }
.field input,
.field select { min-height: 44px; padding: 0 14px; border: 1px solid #d4d4d4; border-radius: 8px; background: #ffffff; }
.actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn-primary, .btn-secondary, .back-link { min-height: 40px; padding: 0 16px; border-radius: 8px; font-weight: 700; }
.btn-primary { border: 1px solid #363636; background: linear-gradient(270deg, #171717 0%, #363636 100%); color: #ffffff; cursor: pointer; }
.btn-secondary { border: 1px solid #d4d4d4; background: #ffffff; color: #404040; cursor: pointer; }
.back-link { display: inline-flex; align-items: center; justify-content: center; width: fit-content; border: 1px solid #d4d4d4; background: #ffffff; color: #404040; text-decoration: none; }
@media (max-width: 920px) { .page { padding-inline: 0; } .form-grid { grid-template-columns: 1fr; } }
</style>
