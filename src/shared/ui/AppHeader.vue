<!-- src/shared/ui/AppHeader.vue -->
<template>
  <header class="h-12 px-4 flex items-center justify-between border-b border-[var(--color-border)]
                 bg-[var(--color-surface)]">
    <div class="flex items-center gap-3">
      <h1 class="text-sm font-medium text-[var(--color-text-secondary)]">
        {{ pageTitle }}
      </h1>
    </div>

    <div class="flex items-center gap-2">
      <!-- Search button (always visible) -->
      <button class="flex items-center gap-1 px-2.5 py-1 rounded-lg
               bg-[var(--color-surface-alt)] border border-[var(--color-border)]
               text-xs text-[var(--color-text-muted)] cursor-pointer
               hover:border-[var(--color-accent)]/50 transition-colors" @click="$emit('search')">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <span class="hidden sm:inline">搜索</span>
        <kbd class="hidden sm:inline ml-1 px-1 py-0.5 rounded text-[10px] bg-[var(--color-surface)]
                    border border-[var(--color-border)]">⌘K</kbd>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineEmits<{ search: [] }>()

const route = useRoute()

const pageTitle = computed(() => {
  if (route.path === '/dashboard') return '仪表盘'
  if (route.path.startsWith('/knowledge')) return '知识库'
  if (route.path.startsWith('/tasks')) return '任务'
  if (route.path.startsWith('/habits')) return '习惯'
  return 'Atlas'
})
</script>
