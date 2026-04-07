import { ref } from 'vue'
import { apiRequest } from '../lib/api'
import { assetItems, loadAssets } from './assetStore'
import { currentUser } from './authStore'

export const maintenanceItems = ref([])

const normalizeMaintenance = (item) => ({
  maintenance_id: item.id,
  asset_id: item.asset_id,
  reported_by: item.reported_by,
  issue_description: item.description,
  maintenance_status:
    item.status === 'progress' ? 'Progress' : item.status === 'done' ? 'Done' : 'Pending',
  raw_status: item.status,
  maintenance_date: item.start_date,
  end_date: item.end_date,
  created_at: item.created_at,
  updated_at: item.updated_at,
  asset: item.asset || null,
  user: item.user || null,
})

export async function loadMaintenances() {
  const assets = assetItems.value.length ? assetItems.value : await loadAssets()
  const requests = assets.map((asset) =>
    apiRequest(`maintenances?asset_id=${asset.asset_id}&limit=1000&offset=0`).catch(() => ({ data: [] })),
  )
  const responses = await Promise.all(requests)
  maintenanceItems.value = responses.flatMap((response) => (response.data || []).map(normalizeMaintenance))
  return maintenanceItems.value
}

export async function createMaintenance(payload) {
  const response = await apiRequest('maintenances', {
    method: 'POST',
    body: JSON.stringify({
      asset_id: payload.asset_id,
      reported_by: currentUser.value?.id || '',
      description: payload.issue_description,
      status:
        payload.maintenance_status === 'Done'
          ? 'done'
          : payload.maintenance_status === 'Progress'
            ? 'progress'
            : 'pending',
      start_date: payload.maintenance_date
        ? new Date(`${payload.maintenance_date}T00:00:00`).toISOString()
        : null,
    }),
  })

  const newItem = normalizeMaintenance(response.data || {})
  maintenanceItems.value = [newItem, ...maintenanceItems.value]
  await loadAssets()
  return newItem
}

export async function updateMaintenance(maintenanceId, payload) {
  const response = await apiRequest(`maintenances/${maintenanceId}`, {
    method: 'PUT',
    body: JSON.stringify({
      asset_id: payload.asset_id,
      reported_by: payload.reported_by,
      description: payload.issue_description,
      status:
        payload.maintenance_status === 'Done'
          ? 'done'
          : payload.maintenance_status === 'Progress'
            ? 'progress'
            : 'pending',
      start_date: payload.maintenance_date
        ? new Date(`${payload.maintenance_date}T00:00:00`).toISOString()
        : null,
      end_date:
        payload.maintenance_status === 'Done'
          ? new Date().toISOString()
          : payload.end_date || null,
    }),
  })

  const updatedItem = normalizeMaintenance(response.data || {})
  maintenanceItems.value = maintenanceItems.value.map((item) =>
    item.maintenance_id === maintenanceId ? { ...item, ...updatedItem } : item,
  )
  await loadAssets()
  return updatedItem
}

export async function deleteMaintenance(maintenanceId) {
  throw new Error(`Delete maintenance tidak tersedia di backend terbaru.`)
}

export function findMaintenanceById(maintenanceId) {
  return maintenanceItems.value.find((item) => item.maintenance_id === maintenanceId) ?? null
}
