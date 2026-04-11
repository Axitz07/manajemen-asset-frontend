import { ref } from 'vue'
import { apiRequest } from '../lib/api'
import { assetItems, loadAssets } from './assetStore'

export const maintenanceItems = ref([])

const toDateOnly = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10)
  }

  return date.toISOString().slice(0, 10)
}

const normalizeMaintenance = (item) => ({
  maintenance_id: item.id,
  asset_id: item.asset_id,
  issue_description: item.issue_description,
  maintenance_status:
    item.maintenance_status === 'progress'
      ? 'Progress'
      : item.maintenance_status === 'done'
        ? 'Done'
        : 'Pending',
  raw_status: item.maintenance_status,
  maintenance_date: toDateOnly(item.start_date),
  end_date: toDateOnly(item.end_date),
  created_at: item.created_at,
  updated_at: item.updated_at,
  asset: item.asset || null,
})

export async function loadMaintenances() {
  if (!assetItems.value.length) {
    await loadAssets()
  }

  const response = await apiRequest('maintenances?limit=1000&offset=0')
  maintenanceItems.value = uniqueByMaintenanceId((response.data || []).map(normalizeMaintenance))
  return maintenanceItems.value
}

const uniqueByMaintenanceId = (items) => {
  const map = new Map()

  items.forEach((item) => {
    if (item?.maintenance_id) {
      map.set(item.maintenance_id, item)
    }
  })

  return [...map.values()]
}

export async function createMaintenance(payload) {
  const response = await apiRequest('maintenances', {
    method: 'POST',
    body: JSON.stringify({
      asset_id: payload.asset_id,
      issue_description: payload.issue_description,
      maintenance_status:
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
      issue_description: payload.issue_description,
      maintenance_status:
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
