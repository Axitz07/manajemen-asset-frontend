import { assetItems } from '../stores/assetStore'
import { historyItems } from '../stores/historyStore'

export function getAssetHistories() {
  return historyItems.value.map((item) => ({
    ...item,
    asset_name: assetItems.value.find((asset) => asset.asset_id === item.asset_id)?.asset_name ?? '-',
    asset_code: assetItems.value.find((asset) => asset.asset_id === item.asset_id)?.asset_code ?? '-',
  }))
}
