import { createRouter, createWebHistory } from 'vue-router'
import { appConfig } from '../lib/env'
import { hydrateAppData } from '../stores/bootstrapStore'
import { currentUser, getDefaultRouteByRole, isAuthenticated } from '../stores/authStore'
import LoginView from '../views/auth/LoginView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import AssetListView from '../views/assets/AssetListView.vue'
import AssetCreateView from '../views/assets/AssetCreateView.vue'
import AssetEditView from '../views/assets/AssetEditView.vue'
import CategoryListView from '../views/categories/CategoryListView.vue'
import CategoryCreateView from '../views/categories/CategoryCreateView.vue'
import CategoryEditView from '../views/categories/CategoryEditView.vue'
import EmployeeListView from '../views/employees/EmployeeListView.vue'
import EmployeeCreateView from '../views/employees/EmployeeCreateView.vue'
import LoanListView from '../views/loans/LoanListView.vue'
import LoanCreateView from '../views/loans/LoanCreateView.vue'
import ReturnAssetView from '../views/loans/ReturnAssetView.vue'
import MaintenanceListView from '../views/maintenance/MaintenanceListView.vue'
import MaintenanceCreateView from '../views/maintenance/MaintenanceCreateView.vue'
import MaintenanceDetailView from '../views/maintenance/MaintenanceDetailView.vue'
import AssetHistoryView from '../views/history/AssetHistoryView.vue'
import QrScanView from '../views/qr/QrScanView.vue'
import QrAssetDetailView from '../views/qr/QrAssetDetailView.vue'

export const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login', public: true, guestOnly: true },
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '',
        redirect: appConfig.defaultRoute,
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
        meta: { title: 'Dashboard', roles: ['admin'] },
      },
      {
        path: 'assets',
        name: 'assets',
        component: AssetListView,
        meta: { title: 'Assets', roles: ['admin'] },
      },
      {
        path: 'assets/create',
        name: 'assets-create',
        component: AssetCreateView,
        meta: { title: 'Create Asset', roles: ['admin'] },
      },
      {
        path: 'assets/:id/edit',
        name: 'assets-edit',
        component: AssetEditView,
        meta: { title: 'Edit Asset', roles: ['admin'] },
      },
      {
        path: 'categories',
        name: 'categories',
        component: CategoryListView,
        meta: { title: 'Categories', roles: ['admin'] },
      },
      {
        path: 'categories/create',
        name: 'categories-create',
        component: CategoryCreateView,
        meta: { title: 'Create Category', roles: ['admin'] },
      },
      {
        path: 'categories/:id/edit',
        name: 'categories-edit',
        component: CategoryEditView,
        meta: { title: 'Edit Category', roles: ['admin'] },
      },
      {
        path: 'employees',
        name: 'employees',
        component: EmployeeListView,
        meta: { title: 'Employees', roles: ['admin'] },
      },
      {
        path: 'employees/create',
        name: 'employees-create',
        component: EmployeeCreateView,
        meta: { title: 'Create Employee', roles: ['admin'] },
      },
      {
        path: 'loans',
        name: 'loans',
        component: LoanListView,
        meta: { title: 'Loans', roles: ['admin'] },
      },
      {
        path: 'loans/create',
        name: 'loans-create',
        component: LoanCreateView,
        meta: { title: 'Create Loan', roles: ['admin'] },
      },
      {
        path: 'loans/:id/return',
        name: 'loans-return',
        component: ReturnAssetView,
        meta: { title: 'Return Asset', roles: ['admin'] },
      },
      {
        path: 'maintenance',
        name: 'maintenance',
        component: MaintenanceListView,
        meta: { title: 'Maintenance', roles: ['admin'] },
      },
      {
        path: 'maintenance/create',
        name: 'maintenance-create',
        component: MaintenanceCreateView,
        meta: { title: 'Create Maintenance', roles: ['admin'] },
      },
      {
        path: 'maintenance/:id',
        name: 'maintenance-detail',
        component: MaintenanceDetailView,
        meta: { title: 'Maintenance Detail', roles: ['admin'] },
      },
      {
        path: 'history',
        name: 'history',
        component: AssetHistoryView,
        meta: { title: 'History', roles: ['admin'] },
      },
      {
        path: 'qr',
        name: 'qr',
        component: QrScanView,
        meta: { title: 'QR Center', roles: ['admin'] },
      },
      {
        path: 'qr/assets/:id',
        name: 'qr-asset-detail',
        component: QrAssetDetailView,
        meta: { title: 'QR Asset Detail', roles: ['admin'] },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login',
  },
]

const router = createRouter({
  history: createWebHistory(appConfig.basePath),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta?.title || 'App'} | ${appConfig.appName}`
})

let hasHydratedAfterLogin = false

router.beforeEach(async (to) => {
  if (to.meta?.public) {
    if (to.meta?.guestOnly && isAuthenticated()) {
      return getDefaultRouteByRole()
    }

    return true
  }

  if (!isAuthenticated()) {
    hasHydratedAfterLogin = false
    return '/login'
  }

  if (!hasHydratedAfterLogin) {
    await hydrateAppData().catch((error) => {
      console.error('Gagal memuat data aplikasi:', error)
    })
    hasHydratedAfterLogin = true
  }

  const allowedRoles = to.meta?.roles
  if (Array.isArray(allowedRoles) && !allowedRoles.includes(currentUser.value?.role)) {
    return getDefaultRouteByRole()
  }

  return true
})

export default router
