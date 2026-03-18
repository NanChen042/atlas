import {
    listSessions,
    getSessionsForDate,
    getSessionsForTask,
    saveSession,
} from './repository'
import type { FocusSession } from './model'

export function getTodayStr(): string {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getDateStr(offsetDays: number): string {
    const d = new Date()
    d.setDate(d.getDate() + offsetDays)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export async function recordSession(
    duration: number,
    actualMinutes: number,
    taskId?: string,
    taskTitle?: string,
): Promise<FocusSession> {
    const session: FocusSession = {
        id: crypto.randomUUID(),
        taskId,
        taskTitle,
        duration,
        actualMinutes,
        completedAt: Date.now(),
        date: getTodayStr(),
    }
    await saveSession(session)
    return session
}

export async function getTodayStats(): Promise<{ sessions: number; minutes: number }> {
    const sessions = await getSessionsForDate(getTodayStr())
    return {
        sessions: sessions.length,
        minutes: sessions.reduce((sum, s) => sum + s.actualMinutes, 0),
    }
}

export async function getWeekStats(): Promise<{ date: string; minutes: number }[]> {
    const results: { date: string; minutes: number }[] = []
    for (let i = 6; i >= 0; i--) {
        const date = getDateStr(-i)
        const sessions = await getSessionsForDate(date)
        results.push({
            date,
            minutes: sessions.reduce((sum, s) => sum + s.actualMinutes, 0),
        })
    }
    return results
}

export async function getTaskFocusMinutes(taskId: string): Promise<number> {
    const sessions = await getSessionsForTask(taskId)
    return sessions.reduce((sum, s) => sum + s.actualMinutes, 0)
}

export { listSessions, getSessionsForDate, getSessionsForTask }
