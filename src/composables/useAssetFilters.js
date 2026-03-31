export function useAssetFilters(items = []) {
  return {
    items,
    search(keyword = '') {
      return items.filter((item) =>
        item.asset_name?.toLowerCase().includes(keyword.toLowerCase()),
      )
    },
  }
}
