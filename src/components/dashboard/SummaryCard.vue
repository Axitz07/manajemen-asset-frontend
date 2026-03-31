<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    default: 'default',
  },
})
</script>

<template>
  <article class="card panel" :data-tone="tone">
    <p class="card__title">{{ title }}</p>
    <strong class="card__value">{{ value }}</strong>
    <p class="card__note">{{ note }}</p>
  </article>
</template>

<style scoped>
.card {
  padding: 20px;
  border-radius: 16px;
}

.card__title,
.card__note {
  margin: 0;
}

.card__title {
  color: var(--text-soft);
  font-size: 0.92rem;
}

.card__value {
  display: block;
  margin: 10px 0 6px;
  font-size: 28px;
  line-height: 1.2;
  color: #404040;
}

.card__note {
  color: var(--text-soft);
}

.card[data-tone='success'] {
  border-color: #b7ebc8;
  background: #f0fff5;
}

.card[data-tone='warning'] {
  border-color: #f0d29b;
  background: #fff9ef;
}

.card[data-tone='danger'] {
  border-color: #f5b8b8;
  background: #fef2f2;
}
</style>
