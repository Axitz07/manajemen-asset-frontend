import { categoryItems } from '../stores/categoryStore'
import { assetItems } from '../stores/assetStore'
import { employeeItems } from '../stores/employeeStore'
import { loanItems } from '../stores/loanStore'

export function getAssets() {
  return assetItems.value.map((item) => ({
    ...item,
    asset_history: item.asset_history ?? '',
    asset_histories: item.asset_histories ?? [],
    category_name: item.category?.name
      ?? categoryItems.value.find((category) => category.category_id === item.category_id)?.category_name
      ?? '-',
    status:
      item.raw_status === 'maintenance'
        ? 'Maintenance'
        : item.raw_status === 'broken'
          ? 'Broken'
          : loanItems.value.find((loan) => loan.asset_id === item.asset_id && loan.status === 'Borrowed')
            ? 'Borrowed'
            : 'Available',
    assigned_employee_name:
      employeeItems.value.find(
        (employee) =>
          employee.employee_id ===
          loanItems.value.find((loan) => loan.asset_id === item.asset_id && loan.status === 'Borrowed')?.employee_id,
      )?.employee_name ?? '-',
  }))
}
