import { ref } from 'vue'
import { apiRequest } from '../lib/api'

export const categoryItems = ref([])

const normalizeCategory = (item) => ({
  category_id: item.id,
  category_name: item.name,
  created_at: item.created_at,
  updated_at: item.updated_at,
})

const uniqueByCategoryId = (items) => {
  const map = new Map()

  items.forEach((item) => {
    if (item?.category_id) {
      map.set(item.category_id, item)
    }
  })

  return [...map.values()]
}

export async function loadCategories() {
  const response = await apiRequest('categories?limit=1000&offset=0')
  categoryItems.value = uniqueByCategoryId((response.data || []).map(normalizeCategory))
  return categoryItems.value
}

export async function createCategory(payload) {
  const response = await apiRequest('categories', {
    method: 'POST',
    body: JSON.stringify({
      name: payload.category_name,
    }),
  })

  const newItem = normalizeCategory(response.data || {})
  categoryItems.value = uniqueByCategoryId([...categoryItems.value, newItem])
  return newItem
}

export async function updateCategory(categoryId, payload) {
  const response = await apiRequest(`categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: payload.category_name,
    }),
  })

  const updatedItem = normalizeCategory(response.data || {})
  categoryItems.value = uniqueByCategoryId(
    categoryItems.value.map((item) => (item.category_id === categoryId ? { ...item, ...updatedItem } : item)),
  )

  return updatedItem
}

export async function deleteCategory(categoryId) {
  await apiRequest(`categories/${categoryId}`, { method: 'DELETE' })
  categoryItems.value = categoryItems.value.filter((item) => item.category_id !== categoryId)
}

export function findCategoryById(categoryId) {
  return categoryItems.value.find((item) => item.category_id === categoryId) ?? null
}
