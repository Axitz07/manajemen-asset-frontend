<template>
  <section class="panel qr">
    <div class="qr__box">QR</div>
    <p>Preview QR Code asset.</p>
  </section>
</template>

<style scoped>
.qr {
  padding: 20px;
  text-align: center;
}

.qr__box {
  display: grid;
  place-items: center;
  width: 140px;
  height: 140px;
  margin: 0 auto 12px;
  border: 2px dashed var(--brand);
  border-radius: var(--radius-md);
}

p {
  margin: 0;
  color: var(--text-soft);
}
</style>
