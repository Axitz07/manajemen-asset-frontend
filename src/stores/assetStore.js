import { ref } from 'vue'
import { apiRequest } from '../lib/api'

export const assetItems = ref([])

export async function loadAssets() {
  const response = await apiRequest('assets?limit=1000')
  assetItems.value = response.data || []
  return assetItems.value
}

export async function createAsset(payload) {
  const newItem = await apiRequest('assets', {
    method: 'POST',
    body: JSON.stringify({
      asset_code: payload.asset_code?.trim() || `AST-${Date.now()}`,
      asset_name: payload.asset_name,
      category_id: Number(payload.category_id),
      purchase_year: Number(payload.purchase_year),
      condition: payload.condition,
      status: payload.status,
      qr_code: payload.qr_code?.trim() || '',
      asset_image: payload.asset_image || '',
    }),
  })

  assetItems.value = [...assetItems.value, newItem]
  return newItem
}

export async function updateAsset(assetId, payload) {
  const updatedItem = await apiRequest(`assets/${assetId}`, {
    method: 'PUT',
    body: JSON.stringify({
      asset_code: payload.asset_code?.trim() || '',
      asset_name: payload.asset_name,
      category_id: Number(payload.category_id),
      purchase_year: Number(payload.purchase_year),
      condition: payload.condition,
      status: payload.status,
      qr_code: payload.qr_code?.trim() || '',
      asset_image: payload.asset_image || '',
    }),
  })

  assetItems.value = assetItems.value.map((item) =>
    item.asset_id === Number(assetId) ? { ...item, ...updatedItem } : item,
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
  assetItems.value = assetItems.value.filter((item) => item.asset_id !== Number(assetId))
}

export function findAssetById(assetId) {
  return assetItems.value.find((item) => item.asset_id === Number(assetId)) ?? null
}
