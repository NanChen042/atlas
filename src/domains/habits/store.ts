import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Habit, HabitLog } from './model'
import * as service from './service'

export const useHabitStore = defineStore('habits', () => {
    const habits = ref<Habit[]>([])
    const logs = ref<HabitLog[]>([])
    const today = ref(service.getTodayStr())

    const todayLogs = computed(() => logs.value.filter(l => l.date === today.value))

    const habitsWithStatus = computed(() => {
        return habits.value.map(h => {
            const habitLogs = logs.value.filter(l => l.habitId === h.id)
            const completedToday = todayLogs.value.some(l => l.habitId === h.id)
            const streak = service.calculateStreak(habitLogs)
            const shouldTrack = service.shouldTrackToday(h)
            return { ...h, completedToday, streak, shouldTrack, totalLogs: habitLogs.length }
        })
    })

    const todayProgress = computed(() => {
        const trackable = habitsWithStatus.value.filter(h => h.shouldTrack)
        if (trackable.length === 0) return { done: 0, total: 0, percent: 0 }
        const done = trackable.filter(h => h.completedToday).length
        return { done, total: trackable.length, percent: Math.round((done / trackable.length) * 100) }
    })

    async function loadAll() {
        habits.value = await service.listHabits()
        logs.value = await service.getAllLogs()
        today.value = service.getTodayStr()
    }

    async function create(title: string, icon: string, frequency: Habit['frequency']) {
        const habit = await service.createHabit(title, icon, frequency)
        habits.value.push(habit)
        return habit
    }

    async function update(id: string, patch: Partial<Pick<Habit, 'title' | 'icon' | 'frequency'>>) {
        const updated = await service.updateHabit(id, patch)
        if (updated) {
            const idx = habits.value.findIndex(h => h.id === updated.id)
            if (idx >= 0) habits.value[idx] = updated
        }
    }

    async function remove(id: string) {
        await service.removeHabit(id)
        habits.value = habits.value.filter(h => h.id !== id)
        logs.value = logs.value.filter(l => l.habitId !== id)
    }

    async function toggle(habitId: string) {
        const date = today.value
        const completed = await service.toggleHabitForDate(habitId, date)
        if (completed) {
            logs.value.push({
                id: crypto.randomUUID(),
                habitId,
                date,
                completedAt: Date.now(),
            })
        } else {
            logs.value = logs.value.filter(l => !(l.habitId === habitId && l.date === date))
        }
        logs.value = await service.getAllLogs()
    }

    return {
        habits,
        logs,
        today,
        todayLogs,
        habitsWithStatus,
        todayProgress,
        loadAll,
        create,
        update,
        remove,
        toggle,
    }
})
