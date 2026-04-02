import { ref } from 'vue'
import { apiRequest } from '../lib/api'

export const employeeItems = ref([])

export async function loadEmployees() {
  const response = await apiRequest('employees?limit=1000')
  employeeItems.value = response.data || []
  return employeeItems.value
}

export async function createEmployee(payload) {
  const newItem = await apiRequest('employees', {
    method: 'POST',
    body: JSON.stringify({
      employee_name: payload.employee_name,
      email: payload.email,
      phone: payload.phone,
    }),
  })

  employeeItems.value = [...employeeItems.value, newItem]
  return newItem
}

export async function updateEmployee(employeeId, payload) {
  const updatedItem = await apiRequest(`employees/${employeeId}`, {
    method: 'PUT',
    body: JSON.stringify({
      employee_name: payload.employee_name,
      email: payload.email,
      phone: payload.phone,
    }),
  })

  employeeItems.value = employeeItems.value.map((item) =>
    item.employee_id === Number(employeeId) ? { ...item, ...updatedItem } : item,
  )

  return updatedItem
}

export async function deleteEmployee(employeeId) {
  await apiRequest(`employees/${employeeId}`, { method: 'DELETE' })
  employeeItems.value = employeeItems.value.filter((item) => item.employee_id !== Number(employeeId))
}

export function findEmployeeById(employeeId) {
  return employeeItems.value.find((item) => item.employee_id === Number(employeeId)) ?? null
}
