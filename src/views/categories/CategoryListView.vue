<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { deleteCategory } from '../../stores/categoryStore'
import { getCategories } from '../../services/categoryService'

const categories = computed(() => getCategories())

const topCategory = computed(() =>
  [...categories.value].sort((a, b) => b.total_assets - a.total_assets)[0] ?? null,
)

const totalAssets = computed(() =>
  categories.value.reduce((total, item) => total + item.total_assets, 0),
)

const removeCategory = async (categoryId) => {
  if (!window.confirm('Hapus kategori ini?')) return
  await deleteCategory(categoryId)
}
</script>

<template>
  <section id="categories" class="page">
    <div class="breadcrumb-row">
      <p class="breadcrumb">Assets › Categories</p>
    </div>

    <h1 class="page-title">Asset Categories</h1>

    <section class="card-shell panel">
      <div class="toolbar">
        <div>
          <h3>Category Master Data</h3>
          <p>Kelola kategori agar pengelompokan asset tetap konsisten.</p>
        </div>
        <RouterLink to="/categories/create" class="btn-primary btn-link">Add Category</RouterLink>
      </div>

      <div class="stats-grid">
        <article class="metric-box">
          <span>Total Categories</span>
          <strong>{{ categories.length }}</strong>
        </article>
        <article class="metric-box">
          <span>Total Assets</span>
          <strong>{{ totalAssets }}</strong>
        </article>
        <article class="metric-box">
          <span>Largest Category</span>
          <strong>{{ topCategory?.category_name ?? '-' }}</strong>
          <small>{{ topCategory?.total_assets ?? 0 }} asset terdaftar</small>
        </article>
      </div>

      <div class="table-shell">
        <table class="data-table">
          <thead>
            <tr>
              <th>CATEGORY NAME</th>
              <th>TOTAL ASSETS</th>
              <th>CREATED AT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in categories" :key="item.category_id">
              <td>{{ item.category_name }}</td>
              <td>{{ item.total_assets }}</td>
              <td>{{ item.created_at }}</td>
              <td>
                <div class="action-group">
                  <RouterLink :to="`/categories/${item.category_id}/edit`" class="action-link edit">Edit</RouterLink>
                  <button type="button" class="action-link delete" @click="removeCategory(item.category_id)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 20px 20px 80px;
  box-sizing: border-box;
}

.breadcrumb-row {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 27px;
  padding-bottom: 8px;
  border-bottom: 1px solid #d4d4d4;
}

.breadcrumb {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #737373;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #404040;
}

.card-shell {
  display: grid;
  gap: 20px;
  width: 100%;
  padding: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #d4d4d4;
}

.toolbar h3,
.toolbar p {
  margin: 0;
}

.toolbar p {
  color: #64748b;
}

.stats-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.metric-box {
  flex: 1 1 220px;
  padding: 16px;
  border: 1px solid #dbe4ee;
  border-radius: 12px;
  background: #fafafa;
}

.metric-box span {
  color: #64748b;
}

.metric-box strong {
  display: block;
  margin-top: 6px;
  font-size: 28px;
  color: #404040;
}

.metric-box small {
  display: block;
  margin-top: 6px;
  color: #64748b;
}

.table-shell {
  border: 1px solid #d4d4d4;
  border-radius: 8px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 16px 20px;
  text-align: left;
}

.data-table th {
  background: #fafafa;
  border-bottom: 1px solid #d4d4d4;
  font-size: 15px;
  font-weight: 700;
  color: #404040;
}

.data-table td {
  border-bottom: 1px solid #e5e7eb;
  color: #525252;
}

.data-table tbody tr:last-child td {
  border-bottom: 0;
}

.action-group {
  display: inline-flex;
  gap: 10px;
}

.action-link {
  border: 0;
  padding: 0;
  background: transparent;
  color: var(--brand);
  font: inherit;
  cursor: pointer;
  text-decoration: underline;
}

.action-link.delete {
  color: var(--danger);
}

.btn-primary {
  min-height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid #363636;
  background: linear-gradient(270deg, #171717 0%, #363636 100%);
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

@media (max-width: 920px) {
  .page {
    padding-inline: 0;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
