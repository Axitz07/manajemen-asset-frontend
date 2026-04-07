import { ref } from 'vue'

export const historyItems = ref([])

export async function loadHistories() {
  historyItems.value = []
  return historyItems.value
}

export async function recordHistory() {
  return null
}
