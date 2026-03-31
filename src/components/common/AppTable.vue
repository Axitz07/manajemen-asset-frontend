<script setup>
defineProps({
  title: {
    type: String,
    default: 'Data Table',
  },
  columns: {
    type: Array,
    default: () => [],
  },
  rows: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="table panel">
    <header class="table__header">
      <h3>{{ title }}</h3>
    </header>

    <div class="table__wrap">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column">{{ column }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="!rows.length">
            <td :colspan="columns.length || 1">Belum ada data.</td>
          </tr>
          <tr v-for="(row, index) in rows" :key="index">
            <td v-for="column in columns" :key="column">{{ row[column] ?? '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.table {
  padding: 20px;
}

.table__header {
  margin-bottom: 16px;
}

h3 {
  margin: 0;
}

.table__wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  border-bottom: 1px solid var(--border-soft);
  text-align: left;
}

thead {
  color: var(--text-soft);
}
</style>
