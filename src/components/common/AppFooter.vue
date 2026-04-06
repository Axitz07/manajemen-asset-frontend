<template>
  <footer class="frame-168-footer">
    <div class="footer-inner">
      <p class="footer-text">PT Init Solusi Digital</p>
    </div>
  </footer>
</template>

<style scoped>
.frame-168-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 58px;
  background: #363636;
  padding-inline: var(--shell-padding);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: min(100%, var(--shell-max));
  min-height: 58px;
}

.footer-text {
  margin: 0;
  font-family: 'Nunito Sans', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: clamp(14px, 1.1vw, 16px);
  line-height: 22px;
  color: #ffffff;
  text-align: center;
}

@media (max-width: 960px) {
  .frame-168-footer {
    padding-inline: var(--shell-padding-mobile);
  }
}
</style>
