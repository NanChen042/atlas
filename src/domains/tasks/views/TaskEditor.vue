<!-- src/domains/tasks/views/TaskEditor.vue -->
<template>
  <AppEmptyState v-if="!store.current" icon="📋" text="选择一个任务或新建一个" />

  <div v-else class="h-full flex flex-col bg-[var(--color-surface)]">
    <!-- Editor Header -->
    <AppEditorHeader
      :saveStatus="saveStatus"
      deleteTitle="删除任务"
      @back="router.push('/tasks')"
      @delete="showDeleteModal = true"
    >
      <template #left>
        <!-- Status Select -->
        <select :value="store.current.status" @change="changeStatus(($event.target as HTMLSelectElement).value as TaskStatus)" class="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)]
                 bg-[var(--color-surface)] text-[var(--color-text-secondary)] cursor-pointer
                 focus:outline-none focus:border-[var(--color-accent)] shrink-0">
          <option v-for="(label, key) in TASK_STATUS_LABELS" :key="key" :value="key">
            {{ label }}
          </option>
        </select>

        <!-- Priority Select -->
        <select :value="store.current.priority" @change="changePriority(($event.target as HTMLSelectElement).value as TaskPriority)" class="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)]
                 bg-[var(--color-surface)] text-[var(--color-text-secondary)] cursor-pointer
                 focus:outline-none focus:border-[var(--color-accent)] shrink-0">
          <option value="low">🟡 {{ TASK_PRIORITY_LABELS['low'] }}</option>
          <option value="medium">🟠 {{ TASK_PRIORITY_LABELS['medium'] }}</option>
          <option value="high">🔴 {{ TASK_PRIORITY_LABELS['high'] }}</option>
        </select>
      </template>
    </AppEditorHeader>

    <!-- Editor Body -->
    <div class="flex-1 overflow-y-auto px-6 py-6">
      <div class="max-w-3xl mx-auto space-y-6">
        <!-- Title & Checkbox -->
        <div class="flex items-start gap-3">
          <div :class="[
                  'mt-1.5 w-6 h-6 rounded-full border shrink-0 flex items-center justify-center cursor-pointer transition-all',
                  store.current.status === 'done' ? 'bg-emerald-500 border-emerald-500' : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                ]" @click="toggleDone">
            <svg v-if="store.current.status === 'done'" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <input :value="store.current.title" @input="onTitleInput(($event.target as HTMLInputElement).value)" type="text" placeholder="准备做什么..." :class="[
                  'w-full text-2xl font-bold placeholder:text-[var(--color-text-muted)] bg-transparent border-none outline-none',
                  store.current.status === 'done' ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]'
            ]" />
        </div>

        <!-- Meta Row: Tags + Due Date -->
        <div class="flex items-start gap-6 pl-9 flex-wrap">
          <!-- Tags -->
          <div class="flex items-center gap-2 flex-1 min-w-[200px]">
            <svg class="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            <TagInput :modelValue="store.current.tags" @update:modelValue="onTagsChange" />
          </div>

          <!-- Due Date -->
          <div class="flex items-center gap-2 shrink-0">
            <svg class="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <input
              type="date"
              :value="dueDateStr"
              @change="onDueDateChange(($event.target as HTMLInputElement).value)"
              :class="[
                'text-xs px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer focus:outline-none focus:border-[var(--color-accent)] transition-colors',
                isOverdue ? 'text-red-500 border-red-300 dark:border-red-800' : 'text-[var(--color-text-secondary)]'
              ]"
            />
            <button
              v-if="store.current.dueDate"
              class="w-5 h-5 flex items-center justify-center rounded text-[var(--color-text-muted)] hover:text-red-500 cursor-pointer transition-colors"
              @click="clearDueDate"
              title="清除截止日期"
            >
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Due Date Warning -->
        <div v-if="isOverdue && store.current.status !== 'done' && store.current.status !== 'cancelled'" class="pl-9">
          <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <svg class="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span class="text-xs text-red-600 dark:text-red-400 font-medium">此任务已逾期</span>
          </div>
        </div>

        <!-- Related Note Link (if any) -->
        <div v-if="store.current.relatedNoteId" class="pl-9 pb-2">
            <div class="w-full flex items-center justify-between p-3 rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 group cursor-pointer hover:bg-[var(--color-accent)]/10 transition-colors" @click="openNote">
                 <div class="flex items-center gap-2">
                     <div class="w-8 h-8 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-accent)] shadow-sm">
                         <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                     </div>
                     <div>
                         <p class="text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors">关联知识笔记</p>
                         <p class="text-[10px] text-[var(--color-text-muted)] mt-0.5">点击前往查看原始上下文</p>
                     </div>
                 </div>
                 <svg class="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                 </svg>
            </div>
        </div>

        <!-- Focus Section -->
        <div v-if="store.current.status !== 'done' && store.current.status !== 'cancelled'" class="pl-9">
          <div v-if="focusStore.isRunning && focusStore.currentTaskId === store.current.id" class="p-4 rounded-xl bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-[var(--color-accent)]">专注中</span>
              <button class="text-xs text-red-500 hover:underline cursor-pointer" @click="focusStore.cancelTimer()">结束</button>
            </div>
            <div class="text-2xl font-bold text-[var(--color-text-primary)] tabular-nums text-center">
              {{ String(Math.floor(focusStore.remainingSeconds / 60)).padStart(2, '0') }}:{{ String(focusStore.remainingSeconds % 60).padStart(2, '0') }}
            </div>
          </div>
          <button
            v-else-if="!focusStore.isRunning"
            class="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed
                   border-[var(--color-border)] text-sm text-[var(--color-text-secondary)]
                   hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]
                   cursor-pointer transition-colors"
            @click="startFocusOnTask"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            开始专注
            <span v-if="taskFocusMinutes > 0" class="text-[10px] text-[var(--color-text-muted)]">
              (已累计 {{ taskFocusMinutes }} 分钟)
            </span>
          </button>
        </div>

        <hr class="border-[var(--color-border)] ml-9" />

        <!-- Description -->
        <div class="pl-9 h-full">
          <textarea :value="store.current.description" @input="onDescInput(($event.target as HTMLTextAreaElement).value)" placeholder="添加描述 (可选)..." class="w-full min-h-[300px] text-sm leading-relaxed resize-none
                    text-[var(--color-text-secondary)] placeholder:text-[var(--color-text-muted)]
                    bg-transparent border-none outline-none" />
        </div>
      </div>
    </div>

    <!-- Delete confirmation -->
    <ConfirmModal :visible="showDeleteModal" title="删除任务" message="确定要删除这个任务吗？" confirmText="删除" @confirm="deleteTask" @cancel="showDeleteModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '../store'
import { useFocusStore } from '@/domains/focus/store'
import {
  TASK_STATUS_LABELS,
  type TaskStatus,
  TASK_PRIORITY_LABELS,
  type TaskPriority,
} from '../model'
import TagInput from '@/shared/ui/TagInput.vue'
import ConfirmModal from '@/shared/ui/ConfirmModal.vue'
import AppEmptyState from '@/shared/ui/AppEmptyState.vue'
import AppEditorHeader from '@/shared/ui/AppEditorHeader.vue'

const store = useTaskStore()
const focusStore = useFocusStore()
const route = useRoute()
const router = useRouter()
const taskFocusMinutes = ref(0)

const showDeleteModal = ref(false)
const saveStatus = ref<'saving' | 'saved' | null>(null)

let saveTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => route.params.id,
  async (id) => {
    if (id && typeof id === 'string') {
      await store.open(id)
      taskFocusMinutes.value = await focusStore.getTaskFocusMinutes(id)
    }
  },
  { immediate: true }
)

function startFocusOnTask() {
  if (store.current) {
    focusStore.startTimer(25, store.current.id, store.current.title)
  }
}

const dueDateStr = computed(() => {
  if (!store.current?.dueDate) return ''
  const d = new Date(store.current.dueDate)
  return d.toISOString().split('T')[0]
})

const isOverdue = computed(() => {
  if (!store.current?.dueDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return store.current.dueDate < today.getTime()
})

function scheduleSave(patch: Parameters<typeof store.updateCurrent>[0]) {
  saveStatus.value = 'saving'

  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    await store.updateCurrent(patch)
    saveStatus.value = 'saved'
    setTimeout(() => {
      saveStatus.value = null
    }, 1500)
  }, 800)
}

function onTitleInput(value: string) {
  if (store.current) {
    store.current.title = value
    scheduleSave({ title: value })
  }
}

function onDescInput(value: string) {
  if (store.current) {
    store.current.description = value
    scheduleSave({ description: value })
  }
}

function onTagsChange(tags: string[]) {
  if (store.current) {
    store.current.tags = tags
    scheduleSave({ tags })
  }
}

function changeStatus(status: TaskStatus) {
  if (store.current) {
    store.current.status = status
    scheduleSave({ status })
  }
}

function changePriority(priority: TaskPriority) {
  if (store.current) {
    store.current.priority = priority
    scheduleSave({ priority })
  }
}

function toggleDone() {
  if (store.current) {
    const newStatus = store.current.status === 'done' ? 'todo' : 'done'
    store.current.status = newStatus
    scheduleSave({ status: newStatus })
  }
}

function onDueDateChange(value: string) {
  if (store.current) {
    if (value) {
      const ts = new Date(value + 'T23:59:59').getTime()
      store.current.dueDate = ts
      scheduleSave({ dueDate: ts })
    } else {
      clearDueDate()
    }
  }
}

function clearDueDate() {
  if (store.current) {
    store.current.dueDate = undefined
    scheduleSave({ dueDate: undefined })
  }
}

async function deleteTask() {
  if (!store.current) return
  await store.remove(store.current.id)
  showDeleteModal.value = false
  router.push('/tasks')
}

function openNote() {
  if (store.current?.relatedNoteId) {
    router.push(`/knowledge/${store.current.relatedNoteId}`)
  }
}
</script>
