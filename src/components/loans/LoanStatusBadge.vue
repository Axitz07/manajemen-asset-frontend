<script setup>
import AppBadge from '../common/AppBadge.vue'

defineProps({
  label: {
    type: String,
    default: 'Borrowed',
  },
  tone: {
    type: String,
    default: 'warning',
  },
})
</script>

<template>
  <AppBadge :label="label" :tone="tone" />
</template>
