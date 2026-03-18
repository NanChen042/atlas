<!-- src/shared/ui/PomodoroTimer.vue -->
<template>
  <div class="flex flex-col items-center">
    <!-- Timer Ring -->
    <div class="relative w-48 h-48 mb-4">
      <svg class="w-full h-full -rotate-90" viewBox="0 0 200 200">
        <!-- Background circle -->
        <circle cx="100" cy="100" r="88" fill="none" stroke="var(--color-border)" stroke-width="6" />
        <!-- Progress circle -->
        <circle
          cx="100" cy="100" r="88" fill="none"
          :stroke="focusStore.timerMode === 'break' ? '#10b981' : 'var(--color-accent)'"
          stroke-width="6"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="progressOffset"
          class="transition-all duration-300 ease-linear"
        />
      </svg>

      <!-- Center Content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center">
        <span class="text-3xl font-bold tracking-wider text-[var(--color-text-primary)] tabular-nums">
          {{ displayMinutes }}:{{ displaySeconds }}
        </span>
        <span class="text-xs text-[var(--color-text-muted)] mt-1">
          {{ focusStore.timerMode === 'break' ? '休息中' : focusStore.isRunning ? '专注中' : '准备就绪' }}
        </span>
        <span v-if="focusStore.currentTaskTitle && focusStore.isRunning" class="text-[10px] text-[var(--color-accent)] mt-1 max-w-[120px] truncate">
          {{ focusStore.currentTaskTitle }}
        </span>
      </div>
    </div>

    <!-- Duration Selector (when not running) -->
    <div v-if="!focusStore.isRunning" class="flex items-center gap-2 mb-4">
      <button
        v-for="d in durations"
        :key="d"
        :class="[
          'px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors',
          selectedDuration === d
            ? 'bg-[var(--color-accent)] text-white'
            : 'bg-[var(--color-surface-alt)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
        ]"
        @click="selectedDuration = d"
      >{{ d }}min</button>
    </div>

    <!-- Task Selector (when not running, compact mode) -->
    <div v-if="!focusStore.isRunning && !compact && taskStore.tasks.length > 0" class="w-full max-w-[240px] mb-4">
      <select
        v-model="selectedTaskId"
        class="w-full px-3 py-2 rounded-lg text-xs border border-[var(--color-border)]
               bg-[var(--color-surface)] text-[var(--color-text-secondary)] cursor-pointer
               focus:outline-none focus:border-[var(--color-accent)]"
      >
        <option value="">不绑定任务</option>
        <option
          v-for="task in activeTasks"
          :key="task.id"
          :value="task.id"
        >{{ task.title || '无标题任务' }}</option>
      </select>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-3">
      <button
        v-if="!focusStore.isRunning"
        class="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold
               bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white
               cursor-pointer transition-all active:scale-95 shadow-lg shadow-[var(--color-accent)]/25"
        @click="startFocus"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
        开始专注
      </button>

      <template v-else>
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                 border-2 border-red-300 dark:border-red-700 text-red-500
                 hover:bg-red-50 dark:hover:bg-red-900/20
                 cursor-pointer transition-all active:scale-95"
          @click="focusStore.cancelTimer()"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          结束
        </button>
      </template>
    </div>

    <!-- Today Stats -->
    <div v-if="focusStore.todaySessions > 0" class="flex items-center gap-3 mt-4 text-[11px] text-[var(--color-text-muted)]">
      <span>今日 {{ focusStore.todaySessions }} 个番茄</span>
      <span>·</span>
      <span>{{ focusStore.todayMinutes }} 分钟</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFocusStore } from '@/domains/focus/store'
import { useTaskStore } from '@/domains/tasks/store'

const props = withDefaults(defineProps<{
  compact?: boolean
  taskId?: string
  taskTitle?: string
}>(), {
  compact: false,
})

const focusStore = useFocusStore()
const taskStore = useTaskStore()

const durations = [15, 25, 45]
const selectedDuration = ref(25)
const selectedTaskId = ref(props.taskId || '')
const circumference = 2 * Math.PI * 88

const activeTasks = computed(() =>
  taskStore.tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled')
)

const totalSeconds = computed(() => {
  if (focusStore.timerMode === 'break') return 5 * 60
  return focusStore.currentDuration * 60
})

const progressOffset = computed(() => {
  if (!focusStore.isRunning && focusStore.remainingSeconds === 0) return 0
  const progress = 1 - focusStore.remainingSeconds / totalSeconds.value
  return circumference * (1 - progress)
})

const displayMinutes = computed(() =>
  String(Math.floor(focusStore.remainingSeconds / 60)).padStart(2, '0')
)

const displaySeconds = computed(() =>
  String(focusStore.remainingSeconds % 60).padStart(2, '0')
)

function startFocus() {
  const taskId = props.taskId || selectedTaskId.value || undefined
  const taskTitle = props.taskTitle || (taskId ? activeTasks.value.find(t => t.id === taskId)?.title : undefined)
  focusStore.startTimer(selectedDuration.value, taskId, taskTitle)
}

onMounted(() => {
  focusStore.loadStats()
})
</script>
