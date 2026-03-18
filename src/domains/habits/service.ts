import {
    listHabits,
    getHabit,
    saveHabit,
    deleteHabit as repoDeleteHabit,
    getLogsForHabit,
    getLogsForDate,
    getAllLogs,
    saveLog,
    deleteLog,
} from './repository'
import type { Habit, HabitLog, HabitFrequency } from './model'

export async function createHabit(title: string, icon: string, frequency: HabitFrequency): Promise<Habit> {
    const now = Date.now()
    const habit: Habit = {
        id: crypto.randomUUID(),
        title,
        icon,
        frequency,
        createdAt: now,
        updatedAt: now,
    }
    await saveHabit(habit)
    return habit
}

export async function updateHabit(
    id: string,
    patch: Partial<Pick<Habit, 'title' | 'icon' | 'frequency'>>,
): Promise<Habit | null> {
    const habit = await getHabit(id)
    if (!habit) return null
    Object.assign(habit, patch, { updatedAt: Date.now() })
    await saveHabit(habit)
    return habit
}

export async function removeHabit(id: string): Promise<void> {
    await repoDeleteHabit(id)
}

export function getTodayStr(): string {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function toggleHabitForDate(habitId: string, date: string): Promise<boolean> {
    const logs = await getLogsForHabit(habitId)
    const existing = logs.find(l => l.date === date)
    if (existing) {
        await deleteLog(existing.id)
        return false
    } else {
        const log: HabitLog = {
            id: crypto.randomUUID(),
            habitId,
            date,
            completedAt: Date.now(),
        }
        await saveLog(log)
        return true
    }
}

export function calculateStreak(logs: HabitLog[]): number {
    if (logs.length === 0) return 0

    const dates = [...new Set(logs.map(l => l.date))].sort().reverse()
    const today = getTodayStr()
    const yesterday = getDateStr(-1)

    if (dates[0] !== today && dates[0] !== yesterday) return 0

    let streak = 0
    let currentDate = dates[0] === today ? today : yesterday

    for (const date of dates) {
        if (date === currentDate) {
            streak++
            currentDate = getDateStr(-1, new Date(currentDate + 'T00:00:00'))
        } else if (date < currentDate) {
            break
        }
    }
    return streak
}

function getDateStr(offsetDays: number, from?: Date): string {
    const d = from ? new Date(from) : new Date()
    d.setDate(d.getDate() + offsetDays)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function shouldTrackToday(habit: Habit): boolean {
    const day = new Date().getDay()
    if (habit.frequency === 'daily') return true
    if (habit.frequency === 'weekdays') return day >= 1 && day <= 5
    if (habit.frequency === 'weekends') return day === 0 || day === 6
    return true
}

export { listHabits, getHabit, getLogsForHabit, getLogsForDate, getAllLogs }
