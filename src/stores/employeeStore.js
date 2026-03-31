import { createPersistedCollection } from '../lib/persistedCollection'
import { employees as employeeSeeds } from '../services/mockDatabase'

const employeeCollection = createPersistedCollection('manajemen-asset:employees', employeeSeeds)

export const employeeItems = employeeCollection.items

export function createEmployee(payload) {
  const newItem = {
    employee_id: employeeCollection.getNextId('employee_id'),
    employee_name: payload.employee_name,
    email: payload.email,
    phone: payload.phone,
    created_at: new Date().toISOString().slice(0, 10),
  }

  employeeCollection.setItems([...employeeItems.value, newItem])
  return newItem
}

export function updateEmployee(employeeId, payload) {
  const targetId = Number(employeeId)

  employeeCollection.setItems(
    employeeItems.value.map((item) =>
      item.employee_id === targetId
        ? {
            ...item,
            employee_name: payload.employee_name,
            email: payload.email,
            phone: payload.phone,
          }
        : item,
    ),
  )
}

export function deleteEmployee(employeeId) {
  const targetId = Number(employeeId)
  employeeCollection.setItems(employeeItems.value.filter((item) => item.employee_id !== targetId))
}

export function findEmployeeById(employeeId) {
  return employeeItems.value.find((item) => item.employee_id === Number(employeeId)) ?? null
}
