import { loadAssets } from './assetStore'
import { loadCategories } from './categoryStore'
import { loadEmployees } from './employeeStore'
import { loadLoans } from './loanStore'
import { loadMaintenances } from './maintenanceStore'

const tryLoad = async (label, loader) => {
  try {
    return await loader()
  } catch (error) {
    console.error(`Gagal memuat ${label}:`, error)
    return []
  }
}

export async function hydrateAppData() {
  await Promise.all([
    tryLoad('data categories', loadCategories),
    tryLoad('data assets', loadAssets),
    tryLoad('data employees', loadEmployees),
    tryLoad('data loans', loadLoans),
  ])

  await tryLoad('data maintenances', loadMaintenances)
}
