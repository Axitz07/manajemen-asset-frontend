import { assetItems } from '../stores/assetStore'
import { loanItems } from '../stores/loanStore'
import { maintenanceItems } from '../stores/maintenanceStore'
import { historyItems } from '../stores/historyStore'

export function getDashboardSummary() {
  const available = assetItems.value.filter((item) => item.status === 'Available').length
  const inUse = assetItems.value.filter((item) => item.status === 'In Use').length
  const maintenance = assetItems.value.filter((item) => item.status === 'Maintenance').length
  const activeLoans = loanItems.value.filter((item) => item.status === 'Borrowed').length
  const repairOpen = maintenanceItems.value.filter((item) => item.maintenance_status === 'Repairing').length

  return [
    {
      title: 'Total Asset',
      value: String(assetItems.value.length),
      note: `${available} tersedia untuk dipinjam`,
      tone: 'success',
    },
    {
      title: 'In Use',
      value: String(inUse),
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
  return [
    { label: 'Available', value: assetItems.value.filter((item) => item.status === 'Available').length },
    { label: 'In Use', value: assetItems.value.filter((item) => item.status === 'In Use').length },
    { label: 'Maintenance', value: assetItems.value.filter((item) => item.status === 'Maintenance').length },
  ]
}

export function getRecentActivities(limit = 5) {
  return historyItems.value.slice(0, limit).map((item) => item.note)
}
