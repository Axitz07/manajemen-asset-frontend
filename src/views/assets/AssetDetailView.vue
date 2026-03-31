<script setup>
import AssetCard from '../../components/assets/AssetCard.vue'
import HistoryTable from '../../components/history/HistoryTable.vue'
</script>

<template>
  <section class="view">
    <AssetCard />
    <HistoryTable />
  </section>
</template>

<style scoped>
.view {
  display: grid;
  gap: 20px;
}
</style>
