import { createPersistedCollection } from '../lib/persistedCollection'
import { loans as loanSeeds } from '../services/mockDatabase'
import { findAssetById, updateAssetStatus } from './assetStore'
import { recordHistory } from './historyStore'
import { findEmployeeById } from './employeeStore'

const loanCollection = createPersistedCollection('manajemen-asset:loans', loanSeeds)

export const loanItems = loanCollection.items

const today = () => new Date().toISOString().slice(0, 10)

export function createLoan(payload) {
  const asset = findAssetById(payload.asset_id)
  const employee = findEmployeeById(payload.employee_id)

  if (!asset) {
    throw new Error('Asset tidak ditemukan.')
  }

  if (!employee) {
    throw new Error('Employee tidak ditemukan.')
  }

  if (asset.status !== 'Available') {
    throw new Error('Asset belum tersedia untuk dipinjam.')
  }

  const newLoan = {
    loan_id: loanCollection.getNextId('loan_id'),
    asset_id: Number(payload.asset_id),
    employee_id: Number(payload.employee_id),
    loan_date: payload.loan_date || today(),
    return_date: null,
    status: 'Borrowed',
    note: payload.note || '',
    created_at: today(),
  }

  loanCollection.setItems([...loanItems.value, newLoan])
  updateAssetStatus(asset.asset_id, 'In Use')
  recordHistory(asset.asset_id, asset.status, 'In Use', `${asset.asset_name} dipinjam oleh ${employee.employee_name}`)

  return newLoan
}

export function returnLoan(loanId) {
  const targetId = Number(loanId)
  const loan = loanItems.value.find((item) => item.loan_id === targetId)

  if (!loan) {
    throw new Error('Data peminjaman tidak ditemukan.')
  }

  if (loan.status === 'Returned') {
    return loan
  }

  const asset = findAssetById(loan.asset_id)
  const employee = findEmployeeById(loan.employee_id)

  loanCollection.setItems(
    loanItems.value.map((item) =>
      item.loan_id === targetId
        ? {
            ...item,
            status: 'Returned',
            return_date: today(),
          }
        : item,
    ),
  )

  if (asset) {
    updateAssetStatus(asset.asset_id, 'Available')
    recordHistory(
      asset.asset_id,
      asset.status,
      'Available',
      `${asset.asset_name} dikembalikan oleh ${employee?.employee_name || 'employee'}`,
    )
  }

  return loan
}

export function deleteLoan(loanId) {
  const targetId = Number(loanId)
  const loan = loanItems.value.find((item) => item.loan_id === targetId)

  if (!loan) {
    throw new Error('Data peminjaman tidak ditemukan.')
  }

  const asset = findAssetById(loan.asset_id)
  const employee = findEmployeeById(loan.employee_id)

  if (loan.status === 'Borrowed' && asset) {
    updateAssetStatus(asset.asset_id, 'Available')
    recordHistory(
      asset.asset_id,
      asset.status,
      'Available',
      `${asset.asset_name} dibatalkan dari transaksi pinjam ${employee?.employee_name || 'employee'}`,
    )
  }

  loanCollection.setItems(loanItems.value.filter((item) => item.loan_id !== targetId))
}

export function findLoanById(loanId) {
  return loanItems.value.find((item) => item.loan_id === Number(loanId)) ?? null
}
