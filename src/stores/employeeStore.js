import { ref } from 'vue'
import { apiRequest } from '../lib/api'

export const employeeItems = ref([])

const normalizeUser = (item) => ({
  employee_id: item.id,
  employee_name: item.name,
  email: item.email,
  role: item.role,
  created_at: item.created_at,
  updated_at: item.updated_at,
})

export async function loadEmployees() {
  const response = await apiRequest('users?limit=1000&offset=0')
  employeeItems.value = (response.data || []).map(normalizeUser)
  return employeeItems.value
}

export async function createEmployee(payload) {
  const response = await apiRequest('users', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.employee_name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    }),
  })

  const newItem = normalizeUser(response.data || {})
  employeeItems.value = [...employeeItems.value, newItem]
  return newItem
}

export async function updateEmployee(employeeId, payload) {
  const response = await apiRequest(`users/${employeeId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: payload.employee_name,
      email: payload.email,
      role: payload.role,
    }),
  })

  const updatedItem = normalizeUser(response.data || {})
  employeeItems.value = employeeItems.value.map((item) =>
    item.employee_id === employeeId ? { ...item, ...updatedItem } : item,
  )

  return updatedItem
}

export async function deleteEmployee(employeeId) {
  await apiRequest(`users/${employeeId}`, { method: 'DELETE' })
  employeeItems.value = employeeItems.value.filter((item) => item.employee_id !== employeeId)
}

export function findEmployeeById(employeeId) {
  return employeeItems.value.find((item) => item.employee_id === employeeId) ?? null
}
