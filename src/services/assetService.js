import { categoryItems } from '../stores/categoryStore'
import { assetItems } from '../stores/assetStore'
import { employeeItems } from '../stores/employeeStore'
import { loanItems } from '../stores/loanStore'

export function getAssets() {
  return assetItems.value.map((item) => ({
    ...item,
    category_name:
      categoryItems.value.find((category) => category.category_id === item.category_id)?.category_name ?? '-',
    assigned_employee_name:
      employeeItems.value.find(
        (employee) =>
          employee.employee_id ===
          loanItems.value.find((loan) => loan.asset_id === item.asset_id && loan.status === 'Borrowed')?.employee_id,
      )?.employee_name ?? '-',
  }))
}
