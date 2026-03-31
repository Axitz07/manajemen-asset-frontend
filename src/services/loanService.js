import { assetItems } from '../stores/assetStore'
import { employeeItems } from '../stores/employeeStore'
import { loanItems } from '../stores/loanStore'

export function getLoans() {
  return loanItems.value.map((item) => ({
    ...item,
    asset_name: assetItems.value.find((asset) => asset.asset_id === item.asset_id)?.asset_name ?? '-',
    asset_code: assetItems.value.find((asset) => asset.asset_id === item.asset_id)?.asset_code ?? '-',
    employee_name: employeeItems.value.find((employee) => employee.employee_id === item.employee_id)?.employee_name ?? '-',
  }))
}
