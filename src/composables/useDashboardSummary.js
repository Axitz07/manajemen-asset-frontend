import { getDashboardSummary } from '../services/dashboardService'

export function useDashboardSummary() {
  return {
    summary: getDashboardSummary(),
  }
}
