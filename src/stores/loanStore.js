import { ref } from 'vue'
import { apiRequest } from '../lib/api'
import { assetItems, findAssetById, loadAssets } from './assetStore'

export const loanItems = ref([])
export const loanLoadError = ref('')

const toDateOnly = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 10)
  }

  return date.toISOString().slice(0, 10)
}

const toIsoDate = (value) => {
  if (!value) return new Date().toISOString()

  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    return new Date(`${value}T00:00:00`).toISOString()
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString()
  }

  return parsed.toISOString()
}

const normalizeLoan = (item) => {
  return {
    loan_id: item.id,
    asset_id: item.asset_id || item.asset?.id || '',
    employee_id: item.employee_id || item.employee?.id || '',
    loan_date: toDateOnly(item.loan_date),
    return_date: toDateOnly(item.return_date),
    status: item.status === 'returned' ? 'Returned' : 'Borrowed',
    asset: item.asset || null,
    employee: item.employee || null,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }
}

const uniqueByLoanId = (items) => {
  const map = new Map()

  items.forEach((item) => {
    if (item?.loan_id) {
      map.set(item.loan_id, item)
    }
  })

  return [...map.values()]
}

export async function loadLoans() {
  loanLoadError.value = ''

  try {
    const response = await apiRequest('loans?limit=1000&offset=0')
    loanItems.value = uniqueByLoanId((response.data || []).map(normalizeLoan))
    return loanItems.value
  } catch (error) {
    loanLoadError.value = error.message
    throw error
  }
}

export async function createLoan(payload) {
  const assets = assetItems.value.length ? assetItems.value : await loadAssets()
  const selectedAsset = assets.find((item) => item.asset_id === payload.asset_id) ?? findAssetById(payload.asset_id)

  if (!selectedAsset?.asset_id) {
    throw new Error('Asset yang dipilih tidak valid atau belum sinkron dengan data backend.')
  }

  let response
  try {
    response = await apiRequest('loans', {
      method: 'POST',
      body: JSON.stringify({
        asset_id: selectedAsset.asset_id,
        employee_id: payload.employee_id,
        loan_date: toIsoDate(payload.loan_date),
        status: 'borrowed',
      }),
    })
  } catch (error) {
    if (String(error.message || '').includes('fk_asset_loans_asset') || String(error.message || '').includes('Error 1452')) {
      throw new Error(
        `Loan gagal disimpan karena asset backend tidak menemukan id "${selectedAsset.asset_id}" untuk asset ${selectedAsset.asset_code}. Coba refresh data asset dan pastikan asset tersebut benar-benar ada di database backend.`,
      )
    }

    throw error
  }

  const newItem = normalizeLoan({
    ...(response.data || {}),
    asset_id: response.data?.asset_id || selectedAsset.asset_id,
    employee_id: response.data?.employee_id || payload.employee_id,
  })
  loanItems.value = uniqueByLoanId([newItem, ...loanItems.value])
  await loadAssets()
  await loadLoans().catch(() => null)
  return newItem
}

export async function returnLoan(loanId) {
  const loan = findLoanById(loanId)
  if (!loan) {
    throw new Error('Data peminjaman tidak ditemukan.')
  }

  const normalizedLoanDate = toIsoDate(loan.loan_date)
  const normalizedAssetId = loan.asset_id || loan.asset?.id || ''

  if (!normalizedAssetId) {
    throw new Error('Asset untuk transaksi loan ini tidak ditemukan. Coba refresh data loan terlebih dahulu.')
  }

  try {
    await apiRequest(`loans/${loan.loan_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        asset_id: normalizedAssetId,
        employee_id: loan.employee_id,
        loan_date: normalizedLoanDate,
        return_date: new Date().toISOString(),
        status: 'returned',
      }),
    })
  } catch (error) {
    if (String(error.message || '').includes('fk_asset_loans_asset') || String(error.message || '').includes('Error 1452')) {
      throw new Error(
        `Return gagal karena backend tidak menemukan asset id "${normalizedAssetId}" yang terkait dengan transaksi ini. Refresh data loan terlebih dahulu atau cek apakah asset tersebut masih ada di database backend.`,
      )
    }

    throw error
  }

  await loadAssets()
  await loadLoans().catch(() => null)
  return findLoanById(loanId)
}

export async function deleteLoan(loanId) {
  throw new Error(`Delete loan belum didukung oleh backend terbaru.`)
}

export function findLoanById(loanId) {
  return loanItems.value.find((item) => item.loan_id === loanId) ?? null
}
