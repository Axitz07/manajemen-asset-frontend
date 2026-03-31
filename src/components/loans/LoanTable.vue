<script setup>
import AppTable from '../common/AppTable.vue'

const columns = ['Asset', 'Karyawan', 'Tanggal Pinjam', 'Status']
const rows = [
  {
    Asset: 'Laptop HP',
    Karyawan: 'Adit',
    'Tanggal Pinjam': '27-03-2026',
    Status: 'Borrowed',
  },
]
</script>

<template>
  <AppTable title="Peminjaman Asset" :columns="columns" :rows="rows" />
</template>
