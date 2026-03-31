<script setup>
import AppTable from '../common/AppTable.vue'

const columns = ['Nama Kategori', 'Dibuat']
const rows = [{ 'Nama Kategori': 'Laptop', Dibuat: '27-03-2026' }]
</script>

<template>
  <AppTable title="Kategori Asset" :columns="columns" :rows="rows" />
</template>
