<script setup>
defineProps({
  label: {
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
  <span class="badge" :data-tone="tone">{{ label }}</span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 84px;
  padding: 4px 14px;
  border-radius: 20px;
  background: #eff6ff;
  border: 1px solid #93c5fd;
  color: var(--brand);
  font-size: 13px;
  font-weight: 700;
}

.badge[data-tone='success'] {
  background: #f0fff5;
  color: #18a957;
  border-color: #6ccb92;
}

.badge[data-tone='warning'] {
  background: #fff9ef;
  color: #e39a21;
  border-color: #f0b859;
}

.badge[data-tone='danger'] {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fca5a5;
}

.badge[data-tone='neutral'] {
  background: #f8fafc;
  color: #475569;
  border-color: #cbd5e1;
}

.badge[data-tone='default'] {
  background: #eff6ff;
  color: var(--brand);
  border-color: #93c5fd;
}
</style>
