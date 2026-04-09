import { ref } from 'vue'
import { apiRequest } from '../lib/api'

export const employeeItems = ref([])

const normalizeEmployee = (item) => ({
  employee_id: item.id,
  employee_name: item.name,
  email: item.email,
  phone: item.phone || '',
  created_at: item.created_at,
})

export async function loadEmployees() {
  const response = await apiRequest('employees?limit=1000&offset=0')
  employeeItems.value = (response.data || []).map(normalizeEmployee)
  return employeeItems.value
}

export async function createEmployee(payload) {
  const response = await apiRequest('employees', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.employee_name?.trim(),
      email: payload.email?.trim(),
      phone: payload.phone?.trim() || '',
    }),
  })

  const newItem = normalizeEmployee(response.data || {})
  employeeItems.value = [...employeeItems.value, newItem]
  return newItem
}

export async function updateEmployee(employeeId, payload) {
  throw new Error(`Edit employee belum tersedia di backend v3.`)
}

export async function deleteEmployee(employeeId) {
  throw new Error(`Delete employee belum tersedia di backend v3.`)
}

export function findEmployeeById(employeeId) {
  return employeeItems.value.find((item) => item.employee_id === employeeId) ?? null
}
