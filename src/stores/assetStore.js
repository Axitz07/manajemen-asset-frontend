import { createPersistedCollection } from '../lib/persistedCollection'
import { assets as assetSeeds } from '../services/mockDatabase'
import { recordHistory } from './historyStore'

const assetCollection = createPersistedCollection('manajemen-asset:assets', assetSeeds)

export const assetItems = assetCollection.items

export function createAsset(payload) {
  const nextId = assetCollection.getNextId('asset_id')
  const assetCode = payload.asset_code?.trim() || `AST-${String(nextId).padStart(3, '0')}`

  const newItem = {
    asset_id: nextId,
    asset_code: assetCode,
    asset_name: payload.asset_name,
    category_id: Number(payload.category_id),
    purchase_year: Number(payload.purchase_year),
    condition: payload.condition,
    status: payload.status,
    qr_code: payload.qr_code?.trim() || `QR-${assetCode}`,
    asset_image: payload.asset_image || '',
    created_at: new Date().toISOString().slice(0, 10),
  }

  assetCollection.setItems([...assetItems.value, newItem])
  recordHistory(newItem.asset_id, '-', newItem.status, `${newItem.asset_name} berhasil ditambahkan ke inventory.`)
  return newItem
}

export function updateAsset(assetId, payload) {
  const targetId = Number(assetId)
  const currentItem = assetItems.value.find((item) => item.asset_id === targetId)

  assetCollection.setItems(
    assetItems.value.map((item) => {
      if (item.asset_id !== targetId) return item

      const assetCode = payload.asset_code?.trim() || item.asset_code

      return {
        ...item,
        asset_code: assetCode,
        asset_name: payload.asset_name,
        category_id: Number(payload.category_id),
        purchase_year: Number(payload.purchase_year),
        condition: payload.condition,
        status: payload.status,
        qr_code: payload.qr_code?.trim() || item.qr_code || `QR-${assetCode}`,
      }
    }),
  )

  if (currentItem && currentItem.status !== payload.status) {
    recordHistory(targetId, currentItem.status, payload.status, `${payload.asset_name} diperbarui secara manual.`)
  }
}

export function updateAssetStatus(assetId, status) {
  const targetId = Number(assetId)

  assetCollection.setItems(
    assetItems.value.map((item) =>
      item.asset_id === targetId
        ? {
            ...item,
            status,
          }
        : item,
    ),
  )
}

export function deleteAsset(assetId) {
  const targetId = Number(assetId)
  assetCollection.setItems(assetItems.value.filter((item) => item.asset_id !== targetId))
}

export function findAssetById(assetId) {
  return assetItems.value.find((item) => item.asset_id === Number(assetId)) ?? null
}
