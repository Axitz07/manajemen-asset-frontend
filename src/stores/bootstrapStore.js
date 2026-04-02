import { loadAssets } from './assetStore'
import { loadCategories } from './categoryStore'
import { loadEmployees } from './employeeStore'
import { loadLoans } from './loanStore'
import { loadMaintenances } from './maintenanceStore'
import { loadHistories } from './historyStore'

export async function hydrateAppData() {
  await Promise.all([
    loadCategories(),
    loadAssets(),
    loadEmployees(),
    loadLoans(),
    loadMaintenances(),
    loadHistories(),
  ])
}
