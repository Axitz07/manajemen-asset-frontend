<script setup>
import AppBadge from '../common/AppBadge.vue'

defineProps({
  label: {
    type: String,
    default: 'Available',
  },
  tone: {
    type: String,
    default: 'success',
  },
})
</script>

<template>
  <AppBadge :label="label" :tone="tone" />
</template>
