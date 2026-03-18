<!-- src/domains/focus/views/FocusHistory.vue -->
<template>
  <div class="h-full overflow-y-auto bg-[var(--color-surface)]">
    <div class="max-w-4xl mx-auto px-6 py-8">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold text-[var(--color-text-primary)]">专注记录</h1>
          <p class="text-sm text-[var(--color-text-muted)] mt-1">追踪你的专注时间，提升效率</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Left Column (2 cols) -->
        <div class="lg:col-span-2 space-y-6">

          <!-- Today Stats -->
          <section class="bg-[var(--color-surface-alt)] rounded-2xl p-5 border border-[var(--color-border)]">
            <h2 class="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400 text-xs">📊</span>
              今日统计
            </h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
                <p class="text-3xl font-bold text-[var(--color-accent)]">{{ focusStore.todaySessions }}</p>
                <p class="text-xs text-[var(--color-text-muted)] mt-1">完成次数</p>
              </div>
              <div class="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center">
                <p class="text-3xl font-bold text-emerald-500">{{ focusStore.todayMinutes }}</p>
                <p class="text-xs text-[var(--color-text-muted)] mt-1">专注分钟</p>
              </div>
            </div>
          </section>

          <!-- Weekly Chart -->
          <section class="bg-[var(--color-surface-alt)] rounded-2xl p-5 border border-[var(--color-border)]">
            <h2 class="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-violet-600 dark:text-violet-400 text-xs">📈</span>
              本周专注时长 (分钟)
            </h2>
            <WeeklyChart :data="weeklyChartData" />
          </section>

          <!-- Session History -->
          <section class="bg-[var(--color-surface-alt)] rounded-2xl p-5 border border-[var(--color-border)]">
            <h2 class="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 text-xs">📋</span>
              最近记录
            </h2>

            <div v-if="focusStore.sessions.length === 0" class="text-center py-8">
              <p class="text-sm text-[var(--color-text-muted)]">还没有专注记录</p>
              <p class="text-xs text-[var(--color-text-muted)] mt-1">使用右侧番茄钟开始你的第一次专注吧！</p>
            </div>

            <ul v-else class="space-y-2">
              <li
                v-for="session in focusStore.sessions.slice(0, 20)"
                :key="session.id"
                class="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)]
                       bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <!-- Icon -->
                <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                             bg-rose-100 dark:bg-rose-900/30 text-rose-500 text-sm">
                  🍅
                </span>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-[var(--color-text-primary)] font-medium truncate">
                    {{ session.taskTitle || '自由专注' }}
                  </p>
                  <p class="text-[11px] text-[var(--color-text-muted)]">
                    {{ formatSessionDate(session.completedAt) }}
                  </p>
                </div>

                <!-- Duration -->
                <div class="text-right shrink-0">
                  <p class="text-sm font-semibold text-[var(--color-text-primary)]">{{ session.actualMinutes }} 分钟</p>
                  <p v-if="session.duration !== session.actualMinutes"
                     class="text-[10px] text-[var(--color-text-muted)]">
                    目标 {{ session.duration }} 分钟
                  </p>
                </div>

                <!-- Task link -->
                <RouterLink
                  v-if="session.taskId"
                  :to="`/tasks/${session.taskId}`"
                  class="text-[10px] text-[var(--color-accent)] hover:underline shrink-0"
                >
                  查看任务
                </RouterLink>
              </li>
            </ul>
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

          <!-- Week Summary -->
          <section class="bg-[var(--color-surface-alt)] rounded-2xl p-5 border border-[var(--color-border)]">
            <h2 class="text-sm font-semibold text-[var(--color-text-primary)] mb-3">本周总览</h2>
            <div class="space-y-3">
              <div class="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p class="text-2xl font-bold text-[var(--color-accent)]">{{ weekTotalSessions }}</p>
                <p class="text-[11px] text-[var(--color-text-muted)] mt-0.5">总完成次数</p>
              </div>
              <div class="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p class="text-2xl font-bold text-emerald-500">{{ weekTotalMinutes }}</p>
                <p class="text-[11px] text-[var(--color-text-muted)] mt-0.5">总专注分钟</p>
              </div>
              <div class="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                <p class="text-2xl font-bold text-amber-500">{{ avgDailyMinutes }}</p>
                <p class="text-[11px] text-[var(--color-text-muted)] mt-0.5">日均分钟</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useFocusStore } from '../store'
import PomodoroTimer from '@/shared/ui/PomodoroTimer.vue'
import WeeklyChart from '@/shared/ui/WeeklyChart.vue'

const focusStore = useFocusStore()

onMounted(() => {
  focusStore.loadStats()
})

const weeklyChartData = computed(() =>
  focusStore.weekStats.map(s => ({ date: s.date, value: s.minutes }))
)

const weekTotalMinutes = computed(() =>
  focusStore.weekStats.reduce((sum, s) => sum + s.minutes, 0)
)

const weekTotalSessions = computed(() =>
  focusStore.sessions.filter(s => {
    const weekAgo = Date.now() - 7 * 86400_000
    return s.completedAt >= weekAgo
  }).length
)

const avgDailyMinutes = computed(() => {
  const total = weekTotalMinutes.value
  return total > 0 ? Math.round(total / 7) : 0
})

function formatSessionDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sessionDay = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const diffDays = Math.round((today.getTime() - sessionDay.getTime()) / 86400_000)

  const time = d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

  if (diffDays === 0) return `今天 ${time}`
  if (diffDays === 1) return `昨天 ${time}`
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) + ' ' + time
}
</script>
