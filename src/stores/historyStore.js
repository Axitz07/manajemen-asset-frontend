import { ref } from 'vue'
import { apiRequest } from '../lib/api'

export const historyItems = ref([])

export async function loadHistories() {
  const response = await apiRequest('histories?limit=1000')
  historyItems.value = response.data || []
  return historyItems.value
}

export async function recordHistory() {
  return null
}
