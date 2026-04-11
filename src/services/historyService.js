import { getAssets } from './assetService'
import { getLoans } from './loanService'
import { getMaintenances } from './maintenanceService'

export function getAssetHistories() {
  const assetHistories = getAssets().flatMap((asset) =>
    (asset.asset_histories || []).map((history) => ({
      history_id: history.id,
      asset_id: history.asset_id || asset.asset_id,
      asset_name: asset.asset_name,
      asset_code: asset.asset_code,
      old_status: history.old_status === 'maintenance'
        ? 'Maintenance'
        : history.old_status === 'broken'
          ? 'Broken'
          : 'Available',
      new_status: history.new_status === 'maintenance'
        ? 'Maintenance'
        : history.new_status === 'broken'
          ? 'Broken'
          : 'Available',
      note: history.note || 'Asset history',
      changed_at: history.created_at,
    })),
  )

  const loanHistory = getLoans().map((item) => ({
    history_id: `loan-${item.loan_id}`,
    asset_id: item.asset_id,
    asset_name: item.asset_name,
    asset_code: item.asset_code,
    old_status: item.status === 'Returned' ? 'Borrowed' : 'Available',
    new_status: item.status === 'Returned' ? 'Available' : 'Borrowed',
    note:
      item.status === 'Returned'
        ? `${item.asset_name} dikembalikan oleh ${item.employee_name}`
        : `${item.asset_name} dipinjam oleh ${item.employee_name}`,
    changed_at: item.status === 'Returned' ? item.return_date || item.updated_at : item.loan_date,
  }))

  const maintenanceHistory = getMaintenances().map((item) => ({
    history_id: `maintenance-${item.maintenance_id}`,
    asset_id: item.asset_id,
    asset_name: item.asset_name,
    asset_code: item.asset_code,
    old_status: item.maintenance_status === 'Done' ? 'Maintenance' : 'Available',
    new_status: item.maintenance_status === 'Done' ? 'Available' : 'Maintenance',
    note: `${item.asset_name} maintenance: ${item.issue_description}`,
    changed_at: item.end_date || item.maintenance_date || item.created_at,
  }))

  return [...assetHistories, ...loanHistory, ...maintenanceHistory].sort(
    (a, b) => new Date(b.changed_at || 0).getTime() - new Date(a.changed_at || 0).getTime(),
  )
}
