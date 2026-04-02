import { ref } from 'vue'
import { apiRequest } from '../lib/api'
import { loadAssets } from './assetStore'
import { loadHistories } from './historyStore'

export const maintenanceItems = ref([])

export async function loadMaintenances() {
  const response = await apiRequest('maintenances?limit=1000')
  maintenanceItems.value = response.data || []
  return maintenanceItems.value
}

export async function createMaintenance(payload) {
  const newItem = await apiRequest('maintenances', {
    method: 'POST',
    body: JSON.stringify({
      asset_id: Number(payload.asset_id),
      issue_description: payload.issue_description,
      maintenance_date: payload.maintenance_date,
      maintenance_status: payload.maintenance_status,
    }),
  })

  await Promise.all([loadMaintenances(), loadAssets(), loadHistories()])
  return newItem
}

export async function updateMaintenance(maintenanceId, payload) {
  const updatedItem = await apiRequest(`maintenances/${maintenanceId}`, {
    method: 'PUT',
    body: JSON.stringify({
      asset_id: Number(payload.asset_id),
      issue_description: payload.issue_description,
      maintenance_date: payload.maintenance_date,
      maintenance_status: payload.maintenance_status,
    }),
  })

  await Promise.all([loadMaintenances(), loadAssets(), loadHistories()])
  return updatedItem
}

export async function deleteMaintenance(maintenanceId) {
  await apiRequest(`maintenances/${maintenanceId}`, { method: 'DELETE' })
  await Promise.all([loadMaintenances(), loadAssets(), loadHistories()])
}

export function findMaintenanceById(maintenanceId) {
  return maintenanceItems.value.find((item) => item.maintenance_id === Number(maintenanceId)) ?? null
}
