<script setup>
import AppTable from '../common/AppTable.vue'

const columns = ['Tanggal', 'Status Lama', 'Status Baru', 'Catatan']
const rows = [
  {
    Tanggal: '27-03-2026',
    'Status Lama': 'Available',
    'Status Baru': 'In Use',
    Catatan: 'Dipinjam Adit',
  },
]
</script>

<template>
  <AppTable title="Riwayat Asset" :columns="columns" :rows="rows" />
</template>
