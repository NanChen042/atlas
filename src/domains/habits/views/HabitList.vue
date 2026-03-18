<!-- src/domains/habits/views/HabitList.vue -->
<template>
  <div class="h-full flex flex-col bg-[var(--color-surface)]">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-[var(--color-border)]">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-sm font-semibold text-[var(--color-text-primary)]">今日习惯</h3>
        <span class="text-[10px] px-2 py-0.5 rounded-full font-medium"
              :class="store.todayProgress.percent === 100
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)]'">
          {{ store.todayProgress.done }}/{{ store.todayProgress.total }}
        </span>
      </div>
      <div class="w-full bg-[var(--color-surface-alt)] rounded-full h-1.5 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500 ease-out"
          :class="store.todayProgress.percent === 100 ? 'bg-emerald-500' : 'bg-[var(--color-accent)]'"
          :style="{ width: `${store.todayProgress.percent}%` }"
        />
      </div>
    </div>

    <!-- Habits List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="store.habitsWithStatus.length === 0" class="px-4 py-12 text-center">
        <div class="text-3xl mb-3">🎯</div>
        <p class="text-sm text-[var(--color-text-muted)]">还没有设定习惯</p>
      </div>

      <ul v-else class="divide-y divide-[var(--color-border)]">
        <li
          v-for="habit in store.habitsWithStatus"
          :key="habit.id"
          :class="[
            'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-[var(--color-surface-hover)]',
            !habit.shouldTrack && 'opacity-40'
          ]"
          @click="store.toggle(habit.id)"
        >
          <div :class="[
            'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm transition-all',
            habit.completedToday
              ? 'bg-emerald-500 text-white'
              : 'bg-[var(--color-surface-alt)]'
          ]">
            <span v-if="habit.completedToday" class="text-xs font-bold">✓</span>
            <span v-else>{{ habit.icon }}</span>
          </div>

          <div class="flex-1 min-w-0">
            <p :class="[
              'text-sm font-medium truncate',
              habit.completedToday ? 'text-[var(--color-text-muted)] line-through' : 'text-[var(--color-text-primary)]'
            ]">
              {{ habit.title }}
            </p>
          </div>

          <span v-if="habit.streak > 0" class="text-[10px] font-medium text-amber-500 shrink-0">
            🔥{{ habit.streak }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Footer -->
    <div class="px-4 py-2 border-t border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)]">
      共 {{ store.habits.length }} 个习惯
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHabitStore } from '../store'

const store = useHabitStore()

onMounted(() => {
  store.loadAll()
})
</script>
