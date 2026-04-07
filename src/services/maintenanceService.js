import { assetItems } from '../stores/assetStore'
import { maintenanceItems } from '../stores/maintenanceStore'

export function getMaintenances() {
  return maintenanceItems.value.map((item) => ({
    ...item,
    asset_name: item.asset?.name ?? assetItems.value.find((asset) => asset.asset_id === item.asset_id)?.asset_name ?? '-',
    asset_code: item.asset?.asset_code ?? assetItems.value.find((asset) => asset.asset_id === item.asset_id)?.asset_code ?? '-',
  }))
}
