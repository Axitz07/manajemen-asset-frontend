import { ref } from 'vue'
import { apiRequest } from '../lib/api'
import { loadAssets } from './assetStore'
import { loadHistories } from './historyStore'

export const loanItems = ref([])

export async function loadLoans() {
  const response = await apiRequest('loans?limit=1000')
  loanItems.value = response.data || []
  return loanItems.value
}

export async function createLoan(payload) {
  await apiRequest('loans/borrow', {
    method: 'POST',
    body: JSON.stringify({
      asset_id: Number(payload.asset_id),
      employee_id: Number(payload.employee_id),
      loan_date: payload.loan_date || '',
    }),
  })

  await Promise.all([loadLoans(), loadAssets(), loadHistories()])
  return loanItems.value[0] ?? null
}

export async function returnLoan(loanId) {
  const loan = findLoanById(loanId)
  if (!loan) {
    throw new Error('Data peminjaman tidak ditemukan.')
  }

  await apiRequest(`loans/return/${loan.asset_id}`, {
    method: 'POST',
  })

  await Promise.all([loadLoans(), loadAssets(), loadHistories()])
  return findLoanById(loanId)
}

export async function deleteLoan(loanId) {
  await apiRequest(`loans/${loanId}`, { method: 'DELETE' })
  await Promise.all([loadLoans(), loadAssets(), loadHistories()])
}

export function findLoanById(loanId) {
  return loanItems.value.find((item) => item.loan_id === Number(loanId)) ?? null
}
