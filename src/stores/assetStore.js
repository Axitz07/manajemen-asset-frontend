import { ref } from 'vue'
import { apiRequest } from '../lib/api'

export const assetItems = ref([])

const assetStatusToApi = {
  Available: 'available',
  Broken: 'broken',
  Maintenance: 'maintenance',
}

const assetStatusFromApi = {
  available: 'Available',
  broken: 'Broken',
  maintenance: 'Maintenance',
}

const conditionToApi = {
  Good: 'good',
  Fair: 'fair',
  Poor: 'poor',
}

const conditionFromApi = {
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
}

const normalizeAsset = (item) => ({
  asset_id: item.id,
  asset_code: item.asset_code,
  asset_name: item.name,
  category_id: item.category_id,
  status: assetStatusFromApi[item.status] || item.status,
  raw_status: item.status,
  condition: conditionFromApi[item.condition] || item.condition,
  created_at: item.created_at,
  updated_at: item.updated_at,
  category: item.category || null,
  maintenances: item.maintenances || [],
  qr_code: item.qr_code || item.asset_code,
  purchase_year: null,
  asset_image: '',
})

const uniqueByAssetId = (items) => {
  const map = new Map()

  items.forEach((item) => {
    if (item?.asset_id) {
      map.set(item.asset_id, item)
    }
  })

  return [...map.values()]
}

export async function loadAssets() {
  const response = await apiRequest('assets?limit=1000&offset=0')
  assetItems.value = uniqueByAssetId((response.data || []).map(normalizeAsset))
  return assetItems.value
}

export async function createAsset(payload) {
  const response = await apiRequest('assets', {
    method: 'POST',
    body: JSON.stringify({
      asset_code: payload.asset_code?.trim() || `AST-${Date.now()}`,
      name: payload.asset_name,
      category_id: payload.category_id,
      condition: conditionToApi[payload.condition] || String(payload.condition || '').toLowerCase(),
      status: assetStatusToApi[payload.status] || String(payload.status || '').toLowerCase(),
      qr_code: payload.qr_code?.trim() || payload.asset_code?.trim() || `QR-${Date.now()}`,
    }),
  })

  const newItem = normalizeAsset(response.data || {})
  assetItems.value = uniqueByAssetId([...assetItems.value, newItem])
  return newItem
}

export async function updateAsset(assetId, payload) {
  const response = await apiRequest(`assets/${assetId}`, {
    method: 'PUT',
    body: JSON.stringify({
      asset_code: payload.asset_code?.trim() || '',
      name: payload.asset_name,
      category_id: payload.category_id,
      condition: conditionToApi[payload.condition] || String(payload.condition || '').toLowerCase(),
      status: assetStatusToApi[payload.status] || String(payload.status || '').toLowerCase(),
      qr_code: payload.qr_code?.trim() || payload.asset_code?.trim() || '',
    }),
  })

  const updatedItem = normalizeAsset(response.data || {})
  assetItems.value = uniqueByAssetId(
    assetItems.value.map((item) => (item.asset_id === assetId ? { ...item, ...updatedItem } : item)),
  )

  return updatedItem
}

export async function updateAssetStatus(assetId, status) {
  const asset = findAssetById(assetId)
  if (!asset) return null

  return updateAsset(assetId, {
    ...asset,
    status,
  })
}

export async function deleteAsset(assetId) {
  await apiRequest(`assets/${assetId}`, { method: 'DELETE' })
  assetItems.value = assetItems.value.filter((item) => item.asset_id !== assetId)
}

export function findAssetById(assetId) {
  return assetItems.value.find((item) => item.asset_id === assetId) ?? null
}
