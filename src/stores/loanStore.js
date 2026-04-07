import { ref } from 'vue'
import { apiRequest } from '../lib/api'
import { assetItems, findAssetById, loadAssets } from './assetStore'

export const loanItems = ref([])

const normalizeLoan = (item) => ({
  loan_id: item.id,
  asset_id: item.asset_id || item.asset?.id || '',
  user_id: item.user_id || item.user?.id || '',
  loan_date: item.loan_date,
  return_date: item.return_date,
  status: item.status === 'returned' ? 'Returned' : 'Borrowed',
  asset: item.asset || null,
  user: item.user || null,
  created_at: item.created_at,
  updated_at: item.updated_at,
})

export async function loadLoans() {
  const response = await apiRequest('loans?limit=1000&offset=0')
  loanItems.value = (response.data || []).map(normalizeLoan)
  return loanItems.value
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
        user_id: payload.employee_id,
        loan_date: payload.loan_date ? new Date(`${payload.loan_date}T00:00:00`).toISOString() : new Date().toISOString(),
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
    user_id: response.data?.user_id || payload.employee_id,
  })
  loanItems.value = [newItem, ...loanItems.value]
  await Promise.all([loadAssets(), loadLoans()])
  return newItem
}

export async function returnLoan(loanId) {
  const loan = findLoanById(loanId)
  if (!loan) {
    throw new Error('Data peminjaman tidak ditemukan.')
  }

  const normalizedLoanDate = loan.loan_date
    ? new Date(loan.loan_date).toISOString()
    : new Date().toISOString()
  const normalizedAssetId = loan.asset_id || loan.asset?.id || ''

  if (!normalizedAssetId) {
    throw new Error('Asset untuk transaksi loan ini tidak ditemukan. Coba refresh data loan terlebih dahulu.')
  }

  try {
    await apiRequest(`loans/${loan.loan_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        asset_id: normalizedAssetId,
        user_id: loan.user_id,
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

  await Promise.all([loadLoans(), loadAssets()])
  return findLoanById(loanId)
}

export async function deleteLoan(loanId) {
  throw new Error(`Delete loan belum didukung oleh backend terbaru.`)
}

export function findLoanById(loanId) {
  return loanItems.value.find((item) => item.loan_id === loanId) ?? null
}
