<script setup>
import AssetStatusBadge from './AssetStatusBadge.vue'
</script>

<template>
  <article class="panel card">
    <div class="card__top">
      <div>
        <p class="card__code">AST-001</p>
        <h3>Laptop HP</h3>
      </div>
      <AssetStatusBadge label="Available" tone="success" />
    </div>
    <p class="card__meta">Kategori: Laptop</p>
  </article>
</template>

<style scoped>
.card {
  padding: 20px;
}

.card__top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.card__code,
.card__meta,
h3 {
  margin: 0;
}

.card__code,
.card__meta {
  color: var(--text-soft);
}

.card__meta {
  margin-top: 12px;
}
</style>
