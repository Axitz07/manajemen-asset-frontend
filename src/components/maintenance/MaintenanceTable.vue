<script setup>
import AppTable from '../common/AppTable.vue'

const columns = ['Asset', 'Issue', 'Tanggal', 'Status']
const rows = [
  {
    Asset: 'Printer Canon',
    Issue: 'Roller rusak',
    Tanggal: '27-03-2026',
    Status: 'Repairing',
  },
]
</script>

<template>
  <AppTable title="Maintenance Asset" :columns="columns" :rows="rows" />
</template>
