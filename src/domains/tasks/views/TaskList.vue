<!-- src/domains/tasks/views/TaskList.vue -->
<template>
  <AppListPanel
    :searchQuery="store.searchQuery"
    @update:searchQuery="store.setSearch"
    searchPlaceholder="搜索任务..."
    :filters="filters"
    :currentFilter="store.filterStatus"
    @update:filter="store.setFilter"
    createText="新建任务"
    buttonStyle="primary"
    :isEmpty="store.filteredTasks.length === 0"
    :isSearching="!!store.searchQuery"
    emptyIcon="✅"
    emptyText="你目前闲下来了，新建一个任务吧"
    emptySearchText="未找到匹配的任务"
    @create="createTask"
  >
    <!-- Tasks List -->
    <li v-for="task in store.filteredTasks" :key="task.id">
      <RouterLink :to="`/tasks/${task.id}`" :class="[
          'block px-4 py-3 transition-colors hover:bg-[var(--color-surface-hover)]',
          isActiveTask(task.id) ? 'bg-[var(--color-accent)]/5 border-r-2 border-[var(--color-accent)]' : '',
        ]">
        <div class="flex items-start justify-between gap-2 mb-1">
          <div class="flex items-center gap-1.5 flex-1 min-w-0">
            <!-- Checkbox visual indicator -->
            <div :class="[
              'w-3.5 h-3.5 rounded-full border shrink-0 flex items-center justify-center cursor-pointer transition-colors mt-0.5',
              task.status === 'done' ? 'bg-emerald-500 border-emerald-500' : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
            ]" @click.prevent="toggleDone(task)">
              <svg v-if="task.status === 'done'" class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 :class="[
              'text-sm font-medium truncate',
              task.status === 'done' ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]'
            ]">
              {{ task.title || '无标题任务' }}
            </h3>
          </div>
          
          <!-- Priority indicator -->
          <span :class="[
            'shrink-0 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1',
              getPriorityColorClass(task.priority)
          ]">
            {{ getPriorityLabel(task.priority) }}
          </span>
        </div>

        <p v-if="task.description" class="text-xs text-[var(--color-text-muted)] line-clamp-1 mb-1.5 ml-5">
          {{ task.description }}
        </p>
        
        <!-- Bottom row: meta info -->
        <div class="flex items-center gap-2 flex-wrap ml-5 mt-1">
          <span class="text-[10px] text-[var(--color-text-muted)]">
            {{ formatTime(task.updatedAt) }}
          </span>

          <!-- Due date badge -->
          <span v-if="task.dueDate" :class="[
            'text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5',
            isTaskOverdue(task) && task.status !== 'done' && task.status !== 'cancelled'
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]'
          ]">
            <svg class="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {{ formatDueDate(task.dueDate) }}
          </span>

          <span v-if="task.relatedNoteId" class="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-accent)]/10 text-[var(--color-accent)] truncate max-w-[150px]">
            关联了笔记
          </span>
        </div>
      </RouterLink>
    </li>

    <!-- Footer Stats -->
    <template #footer>
      <div class="flex items-center justify-between w-full">
        <span>
          共 {{ store.tasks.length }} 个任务
          <span v-if="store.filteredTasks.length !== store.tasks.length">
            · 显示 {{ store.filteredTasks.length }} 个
          </span>
          <span v-if="doneCount > 0"> · {{ doneCount }} 已完成</span>
        </span>
        <RouterLink to="/tasks/board"
          class="text-[10px] text-[var(--color-accent)] hover:underline cursor-pointer">
          看板视图 →
        </RouterLink>
      </div>
    </template>
  </AppListPanel>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../store'
import { type TaskStatus, type TaskPriority, TASK_PRIORITY_LABELS, type Task } from '../model'
import AppListPanel from '@/shared/ui/AppListPanel.vue'

const store = useTaskStore()
const route = useRoute()
const router = useRouter()

const filters: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'done', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
]

const doneCount = computed(() => store.tasks.filter(t => t.status === 'done').length)

onMounted(() => {
  store.loadList()
})

function isActiveTask(id: string) {
  return route.params.id === id
}

async function createTask() {
  const task = await store.create()
  router.push(`/tasks/${task.id}`)
}

function toggleDone(task: Task) {
    if (task.status === 'done') {
        store.updateStatus(task.id, 'todo')
    } else {
        store.updateStatus(task.id, 'done')
    }
}

function getPriorityLabel(p: TaskPriority) {
  return TASK_PRIORITY_LABELS[p]
}

function getPriorityColorClass(p: TaskPriority) {
  switch (p) {
    case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    case 'medium': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    case 'low': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    default: return 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]'
  }
}

function isTaskOverdue(task: Task): boolean {
  if (!task.dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return task.dueDate < today.getTime()
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

function formatDueDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target.getTime() - now.getTime()) / 86400_000)

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '明天'
  if (diffDays === -1) return '昨天'
  if (diffDays < 0) return `逾期 ${-diffDays} 天`
  if (diffDays <= 7) return `${diffDays} 天后`
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>
