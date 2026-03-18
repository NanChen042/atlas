import type { App } from 'vue'
import { initDB as initKnowledgeDB } from '@/domains/knowledge/repository'
import { initDB as initTasksDB } from '@/domains/tasks/repository'
import { initDB as initHabitsDB } from '@/domains/habits/repository'
import { initDB as initFocusDB } from '@/domains/focus/repository'

export async function bootstrap(_app: App) {
    await initStorage()
    initTheme()
    initStreak()
}

async function initStorage() {
    try {
        await Promise.all([
            initKnowledgeDB(),
            initTasksDB(),
            initHabitsDB(),
            initFocusDB(),
        ])
        console.log('[Atlas] Storage initialized')
    } catch (err) {
        console.error('[Atlas] Failed to initialize storage:', err)
    }
}

function initTheme() {
    const stored = localStorage.getItem('atlas-theme')
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
    }
}

function initStreak() {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    const dates: string[] = JSON.parse(localStorage.getItem('atlas-activity-dates') || '[]')
    if (!dates.includes(dateStr)) {
        dates.push(dateStr)
        if (dates.length > 365) dates.splice(0, dates.length - 365)
        localStorage.setItem('atlas-activity-dates', JSON.stringify(dates))
    }
}
