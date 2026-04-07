import { employeeItems } from '../stores/employeeStore'
import { loanItems } from '../stores/loanStore'

export function getEmployees() {
  return employeeItems.value.map((employee) => {
    const employeeLoans = loanItems.value.filter((item) => item.user_id === employee.employee_id)

    return {
      ...employee,
      total_loans: employeeLoans.length,
      active_loans: employeeLoans.filter((item) => item.status === 'Borrowed').length,
    }
  })
}
