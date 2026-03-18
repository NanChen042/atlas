<!-- src/domains/habits/views/HabitTracker.vue -->
<template>
  <div class="h-full overflow-y-auto bg-[var(--color-surface)]">
    <div class="max-w-3xl mx-auto px-6 py-8 space-y-8">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-[var(--color-text-primary)]">习惯追踪</h2>
          <p class="text-sm text-[var(--color-text-muted)] mt-1">
            今日进度: {{ store.todayProgress.done }}/{{ store.todayProgress.total }}
          </p>
        </div>
        <button
          class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium
                 bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white
                 cursor-pointer transition-colors active:scale-[0.98]"
          @click="showCreate = true"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          新习惯
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="store.todayProgress.total > 0" class="w-full bg-[var(--color-surface-alt)] rounded-full h-2.5 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500 ease-out"
          :class="store.todayProgress.percent === 100 ? 'bg-emerald-500' : 'bg-[var(--color-accent)]'"
          :style="{ width: `${store.todayProgress.percent}%` }"
        />
      </div>

      <!-- Habit Cards -->
      <div v-if="store.habitsWithStatus.length === 0" class="text-center py-16">
        <div class="text-5xl mb-4">🎯</div>
        <p class="text-[var(--color-text-muted)] text-sm">还没有设定习惯</p>
        <p class="text-[var(--color-text-muted)] text-xs mt-1">点击上方「新习惯」开始追踪你的每日目标</p>
      </div>

      <div v-else class="grid gap-3">
        <div
          v-for="habit in store.habitsWithStatus"
          :key="habit.id"
          :class="[
            'flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group',
            habit.completedToday
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
              : 'bg-[var(--color-surface)] border-[var(--color-border)] hover:border-[var(--color-accent)]/50',
            !habit.shouldTrack && 'opacity-50'
          ]"
          @click="store.toggle(habit.id)"
        >
          <!-- Checkbox -->
          <div :class="[
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all text-lg',
            habit.completedToday
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900'
              : 'bg-[var(--color-surface-alt)]'
          ]">
            <span v-if="habit.completedToday">✓</span>
            <span v-else>{{ habit.icon }}</span>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h3 :class="[
              'text-sm font-semibold',
              habit.completedToday ? 'text-emerald-700 dark:text-emerald-300 line-through' : 'text-[var(--color-text-primary)]'
            ]">
              {{ habit.title }}
            </h3>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-[11px] text-[var(--color-text-muted)]">{{ FREQUENCY_LABELS[habit.frequency] }}</span>
              <span v-if="habit.streak > 0" class="text-[11px] font-medium text-amber-500 flex items-center gap-0.5">
                🔥 {{ habit.streak }} 天
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              class="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-text-muted)]
                     hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] cursor-pointer"
              @click.stop="startEdit(habit)"
              title="编辑"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            </button>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-text-muted)]
                     hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 cursor-pointer"
              @click.stop="confirmDelete(habit.id)"
              title="删除"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Heatmap -->
      <CalendarHeatmap v-if="store.habits.length > 0" :logs="store.logs" :habits="store.habits" />

    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showCreate || editingHabit" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="closeModal">
          <div class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-[modal-in_0.2s_ease-out]">
            <h3 class="text-base font-semibold text-[var(--color-text-primary)] mb-4">
              {{ editingHabit ? '编辑习惯' : '新建习惯' }}
            </h3>

            <div class="space-y-4">
              <div>
                <label class="text-xs font-medium text-[var(--color-text-secondary)] mb-1 block">图标</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="icon in HABIT_ICONS"
                    :key="icon"
                    :class="[
                      'w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all text-lg',
                      formIcon === icon
                        ? 'bg-[var(--color-accent)]/20 ring-2 ring-[var(--color-accent)] scale-110'
                        : 'bg-[var(--color-surface-alt)] hover:bg-[var(--color-surface-hover)]'
                    ]"
                    @click="formIcon = icon"
                  >{{ icon }}</button>
                </div>
              </div>

              <div>
                <label class="text-xs font-medium text-[var(--color-text-secondary)] mb-1 block">名称</label>
                <input
                  v-model="formTitle"
                  type="text"
                  placeholder="例如：阅读 30 分钟"
                  class="w-full px-3 py-2 rounded-lg text-sm border border-[var(--color-border)]
                         bg-[var(--color-surface)] text-[var(--color-text-primary)]
                         placeholder:text-[var(--color-text-muted)]
                         focus:outline-none focus:border-[var(--color-accent)]"
                  @keydown.enter="saveHabit"
                />
              </div>

              <div>
                <label class="text-xs font-medium text-[var(--color-text-secondary)] mb-1 block">频率</label>
                <select
                  v-model="formFrequency"
                  class="w-full px-3 py-2 rounded-lg text-sm border border-[var(--color-border)]
                         bg-[var(--color-surface)] text-[var(--color-text-secondary)] cursor-pointer
                         focus:outline-none focus:border-[var(--color-accent)]"
                >
                  <option value="daily">每天</option>
                  <option value="weekdays">工作日</option>
                  <option value="weekends">周末</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-6">
              <button
                class="px-3 py-1.5 text-sm rounded-lg border border-[var(--color-border)]
                       text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]
                       cursor-pointer transition-colors"
                @click="closeModal"
              >取消</button>
              <button
                class="px-4 py-1.5 text-sm rounded-lg text-white
                       bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]
                       cursor-pointer transition-colors"
                :disabled="!formTitle.trim()"
                @click="saveHabit"
              >{{ editingHabit ? '保存' : '创建' }}</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete confirmation -->
    <ConfirmModal
      :visible="!!deletingId"
      title="删除习惯"
      message="确定要删除这个习惯吗？所有打卡记录也会被删除。"
      confirmText="删除"
      @confirm="doDelete"
      @cancel="deletingId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHabitStore } from '../store'
import { FREQUENCY_LABELS, HABIT_ICONS, type Habit, type HabitFrequency } from '../model'
import ConfirmModal from '@/shared/ui/ConfirmModal.vue'
import CalendarHeatmap from '@/shared/ui/CalendarHeatmap.vue'

const store = useHabitStore()

const showCreate = ref(false)
const editingHabit = ref<Habit | null>(null)
const deletingId = ref<string | null>(null)

const formTitle = ref('')
const formIcon = ref('🎯')
const formFrequency = ref<HabitFrequency>('daily')

function startEdit(habit: Habit) {
  editingHabit.value = habit
  formTitle.value = habit.title
  formIcon.value = habit.icon
  formFrequency.value = habit.frequency
}

function closeModal() {
  showCreate.value = false
  editingHabit.value = null
  formTitle.value = ''
  formIcon.value = '🎯'
  formFrequency.value = 'daily'
}

async function saveHabit() {
  if (!formTitle.value.trim()) return
  if (editingHabit.value) {
    await store.update(editingHabit.value.id, {
      title: formTitle.value.trim(),
      icon: formIcon.value,
      frequency: formFrequency.value,
    })
  } else {
    await store.create(formTitle.value.trim(), formIcon.value, formFrequency.value)
  }
  closeModal()
}

function confirmDelete(id: string) {
  deletingId.value = id
}

async function doDelete() {
  if (deletingId.value) {
    await store.remove(deletingId.value)
    deletingId.value = null
  }
}
</script>

<style scoped>
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
