<!-- src/shared/ui/WeeklyChart.vue -->
<template>
  <div class="w-full">
    <div class="flex items-end gap-1.5 h-32">
      <div
        v-for="(day, i) in data"
        :key="i"
        class="flex-1 flex flex-col items-center gap-1"
      >
        <!-- Bar -->
        <div class="w-full flex flex-col items-center justify-end flex-1 relative">
          <span v-if="day.value > 0" class="text-[9px] text-[var(--color-text-muted)] mb-1">
            {{ day.value }}
          </span>
          <div
            :class="[
              'w-full rounded-t-md transition-all duration-500 ease-out',
              i === data.length - 1 ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-accent)]/40',
            ]"
            :style="{ height: barHeight(day.value), minHeight: day.value > 0 ? '4px' : '2px' }"
          />
        </div>
        <!-- Label -->
        <span class="text-[10px] text-[var(--color-text-muted)]">
          {{ dayLabel(day.date) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  data: { date: string; value: number }[]
}>()

const maxValue = computed(() => Math.max(...props.data.map(d => d.value), 1))

function barHeight(value: number): string {
  if (value === 0) return '2px'
  const percent = (value / maxValue.value) * 100
  return `${Math.max(percent, 5)}%`
}

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const days = ['日', '一', '二', '三', '四', '五', '六']
  return days[d.getDay()]!
}
</script>
