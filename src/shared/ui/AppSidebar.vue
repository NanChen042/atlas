<!-- src/shared/ui/AppSidebar.vue -->
<template>
  <aside :class="[
      'h-full flex flex-col border-r border-[var(--color-border)]',
      'bg-[var(--color-surface-alt)] transition-[width] duration-200 ease-in-out',
      collapsed ? 'w-14' : 'w-60',
    ]">
    <!-- Logo Area -->
    <div class="h-12 flex items-center px-3 gap-2 shrink-0">
      <button class="w-8 h-8 flex items-center justify-center rounded-lg
               hover:bg-[var(--color-surface-hover)] cursor-pointer
               text-[var(--color-text-secondary)] transition-colors" @click="collapsed = !collapsed" :aria-label="collapsed ? '展开侧边栏' : '收起侧边栏'">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span v-show="!collapsed" class="font-semibold text-sm text-[var(--color-text-primary)] whitespace-nowrap">
        Atlas
      </span>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
      <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" :class="[
          'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors',
          'hover:bg-[var(--color-surface-hover)]',
          isActive(item.path)
            ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-medium'
            : 'text-[var(--color-text-secondary)]',
        ]">
        <span class="w-5 h-5 flex items-center justify-center shrink-0" v-html="item.icon"></span>
        <span v-show="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <!-- Bottom -->
    <div class="px-2 py-2 border-t border-[var(--color-border)] shrink-0 space-y-0.5">
      <!-- AI Assistant -->
      <button
        :class="[
          'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all cursor-pointer',
          aiStore.panelOpen
            ? 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 dark:text-violet-400'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
        ]"
        @click="aiStore.togglePanel"
      >
        <span class="w-5 h-5 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </span>
        <span v-show="!collapsed" class="whitespace-nowrap">AI 助手</span>
        <span v-if="!collapsed && !aiStore.isConfigured" class="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          未配置
        </span>
      </button>

      <!-- Data Manager -->
      <DataManager :collapsed="collapsed" />

      <!-- Theme Toggle -->
      <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm
                  text-[var(--color-text-muted)]">
        <ThemeToggle />
        <span v-show="!collapsed" class="whitespace-nowrap text-xs">主题</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import DataManager from './DataManager.vue'
import { useAIStore } from '@/domains/ai/store'

const route = useRoute()
const aiStore = useAIStore()
const collapsed = ref(false)

const navItems = [
  {
    path: '/dashboard',
    label: '仪表盘',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>',
  },
  {
    path: '/knowledge',
    label: '知识库',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>',
  },
  {
    path: '/tasks',
    label: '任务',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  },
  {
    path: '/habits',
    label: '习惯',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z"/></svg>',
  },
  {
    path: '/focus',
    label: '专注',
    icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
  },
]

function isActive(path: string) {
  if (path === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(path)
}
</script>
