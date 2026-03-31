import { createPersistedCollection } from '../lib/persistedCollection'
import { maintenances as maintenanceSeeds } from '../services/mockDatabase'
import { findAssetById, updateAssetStatus } from './assetStore'
import { recordHistory } from './historyStore'

const maintenanceCollection = createPersistedCollection('manajemen-asset:maintenances', maintenanceSeeds)

export const maintenanceItems = maintenanceCollection.items

const today = () => new Date().toISOString().slice(0, 10)

const syncAssetFromMaintenanceStatus = (asset, maintenanceStatus, issueDescription) => {
  if (!asset) return

  if (maintenanceStatus === 'Done') {
    updateAssetStatus(asset.asset_id, 'Available')
    recordHistory(
      asset.asset_id,
      asset.status,
      'Available',
      `${asset.asset_name} selesai maintenance. ${issueDescription}`.trim(),
    )
    return
  }

  updateAssetStatus(asset.asset_id, 'Maintenance')
  recordHistory(
    asset.asset_id,
    asset.status,
    'Maintenance',
    `${asset.asset_name} masuk maintenance. ${issueDescription}`.trim(),
  )
}

export function createMaintenance(payload) {
  const asset = findAssetById(payload.asset_id)

  if (!asset) {
    throw new Error('Asset tidak ditemukan.')
  }

  const newItem = {
    maintenance_id: maintenanceCollection.getNextId('maintenance_id'),
    asset_id: Number(payload.asset_id),
    issue_description: payload.issue_description?.trim() || 'Issue maintenance',
    maintenance_date: payload.maintenance_date || today(),
    maintenance_status: payload.maintenance_status || 'Repairing',
    created_at: today(),
  }

  maintenanceCollection.setItems([newItem, ...maintenanceItems.value])
  syncAssetFromMaintenanceStatus(asset, newItem.maintenance_status, newItem.issue_description)
  return newItem
}

export function updateMaintenance(maintenanceId, payload) {
  const targetId = Number(maintenanceId)
  const currentItem = maintenanceItems.value.find((item) => item.maintenance_id === targetId)

  if (!currentItem) {
    throw new Error('Data maintenance tidak ditemukan.')
  }

  const nextItem = {
    ...currentItem,
    issue_description: payload.issue_description?.trim() || currentItem.issue_description,
    maintenance_date: payload.maintenance_date || currentItem.maintenance_date,
    maintenance_status: payload.maintenance_status || currentItem.maintenance_status,
  }

  maintenanceCollection.setItems(
    maintenanceItems.value.map((item) => (item.maintenance_id === targetId ? nextItem : item)),
  )

  if (nextItem.maintenance_status !== currentItem.maintenance_status) {
    const asset = findAssetById(nextItem.asset_id)
    syncAssetFromMaintenanceStatus(asset, nextItem.maintenance_status, nextItem.issue_description)
  }

  return nextItem
}

export function deleteMaintenance(maintenanceId) {
  const targetId = Number(maintenanceId)
  const currentItem = maintenanceItems.value.find((item) => item.maintenance_id === targetId)

  if (!currentItem) return

  maintenanceCollection.setItems(maintenanceItems.value.filter((item) => item.maintenance_id !== targetId))

  const asset = findAssetById(currentItem.asset_id)
  if (asset?.status === 'Maintenance') {
    updateAssetStatus(asset.asset_id, 'Available')
    recordHistory(asset.asset_id, 'Maintenance', 'Available', `${asset.asset_name} maintenance dibatalkan.`)
  }
}

export function findMaintenanceById(maintenanceId) {
  return maintenanceItems.value.find((item) => item.maintenance_id === Number(maintenanceId)) ?? null
}
