import { ref } from 'vue'

const cloneItems = (items = []) => JSON.parse(JSON.stringify(items))

export function createPersistedCollection(storageKey, seedItems = []) {
  const readInitialValue = () => {
    if (typeof window === 'undefined') {
      return cloneItems(seedItems)
    }

    try {
      const savedValue = window.localStorage.getItem(storageKey)
      return savedValue ? JSON.parse(savedValue) : cloneItems(seedItems)
    } catch {
      return cloneItems(seedItems)
    }
  }

  const items = ref(readInitialValue())

  const persist = () => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, JSON.stringify(items.value))
  }

  const setItems = (nextItems) => {
    items.value = nextItems
    persist()
  }

  const reset = () => {
    items.value = cloneItems(seedItems)
    persist()
  }

  const getNextId = (fieldName) => {
    const lastValue = items.value.reduce((maxValue, item) => {
      const currentValue = Number(item[fieldName] || 0)
      return currentValue > maxValue ? currentValue : maxValue
    }, 0)

    return lastValue + 1
  }

  return {
    items,
    persist,
    reset,
    setItems,
    getNextId,
  }
}
