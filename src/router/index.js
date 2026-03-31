import { createRouter, createWebHistory } from 'vue-router'
import { appConfig } from '../lib/env'
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
import EmployeeEditView from '../views/employees/EmployeeEditView.vue'
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
        meta: { title: 'Dashboard' },
      },
      {
        path: 'assets',
        name: 'assets',
        component: AssetListView,
        meta: { title: 'Assets' },
      },
      {
        path: 'assets/create',
        name: 'assets-create',
        component: AssetCreateView,
        meta: { title: 'Create Asset' },
      },
      {
        path: 'assets/:id/edit',
        name: 'assets-edit',
        component: AssetEditView,
        meta: { title: 'Edit Asset' },
      },
      {
        path: 'categories',
        name: 'categories',
        component: CategoryListView,
        meta: { title: 'Categories' },
      },
      {
        path: 'categories/create',
        name: 'categories-create',
        component: CategoryCreateView,
        meta: { title: 'Create Category' },
      },
      {
        path: 'categories/:id/edit',
        name: 'categories-edit',
        component: CategoryEditView,
        meta: { title: 'Edit Category' },
      },
      {
        path: 'employees',
        name: 'employees',
        component: EmployeeListView,
        meta: { title: 'Employees' },
      },
      {
        path: 'employees/create',
        name: 'employees-create',
        component: EmployeeCreateView,
        meta: { title: 'Create Employee' },
      },
      {
        path: 'employees/:id/edit',
        name: 'employees-edit',
        component: EmployeeEditView,
        meta: { title: 'Edit Employee' },
      },
      {
        path: 'loans',
        name: 'loans',
        component: LoanListView,
        meta: { title: 'Loans' },
      },
      {
        path: 'loans/create',
        name: 'loans-create',
        component: LoanCreateView,
        meta: { title: 'Create Loan' },
      },
      {
        path: 'loans/:id/return',
        name: 'loans-return',
        component: ReturnAssetView,
        meta: { title: 'Return Asset' },
      },
      {
        path: 'maintenance',
        name: 'maintenance',
        component: MaintenanceListView,
        meta: { title: 'Maintenance' },
      },
      {
        path: 'maintenance/create',
        name: 'maintenance-create',
        component: MaintenanceCreateView,
        meta: { title: 'Create Maintenance' },
      },
      {
        path: 'maintenance/:id',
        name: 'maintenance-detail',
        component: MaintenanceDetailView,
        meta: { title: 'Maintenance Detail' },
      },
      {
        path: 'history',
        name: 'history',
        component: AssetHistoryView,
        meta: { title: 'History' },
      },
      {
        path: 'qr',
        name: 'qr',
        component: QrScanView,
        meta: { title: 'QR Center' },
      },
      {
        path: 'qr/assets/:id',
        name: 'qr-asset-detail',
        component: QrAssetDetailView,
        meta: { title: 'QR Asset Detail' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: appConfig.defaultRoute,
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

export default router
