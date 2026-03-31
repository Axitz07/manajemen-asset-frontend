import { assetItems } from '../stores/assetStore'
import { categoryItems } from '../stores/categoryStore'

export function getCategories() {
  return categoryItems.value.map((category) => ({
    ...category,
    total_assets: assetItems.value.filter((item) => item.category_id === category.category_id).length,
  }))
}
