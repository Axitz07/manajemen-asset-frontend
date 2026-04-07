import { assetItems } from '../stores/assetStore'
import { loanItems } from '../stores/loanStore'
import { maintenanceItems } from '../stores/maintenanceStore'
import { getAssetHistories } from './historyService'
import { getAssets } from './assetService'

export function getDashboardSummary() {
  const assets = getAssets()
  const available = assets.filter((item) => item.status === 'Available').length
  const borrowed = assets.filter((item) => item.status === 'Borrowed').length
  const maintenance = assets.filter((item) => item.status === 'Maintenance').length
  const activeLoans = loanItems.value.filter((item) => item.status === 'Borrowed').length
  const repairOpen = maintenanceItems.value.filter((item) => item.maintenance_status !== 'Done').length

  return [
    {
      title: 'Total Asset',
      value: String(assetItems.value.length),
      note: `${available} tersedia untuk dipinjam`,
      tone: 'success',
    },
    {
      title: 'Borrowed',
      value: String(borrowed),
      note: `${activeLoans} transaksi pinjam masih aktif`,
      tone: 'warning',
    },
    {
      title: 'Maintenance',
      value: String(maintenance),
      note: `${repairOpen} tiket perbaikan masih berjalan`,
      tone: 'danger',
    },
  ]
}

export function getDashboardStatusStats() {
  const assets = getAssets()
  return [
    { label: 'Available', value: assets.filter((item) => item.status === 'Available').length },
    { label: 'Borrowed', value: assets.filter((item) => item.status === 'Borrowed').length },
    { label: 'Maintenance', value: assets.filter((item) => item.status === 'Maintenance').length },
  ]
}

export function getRecentActivities(limit = 5) {
  return getAssetHistories().slice(0, limit).map((item) => item.note)
}
