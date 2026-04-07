import { loadAssets } from './assetStore'
import { loadCategories } from './categoryStore'
import { loadEmployees } from './employeeStore'
import { loadLoans } from './loanStore'
import { loadMaintenances } from './maintenanceStore'

export async function hydrateAppData() {
  await Promise.all([loadCategories(), loadAssets(), loadEmployees(), loadLoans()])
  await loadMaintenances()
}
