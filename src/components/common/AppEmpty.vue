<template>
  <div class="empty panel">
    <p class="empty__title">Belum ada data.</p>
    <p class="empty__text">Tampilan ini bisa dipakai saat tabel atau daftar masih kosong.</p>
  </div>
</template>

<style scoped>
.empty {
  padding: 24px;
  text-align: center;
}

.empty__title {
  margin: 0 0 8px;
  font-weight: 700;
}

.empty__text {
  margin: 0;
  color: var(--text-soft);
}
</style>
