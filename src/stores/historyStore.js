import { createPersistedCollection } from '../lib/persistedCollection'
import { histories as historySeeds } from '../services/mockDatabase'

const historyCollection = createPersistedCollection('manajemen-asset:histories', historySeeds)

export const historyItems = historyCollection.items

export function recordHistory(assetId, oldStatus, newStatus, note) {
  const timestamp = new Date()
  const changedAt = `${timestamp.toISOString().slice(0, 10)} ${timestamp.toTimeString().slice(0, 5)}`

  const newEntry = {
    history_id: historyCollection.getNextId('history_id'),
    asset_id: Number(assetId),
    old_status: oldStatus,
    new_status: newStatus,
    note,
    changed_at: changedAt,
  }

  historyCollection.setItems([newEntry, ...historyItems.value])
  return newEntry
}
