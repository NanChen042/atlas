<!-- src/domains/dashboard/views/DashboardView.vue -->
<template>
  <div class="h-full overflow-y-auto bg-[var(--color-surface)]">
    <div class="max-w-5xl mx-auto px-6 py-8">

      <!-- Greeting -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">
            {{ greeting }}
          </h1>
          <p class="text-sm text-[var(--color-text-muted)] mt-1">
            {{ todayFormatted }}
          </p>
        </div>
        <StreakBadge :days="streakDays" />
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Left Column (2 cols) -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Today's Tasks -->
          <section class="bg-[var(--color-surface-alt)] rounded-2xl p-5 border border-[var(--color-border)]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs">📋</span>
                今日任务
              </h2>
              <RouterLink to="/tasks" class="text-xs text-[var(--color-accent)] hover:underline">查看全部</RouterLink>
            </div>

            <div v-if="todayTasks.length === 0" class="text-center py-6">
              <p class="text-sm text-[var(--color-text-muted)]">今天没有待办任务 🎉</p>
            </div>

            <ul v-else class="space-y-2">
              <li
                v-for="task in todayTasks.slice(0, 5)"
                :key="task.id"
                class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors group"
              >
                <div
                  :class="[
                    'w-5 h-5 rounded-full border shrink-0 flex items-center justify-center cursor-pointer transition-all',
                    task.status === 'done' ? 'bg-emerald-500 border-emerald-500' : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                  ]"
                  @click="toggleTask(task)"
                >
                  <svg v-if="task.status === 'done'" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <RouterLink :to="`/tasks/${task.id}`" :class="[
                  'flex-1 text-sm truncate',
                  task.status === 'done' ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]'
                ]">
                  {{ task.title || '无标题任务' }}
                </RouterLink>

                <span v-if="task.dueDate" :class="[
                  'text-[10px] shrink-0',
                  isOverdue(task) ? 'text-red-500' : 'text-[var(--color-text-muted)]'
                ]">
                  {{ formatDueDate(task.dueDate) }}
                </span>

                <span :class="[
                  'text-[10px] px-1.5 py-0.5 rounded shrink-0',
                  task.priority === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    : task.priority === 'medium' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                ]">
                  {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}
                </span>
              </li>
            </ul>
          </section>

          <!-- Habits -->
          <section class="bg-[var(--color-surface-alt)] rounded-2xl p-5 border border-[var(--color-border)]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs">🎯</span>
                今日习惯
                <span v-if="habitStore.todayProgress.total > 0" class="text-[10px] font-normal text-[var(--color-text-muted)]">
                  {{ habitStore.todayProgress.done }}/{{ habitStore.todayProgress.total }}
                </span>
              </h2>
              <RouterLink to="/habits" class="text-xs text-[var(--color-accent)] hover:underline">管理</RouterLink>
            </div>

            <div v-if="habitStore.habitsWithStatus.length === 0" class="text-center py-6">
              <p class="text-sm text-[var(--color-text-muted)]">还没有设定习惯</p>
              <RouterLink to="/habits" class="text-xs text-[var(--color-accent)] hover:underline mt-1 inline-block">去创建</RouterLink>
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                v-for="habit in habitStore.habitsWithStatus.filter(h => h.shouldTrack)"
                :key="habit.id"
                :class="[
                  'flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all text-left',
                  habit.completedToday
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
                ]"
                @click="habitStore.toggle(habit.id)"
              >
                <span :class="[
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm transition-all',
                  habit.completedToday ? 'bg-emerald-500 text-white' : 'bg-[var(--color-surface-alt)]'
                ]">
                  {{ habit.completedToday ? '✓' : habit.icon }}
                </span>
                <div class="min-w-0">
                  <p :class="[
                    'text-xs font-medium truncate',
                    habit.completedToday ? 'text-emerald-700 dark:text-emerald-300 line-through' : 'text-[var(--color-text-primary)]'
                  ]">{{ habit.title }}</p>
                  <p v-if="habit.streak > 0" class="text-[10px] text-amber-500">🔥 {{ habit.streak }}</p>
                </div>
              </button>
            </div>
          </section>

          <!-- Weekly Focus Chart -->
          <section class="bg-[var(--color-surface-alt)] rounded-2xl p-5 border border-[var(--color-border)]">
            <h2 class="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 text-xs">📊</span>
              本周专注时长 (分钟)
            </h2>
            <WeeklyChart :data="weeklyChartData" />
          </section>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">

          <!-- Pomodoro Timer -->
          <section class="bg-[var(--color-surface-alt)] rounded-2xl p-5 border border-[var(--color-border)]">
            <h2 class="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 text-xs">⏱</span>
              番茄钟
            </h2>
            <PomodoroTimer />
          </section>

          <!-- Quick Stats -->
          <section class="bg-[var(--color-surface-alt)] rounded-2xl p-5 border border-[var(--color-border)]">
            <h2 class="text-sm font-semibold text-[var(--color-text-primary)] mb-4">本周总览</h2>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p class="text-2xl font-bold text-[var(--color-accent)]">{{ weekTasksDone }}</p>
                <p class="text-[11px] text-[var(--color-text-muted)] mt-0.5">任务完成</p>
              </div>
              <div class="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p class="text-2xl font-bold text-emerald-500">{{ weekFocusMinutes }}</p>
                <p class="text-[11px] text-[var(--color-text-muted)] mt-0.5">专注分钟</p>
              </div>
              <div class="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p class="text-2xl font-bold text-sky-500">{{ knowledgeStore.notes.length }}</p>
                <p class="text-[11px] text-[var(--color-text-muted)] mt-0.5">知识笔记</p>
              </div>
              <div class="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p class="text-2xl font-bold text-amber-500">{{ habitStore.todayProgress.percent }}%</p>
                <p class="text-[11px] text-[var(--color-text-muted)] mt-0.5">习惯完成率</p>
              </div>
            </div>
          </section>

          <!-- Recent Notes -->
          <section class="bg-[var(--color-surface-alt)] rounded-2xl p-5 border border-[var(--color-border)]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-semibold text-[var(--color-text-primary)]">最近笔记</h2>
              <RouterLink to="/knowledge" class="text-xs text-[var(--color-accent)] hover:underline">全部</RouterLink>
            </div>
            <div v-if="recentNotes.length === 0" class="text-center py-4">
              <p class="text-xs text-[var(--color-text-muted)]">暂无笔记</p>
            </div>
            <ul v-else class="space-y-1.5">
              <li v-for="note in recentNotes" :key="note.id">
                <RouterLink
                  :to="`/knowledge/${note.id}`"
                  class="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <span class="text-sm">📄</span>
                  <span class="text-xs text-[var(--color-text-primary)] truncate flex-1">{{ note.title || '无标题' }}</span>
                  <span class="text-[10px] text-[var(--color-text-muted)] shrink-0">{{ formatTime(note.updatedAt) }}</span>
                </RouterLink>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTaskStore } from '@/domains/tasks/store'
import { useKnowledgeStore } from '@/domains/knowledge/store'
import { useHabitStore } from '@/domains/habits/store'
import { useFocusStore } from '@/domains/focus/store'
import type { Task } from '@/domains/tasks/model'
import PomodoroTimer from '@/shared/ui/PomodoroTimer.vue'
import WeeklyChart from '@/shared/ui/WeeklyChart.vue'
import StreakBadge from '@/shared/ui/StreakBadge.vue'

const taskStore = useTaskStore()
const knowledgeStore = useKnowledgeStore()
const habitStore = useHabitStore()
const focusStore = useFocusStore()

onMounted(async () => {
  await Promise.all([
    taskStore.loadList(),
    knowledgeStore.loadList(),
    habitStore.loadAll(),
    focusStore.loadStats(),
  ])
  recordActivity()
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const todayFormatted = computed(() => {
  const d = new Date()
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日 ${weekdays[d.getDay()]}`
})

const todayTasks = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayEnd = new Date(today)
  todayEnd.setDate(todayEnd.getDate() + 1)

  return taskStore.tasks.filter(t => {
    if (t.status === 'cancelled') return false
    if (t.status === 'in-progress') return true
    if (t.status === 'todo') return true
    if (t.status === 'done') {
      return t.updatedAt >= today.getTime() && t.updatedAt < todayEnd.getTime()
    }
    return false
  }).sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return 1
    if (a.status !== 'done' && b.status === 'done') return -1
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
})

const recentNotes = computed(() => knowledgeStore.notes.slice(0, 5))

const weeklyChartData = computed(() =>
  focusStore.weekStats.map(s => ({ date: s.date, value: s.minutes }))
)

const weekFocusMinutes = computed(() =>
  focusStore.weekStats.reduce((sum, s) => sum + s.minutes, 0)
)

const weekTasksDone = computed(() => {
  const weekAgo = Date.now() - 7 * 86400_000
  return taskStore.tasks.filter(t => t.status === 'done' && t.updatedAt >= weekAgo).length
})

const streakDays = computed(() => {
  const dates: string[] = JSON.parse(localStorage.getItem('atlas-activity-dates') || '[]')
  if (dates.length === 0) return 0

  const sorted = [...dates].sort().reverse()
  const today = getDateStr(0)
  const yesterday = getDateStr(-1)

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0

  let streak = 0
  let expected = sorted[0]
  for (const date of sorted) {
    if (date === expected) {
      streak++
      const d = new Date(expected + 'T00:00:00')
      d.setDate(d.getDate() - 1)
      expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    } else if (date < expected) {
      break
    }
  }
  return streak
})

function recordActivity() {
  const today = getDateStr(0)
  const dates: string[] = JSON.parse(localStorage.getItem('atlas-activity-dates') || '[]')
  if (!dates.includes(today)) {
    dates.push(today)
    if (dates.length > 365) dates.splice(0, dates.length - 365)
    localStorage.setItem('atlas-activity-dates', JSON.stringify(dates))
  }
}

function getDateStr(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function toggleTask(task: Task) {
  taskStore.updateStatus(task.id, task.status === 'done' ? 'todo' : 'done')
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

function formatTime(ts: number): string {
  const diff = Date.now() - ts
  if (diff < 60_000) return '刚刚'
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}分钟前`
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)}小时前`
  return new Date(ts).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}
</script>
