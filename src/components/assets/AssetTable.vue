<script setup>
import AppTable from '../common/AppTable.vue'

const columns = ['Kode', 'Nama', 'Kategori', 'Status']
const rows = [
  { Kode: 'AST-001', Nama: 'Laptop HP', Kategori: 'Laptop', Status: 'Available' },
]
</script>

<template>
  <AppTable title="Daftar Asset" :columns="columns" :rows="rows" />
</template>
