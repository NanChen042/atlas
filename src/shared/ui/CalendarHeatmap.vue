<!-- src/shared/ui/CalendarHeatmap.vue -->
<template>
  <div>
    <h3 class="text-sm font-semibold text-[var(--color-text-primary)] mb-3">活动热力图</h3>
    <div class="overflow-x-auto">
      <div class="flex gap-0.5" style="min-width: fit-content;">
        <div v-for="(week, wi) in grid" :key="wi" class="flex flex-col gap-0.5">
          <div
            v-for="(day, di) in week"
            :key="di"
            :class="[
              'w-3 h-3 rounded-sm transition-colors',
              day.level === 0 ? 'bg-[var(--color-surface-alt)]' :
              day.level === 1 ? 'bg-emerald-200 dark:bg-emerald-900/60' :
              day.level === 2 ? 'bg-emerald-400 dark:bg-emerald-700' :
              day.level === 3 ? 'bg-emerald-500 dark:bg-emerald-600' :
              'bg-emerald-700 dark:bg-emerald-500'
            ]"
            :title="`${day.date}: ${day.count} 个习惯完成`"
          />
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2 mt-2 justify-end">
      <span class="text-[10px] text-[var(--color-text-muted)]">少</span>
      <div class="w-3 h-3 rounded-sm bg-[var(--color-surface-alt)]" />
      <div class="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/60" />
      <div class="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-700" />
      <div class="w-3 h-3 rounded-sm bg-emerald-700 dark:bg-emerald-500" />
      <span class="text-[10px] text-[var(--color-text-muted)]">多</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HabitLog, Habit } from '@/domains/habits/model'

const props = defineProps<{
  logs: HabitLog[]
  habits: Habit[]
}>()

const grid = computed(() => {
  const weeks: { date: string; count: number; level: number }[][] = []
  const today = new Date()

  const countByDate = new Map<string, number>()
  for (const log of props.logs) {
    countByDate.set(log.date, (countByDate.get(log.date) || 0) + 1)
  }

  const totalHabits = Math.max(props.habits.length, 1)
  const totalDays = 12 * 7

  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - totalDays + 1)
  const startDay = startDate.getDay()
  startDate.setDate(startDate.getDate() - startDay)

  let currentWeek: { date: string; count: number; level: number }[] = []

  for (let i = 0; i <= totalDays + startDay; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const count = countByDate.get(dateStr) || 0
    const ratio = count / totalHabits

    let level = 0
    if (ratio > 0 && ratio < 0.33) level = 1
    else if (ratio >= 0.33 && ratio < 0.66) level = 2
    else if (ratio >= 0.66 && ratio < 1) level = 3
    else if (ratio >= 1) level = 4

    if (d > today) level = 0

    currentWeek.push({ date: dateStr, count, level })

    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  return weeks
})
</script>
