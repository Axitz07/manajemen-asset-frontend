<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { createEmployee } from '../../stores/employeeStore'

const router = useRouter()
const form = reactive({
  employee_name: '',
  email: '',
  phone: '',
})

const submitForm = () => {
  createEmployee(form)
  router.push('/employees')
}
</script>

<template>
  <section class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Employees › Create</p>
    </div>

    <h1 class="page-title">Create Employee</h1>

    <form class="form-card panel" @submit.prevent="submitForm">
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
          <span>Phone</span>
          <input v-model="form.phone" type="text" required />
        </label>
      </div>

      <div class="actions">
        <button type="button" class="btn-secondary" @click="router.push('/employees')">Cancel</button>
        <button type="submit" class="btn-primary">Save Employee</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: 16px; width: 100%; padding: 20px 20px 80px; box-sizing: border-box; }
.breadcrumb-row { display: flex; align-items: center; width: 100%; min-height: 27px; padding-bottom: 8px; border-bottom: 1px solid #d4d4d4; }
.breadcrumb, .page-title { margin: 0; }
.breadcrumb { font-size: 14px; font-weight: 600; color: #737373; }
.page-title { font-size: 24px; font-weight: 700; color: #404040; }
.form-card { display: grid; gap: 24px; padding: 24px; }
.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.field { display: grid; gap: 8px; font-weight: 700; color: #404040; }
.field input { min-height: 44px; padding: 0 14px; border: 1px solid #d4d4d4; border-radius: 8px; }
.actions { display: flex; justify-content: flex-end; gap: 12px; }
.btn-primary, .btn-secondary { min-height: 40px; padding: 0 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
.btn-primary { border: 1px solid #363636; background: linear-gradient(270deg, #171717 0%, #363636 100%); color: #ffffff; }
.btn-secondary { border: 1px solid #d4d4d4; background: #ffffff; color: #404040; }
@media (max-width: 920px) { .page { padding-inline: 0; } .form-grid { grid-template-columns: 1fr; } }
</style>
