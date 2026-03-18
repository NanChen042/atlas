<!-- src/shared/ui/AppEmptyState.vue -->
<template>
  <div class="h-full flex items-center justify-center">
    <div class="text-center">
      <div class="text-4xl mb-3">{{ icon }}</div>
      <p class="text-sm text-[var(--color-text-muted)]">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon: string
  text: string
}>()
</script>
