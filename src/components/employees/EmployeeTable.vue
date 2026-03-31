<script setup>
import AppTable from '../common/AppTable.vue'

const columns = ['Nama', 'Email', 'Telepon']
const rows = [{ Nama: 'Adit', Email: 'adit@company.test', Telepon: '08123456789' }]
</script>

<template>
  <AppTable title="Daftar Karyawan" :columns="columns" :rows="rows" />
</template>
