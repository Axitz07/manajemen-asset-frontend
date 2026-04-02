import { ref } from 'vue'
import { apiRequest } from '../lib/api'

export const categoryItems = ref([])

export async function loadCategories() {
  const response = await apiRequest('categories?limit=1000')
  categoryItems.value = response.data || []
  return categoryItems.value
}

export async function createCategory(payload) {
  const newItem = await apiRequest('categories', {
    method: 'POST',
    body: JSON.stringify({
      category_name: payload.category_name,
    }),
  })

  categoryItems.value = [...categoryItems.value, newItem]
  return newItem
}

export async function updateCategory(categoryId, payload) {
  const updatedItem = await apiRequest(`categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify({
      category_name: payload.category_name,
    }),
  })

  categoryItems.value = categoryItems.value.map((item) =>
    item.category_id === Number(categoryId) ? { ...item, ...updatedItem } : item,
  )

  return updatedItem
}

export async function deleteCategory(categoryId) {
  await apiRequest(`categories/${categoryId}`, { method: 'DELETE' })
  categoryItems.value = categoryItems.value.filter((item) => item.category_id !== Number(categoryId))
}

export function findCategoryById(categoryId) {
  return categoryItems.value.find((item) => item.category_id === Number(categoryId)) ?? null
}
