<!-- src/shared/ui/StreakBadge.vue -->
<template>
  <div v-if="days > 0" :class="[
    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-semibold text-sm',
    days >= 30
      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
      : days >= 7
        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
        : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)]'
  ]">
    <span class="text-base">🔥</span>
    <span>{{ days }} 天连续</span>
  </div>
  <div v-else class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]">
    <span class="text-base">💤</span>
    <span>开始你的连续记录</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ days: number }>()
</script>
