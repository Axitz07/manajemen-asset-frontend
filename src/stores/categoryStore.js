import { createPersistedCollection } from '../lib/persistedCollection'
import { categories as categorySeeds } from '../services/mockDatabase'

const categoryCollection = createPersistedCollection('manajemen-asset:categories', categorySeeds)

export const categoryItems = categoryCollection.items

export function createCategory(payload) {
  const newItem = {
    category_id: categoryCollection.getNextId('category_id'),
    category_name: payload.category_name,
    created_at: new Date().toISOString().slice(0, 10),
  }

  categoryCollection.setItems([...categoryItems.value, newItem])
  return newItem
}

export function updateCategory(categoryId, payload) {
  const targetId = Number(categoryId)

  categoryCollection.setItems(
    categoryItems.value.map((item) =>
      item.category_id === targetId
        ? {
            ...item,
            category_name: payload.category_name,
          }
        : item,
    ),
  )
}

export function deleteCategory(categoryId) {
  const targetId = Number(categoryId)
  categoryCollection.setItems(categoryItems.value.filter((item) => item.category_id !== targetId))
}

export function findCategoryById(categoryId) {
  return categoryItems.value.find((item) => item.category_id === Number(categoryId)) ?? null
}
