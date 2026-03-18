<!-- src/shared/ui/ThemeToggle.vue -->
<template>
  <button class="w-8 h-8 flex items-center justify-center rounded-lg
           hover:bg-[var(--color-surface-hover)] cursor-pointer
           text-[var(--color-text-secondary)] transition-colors" @click="toggle" :aria-label="isDark ? '切换亮色模式' : '切换暗色模式'" :title="isDark ? '切换亮色模式' : '切换暗色模式'">
    <!-- Sun icon -->
    <svg v-if="isDark" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5" stroke-width="2" />
      <path stroke-width="2" stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
    <!-- Moon icon -->
    <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  const stored = localStorage.getItem('atlas-theme')
  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
})

function toggle() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('atlas-theme', isDark.value ? 'dark' : 'light')
}
</script>
