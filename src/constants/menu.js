export const MENU_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', caption: 'Ringkasan asset', roles: ['admin'] },
  { label: 'Categories', path: '/categories', caption: 'Kategori asset', roles: ['admin'] },
  { label: 'Assets', path: '/assets', caption: 'Data asset', roles: ['admin', 'staff'] },
  { label: 'Employees', path: '/employees', caption: 'Data employee sistem', roles: ['admin'] },
  { label: 'Loans', path: '/loans', caption: 'Peminjaman asset', roles: ['admin', 'staff'] },
  { label: 'Maintenance', path: '/maintenance', caption: 'Perbaikan asset', roles: ['admin'] },
  { label: 'History', path: '/history', caption: 'Riwayat perubahan', roles: ['admin'] },
  { label: 'QR', path: '/qr', caption: 'Scan dan preview QR', roles: ['admin', 'staff'] },
]
