<!-- src/domains/knowledge/views/KnowledgeList.vue -->
<template>
  <AppListPanel
    :searchQuery="store.searchQuery"
    @update:searchQuery="store.setSearch"
    searchPlaceholder="搜索笔记..."
    :filters="filters"
    :currentFilter="store.filterStatus"
    @update:filter="store.setFilter"
    createText="新建笔记"
    buttonStyle="primary"
    :isEmpty="store.filteredNotes.length === 0"
    :isSearching="!!store.searchQuery"
    emptyIcon="📝"
    emptyText="还没有笔记，创建一个吧"
    emptySearchText="未找到匹配的笔记"
    @create="createNote"
  >
    <!-- List -->
    <li v-for="note in store.filteredNotes" :key="note.id">
      <RouterLink :to="`/knowledge/${note.id}`" :class="[
          'block px-4 py-3 transition-colors hover:bg-[var(--color-surface-hover)]',
          isActiveNote(note.id) ? 'bg-[var(--color-accent)]/5 border-r-2 border-[var(--color-accent)]' : '',
        ]">
        <div class="flex items-start justify-between gap-2 mb-1">
          <h3 class="text-sm font-medium text-[var(--color-text-primary)] truncate flex-1">
            {{ note.title || '无标题' }}
          </h3>
          <StatusBadge :status="note.status" />
        </div>

        <p class="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-1.5">
          {{ note.content || '空白笔记...' }}
        </p>

        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[10px] text-[var(--color-text-muted)]">
            {{ formatTime(note.updatedAt) }}
          </span>
          <span v-for="tag in note.tags.slice(0, 3)" :key="tag" class="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-surface-alt)]
                    text-[var(--color-text-muted)]">
            {{ tag }}
          </span>
          <span v-if="note.tags.length > 3" class="text-[10px] text-[var(--color-text-muted)]">
            +{{ note.tags.length - 3 }}
          </span>
        </div>
      </RouterLink>
    </li>

    <!-- Footer Stats -->
    <template #footer>
      共 {{ store.notes.length }} 条笔记
      <span v-if="store.filteredNotes.length !== store.notes.length">
        · 显示 {{ store.filteredNotes.length }} 条
      </span>
    </template>
  </AppListPanel>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKnowledgeStore } from '../store'
import StatusBadge from '@/shared/ui/StatusBadge.vue'
import AppListPanel from '@/shared/ui/AppListPanel.vue'
import type { KnowledgeStatus } from '../model'

const store = useKnowledgeStore()
const route = useRoute()
const router = useRouter()

const filters: { value: KnowledgeStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'draft', label: '草稿' },
  { value: 'understood', label: '已理解' },
  { value: 'actionable', label: '可行动' },
]

onMounted(() => {
  store.loadList()
})

function isActiveNote(id: string) {
  return route.params.id === id
}

async function createNote() {
  const note = await store.create()
  router.push(`/knowledge/${note.id}`)
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  if (diff < 60_000) return '刚刚'
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} 小时前`
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
