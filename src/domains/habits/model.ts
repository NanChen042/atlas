export type HabitFrequency = 'daily' | 'weekdays' | 'weekends'

export interface Habit {
    id: string
    title: string
    icon: string
    frequency: HabitFrequency
    createdAt: number
    updatedAt: number
}

export interface HabitLog {
    id: string
    habitId: string
    date: string
    completedAt: number
}

export const FREQUENCY_LABELS: Record<HabitFrequency, string> = {
    daily: '每天',
    weekdays: '工作日',
    weekends: '周末',
}

export const HABIT_ICONS = [
    '📚', '🏃', '💪', '🧘', '✍️', '💧', '🎯', '🌅',
    '🎵', '🎨', '💤', '🥗', '🧹', '📝', '🧠', '❤️',
]
