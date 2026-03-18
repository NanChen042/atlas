<!-- src/domains/tasks/views/TaskBoard.vue -->
<template>
  <div class="h-full overflow-x-auto overflow-y-hidden p-4">
    <div class="flex gap-4 h-full min-w-max">
      <!-- Column for each status -->
      <div
        v-for="col in columns"
        :key="col.status"
        class="w-72 shrink-0 flex flex-col bg-[var(--color-surface-alt)] rounded-2xl border border-[var(--color-border)]"
      >
        <!-- Column Header -->
        <div class="px-4 py-3 flex items-center gap-2 border-b border-[var(--color-border)]">
          <span :class="[
            'w-2.5 h-2.5 rounded-full',
            col.color
          ]" />
          <h3 class="text-sm font-semibold text-[var(--color-text-primary)]">{{ col.label }}</h3>
          <span class="text-[11px] text-[var(--color-text-muted)] ml-auto">
            {{ tasksByStatus[col.status]?.length || 0 }}
          </span>
        </div>

        <!-- Task Cards -->
        <div
          class="flex-1 overflow-y-auto p-2 space-y-2"
          @dragover.prevent
          @drop="onDrop($event, col.status)"
        >
          <div
            v-for="task in tasksByStatus[col.status]"
            :key="task.id"
            class="p-3 rounded-xl border border-[var(--color-border)]
                   bg-[var(--color-surface)] hover:shadow-md
                   cursor-grab active:cursor-grabbing
                   transition-all hover:-translate-y-0.5"
            draggable="true"
            @dragstart="onDragStart($event, task)"
          >
            <!-- Priority badge -->
            <div class="flex items-center gap-1.5 mb-2">
              <span :class="[
                'text-[10px] px-1.5 py-0.5 rounded font-medium',
                task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : task.priority === 'medium' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                  : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              ]">
                {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}
              </span>
              <span v-if="task.dueDate" :class="[
                'text-[10px]',
                isOverdue(task) ? 'text-red-500 font-medium' : 'text-[var(--color-text-muted)]'
              ]">
                {{ formatDueDate(task.dueDate) }}
              </span>
            </div>

            <!-- Title -->
            <RouterLink
              :to="`/tasks/${task.id}`"
              class="text-sm font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent)]
                     transition-colors line-clamp-2 block"
            >
              {{ task.title || '无标题任务' }}
            </RouterLink>

            <!-- Description preview -->
            <p v-if="task.description" class="text-[11px] text-[var(--color-text-muted)] mt-1.5 line-clamp-2">
              {{ task.description }}
            </p>

            <!-- Tags -->
            <div v-if="task.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
              <span
                v-for="tag in task.tags.slice(0, 3)"
                :key="tag"
                class="text-[9px] px-1.5 py-0.5 rounded
                       bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]
                       border border-[var(--color-border)]"
              >
                #{{ tag }}
              </span>
              <span v-if="task.tags.length > 3" class="text-[9px] text-[var(--color-text-muted)]">
                +{{ task.tags.length - 3 }}
              </span>
            </div>
          </div>

          <!-- Empty state -->
          <div v-if="!tasksByStatus[col.status]?.length"
               class="flex items-center justify-center h-20 text-xs text-[var(--color-text-muted)]
                      border-2 border-dashed border-[var(--color-border)] rounded-xl">
            拖拽任务到这里
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTaskStore } from '../store'
import type { Task, TaskStatus } from '../model'

const taskStore = useTaskStore()

const columns = [
  { status: 'todo' as TaskStatus, label: '待办', color: 'bg-blue-500' },
  { status: 'in-progress' as TaskStatus, label: '进行中', color: 'bg-amber-500' },
  { status: 'done' as TaskStatus, label: '已完成', color: 'bg-emerald-500' },
  { status: 'cancelled' as TaskStatus, label: '已取消', color: 'bg-neutral-400' },
]

const tasksByStatus = computed(() => taskStore.tasksByStatus)

let draggedTaskId = ''

function onDragStart(e: DragEvent, task: Task) {
  draggedTaskId = task.id
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task.id)
  }
}

function onDrop(_e: DragEvent, newStatus: TaskStatus) {
  if (draggedTaskId) {
    taskStore.updateStatus(draggedTaskId, newStatus)
    draggedTaskId = ''
  }
}

function isOverdue(task: Task): boolean {
  if (!task.dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return task.dueDate < today.getTime() && task.status !== 'done'
}

function formatDueDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)
  const diff = Math.round((target.getTime() - now.getTime()) / 86400_000)
  if (diff === 0) return '今天'
  if (diff === 1) return '明天'
  if (diff < 0) return `逾期${-diff}天`
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>
