export const categories = [
  { category_id: 1, category_name: 'Laptop', created_at: '2026-03-01' },
  { category_id: 2, category_name: 'Printer', created_at: '2026-03-01' },
  { category_id: 3, category_name: 'Monitor', created_at: '2026-03-02' },
  { category_id: 4, category_name: 'Projector', created_at: '2026-03-03' },
  { category_id: 5, category_name: 'Networking', created_at: '2026-03-03' },
]

export const employees = [
  {
    employee_id: 1,
    employee_name: 'Adit Pratama',
    email: 'adit@company.test',
    phone: '081234567890',
    created_at: '2026-03-05',
  },
  {
    employee_id: 2,
    employee_name: 'Rina Putri',
    email: 'rina@company.test',
    phone: '081234567891',
    created_at: '2026-03-05',
  },
  {
    employee_id: 3,
    employee_name: 'Fajar Nugraha',
    email: 'fajar@company.test',
    phone: '081234567892',
    created_at: '2026-03-06',
  },
  {
    employee_id: 4,
    employee_name: 'Salsa Aulia',
    email: 'salsa@company.test',
    phone: '081234567893',
    created_at: '2026-03-07',
  },
  {
    employee_id: 5,
    employee_name: 'Bima Saputra',
    email: 'bima@company.test',
    phone: '081234567894',
    created_at: '2026-03-08',
  },
]

export const assets = [
  {
    asset_id: 1,
    asset_code: 'AST-001',
    asset_name: 'Laptop HP ProBook 440',
    category_id: 1,
    purchase_year: 2024,
    condition: 'Baik',
    status: 'Available',
    qr_code: 'QR-AST-001',
    asset_image: 'laptop-hp.png',
    created_at: '2026-03-10',
  },
  {
    asset_id: 2,
    asset_code: 'AST-002',
    asset_name: 'Laptop Dell Latitude 5420',
    category_id: 1,
    purchase_year: 2023,
    condition: 'Baik',
    status: 'In Use',
    qr_code: 'QR-AST-002',
    asset_image: 'laptop-dell.png',
    created_at: '2026-03-10',
  },
  {
    asset_id: 3,
    asset_code: 'AST-003',
    asset_name: 'Printer Canon G3010',
    category_id: 2,
    purchase_year: 2022,
    condition: 'Rusak Ringan',
    status: 'Maintenance',
    qr_code: 'QR-AST-003',
    asset_image: 'printer-canon.png',
    created_at: '2026-03-11',
  },
  {
    asset_id: 4,
    asset_code: 'AST-004',
    asset_name: 'Monitor LG 24MK600',
    category_id: 3,
    purchase_year: 2024,
    condition: 'Baik',
    status: 'Available',
    qr_code: 'QR-AST-004',
    asset_image: 'monitor-lg.png',
    created_at: '2026-03-12',
  },
  {
    asset_id: 5,
    asset_code: 'AST-005',
    asset_name: 'Projector Epson EB-X06',
    category_id: 4,
    purchase_year: 2021,
    condition: 'Baik',
    status: 'In Use',
    qr_code: 'QR-AST-005',
    asset_image: 'projector-epson.png',
    created_at: '2026-03-12',
  },
  {
    asset_id: 6,
    asset_code: 'AST-006',
    asset_name: 'Router MikroTik hEX',
    category_id: 5,
    purchase_year: 2023,
    condition: 'Baik',
    status: 'Available',
    qr_code: 'QR-AST-006',
    asset_image: 'router-mikrotik.png',
    created_at: '2026-03-13',
  },
]

export const loans = [
  {
    loan_id: 1,
    asset_id: 2,
    employee_id: 1,
    loan_date: '2026-03-21',
    return_date: null,
    status: 'Borrowed',
    note: 'Dipakai untuk operasional harian',
    created_at: '2026-03-21',
  },
  {
    loan_id: 2,
    asset_id: 5,
    employee_id: 4,
    loan_date: '2026-03-24',
    return_date: null,
    status: 'Borrowed',
    note: 'Presentasi client meeting',
    created_at: '2026-03-24',
  },
  {
    loan_id: 3,
    asset_id: 4,
    employee_id: 2,
    loan_date: '2026-03-18',
    return_date: '2026-03-20',
    status: 'Returned',
    note: 'Kebutuhan desain tim marketing',
    created_at: '2026-03-18',
  },
]

export const maintenances = [
  {
    maintenance_id: 1,
    asset_id: 3,
    issue_description: 'Roller printer macet dan hasil cetak bergaris',
    maintenance_date: '2026-03-25',
    maintenance_status: 'Repairing',
    created_at: '2026-03-25',
  },
  {
    maintenance_id: 2,
    asset_id: 6,
    issue_description: 'Penggantian adaptor cadangan',
    maintenance_date: '2026-03-19',
    maintenance_status: 'Done',
    created_at: '2026-03-19',
  },
]

export const histories = [
  {
    history_id: 1,
    asset_id: 2,
    old_status: 'Available',
    new_status: 'In Use',
    note: 'Laptop Dell dipinjam oleh Adit Pratama',
    changed_at: '2026-03-21 09:15',
  },
  {
    history_id: 2,
    asset_id: 5,
    old_status: 'Available',
    new_status: 'In Use',
    note: 'Projector Epson dipinjam oleh Salsa Aulia',
    changed_at: '2026-03-24 13:20',
  },
  {
    history_id: 3,
    asset_id: 3,
    old_status: 'Available',
    new_status: 'Maintenance',
    note: 'Printer Canon masuk maintenance',
    changed_at: '2026-03-25 08:45',
  },
  {
    history_id: 4,
    asset_id: 4,
    old_status: 'In Use',
    new_status: 'Available',
    note: 'Monitor LG dikembalikan oleh Rina Putri',
    changed_at: '2026-03-20 17:10',
  },
]

export function findCategoryById(id) {
  return categories.find((item) => item.category_id === id)
}

export function findEmployeeById(id) {
  return employees.find((item) => item.employee_id === id)
}

export function findAssetById(id) {
  return assets.find((item) => item.asset_id === id)
}
