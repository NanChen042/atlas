import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FocusSession } from './model'
import * as service from './service'

export const useFocusStore = defineStore('focus', () => {
    const sessions = ref<FocusSession[]>([])
    const todaySessions = ref(0)
    const todayMinutes = ref(0)
    const weekStats = ref<{ date: string; minutes: number }[]>([])

    const isRunning = ref(false)
    const currentTaskId = ref<string | undefined>()
    const currentTaskTitle = ref<string | undefined>()
    const currentDuration = ref(25)
    const remainingSeconds = ref(0)
    const timerMode = ref<'work' | 'break'>('work')

    let _interval: ReturnType<typeof setInterval> | null = null
    let _startTime = 0

    async function loadStats() {
        const stats = await service.getTodayStats()
        todaySessions.value = stats.sessions
        todayMinutes.value = stats.minutes
        weekStats.value = await service.getWeekStats()
        sessions.value = await service.listSessions()
    }

    function startTimer(duration: number, taskId?: string, taskTitle?: string) {
        if (isRunning.value) return
        currentDuration.value = duration
        currentTaskId.value = taskId
        currentTaskTitle.value = taskTitle
        remainingSeconds.value = duration * 60
        timerMode.value = 'work'
        isRunning.value = true
        _startTime = Date.now()

        _interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - _startTime) / 1000)
            remainingSeconds.value = Math.max(0, duration * 60 - elapsed)

            if (remainingSeconds.value <= 0) {
                completeTimer()
            }
        }, 200)
    }

    async function completeTimer() {
        stopInterval()
        isRunning.value = false

        if (timerMode.value === 'work') {
            const actualMinutes = currentDuration.value
            await service.recordSession(
                currentDuration.value,
                actualMinutes,
                currentTaskId.value,
                currentTaskTitle.value,
            )
            await loadStats()

            playCompletionSound()

            timerMode.value = 'break'
            remainingSeconds.value = 5 * 60
        } else {
            timerMode.value = 'work'
            remainingSeconds.value = 0
        }
    }

    function cancelTimer() {
        stopInterval()

        if (isRunning.value && timerMode.value === 'work') {
            const elapsedMinutes = Math.round((currentDuration.value * 60 - remainingSeconds.value) / 60)
            if (elapsedMinutes >= 1) {
                service.recordSession(
                    currentDuration.value,
                    elapsedMinutes,
                    currentTaskId.value,
                    currentTaskTitle.value,
                ).then(() => loadStats())
            }
        }

        isRunning.value = false
        remainingSeconds.value = 0
        timerMode.value = 'work'
    }

    function startBreak() {
        if (isRunning.value) return
        remainingSeconds.value = 5 * 60
        timerMode.value = 'break'
        isRunning.value = true
        _startTime = Date.now()

        _interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - _startTime) / 1000)
            remainingSeconds.value = Math.max(0, 5 * 60 - elapsed)
            if (remainingSeconds.value <= 0) {
                stopInterval()
                isRunning.value = false
                timerMode.value = 'work'
                playCompletionSound()
            }
        }, 200)
    }

    function stopInterval() {
        if (_interval) {
            clearInterval(_interval)
            _interval = null
        }
    }

    function playCompletionSound() {
        try {
            const ctx = new AudioContext()
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.frequency.setValueAtTime(800, ctx.currentTime)
            osc.frequency.setValueAtTime(1000, ctx.currentTime + 0.1)
            osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.2)
            gain.gain.setValueAtTime(0.3, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
            osc.start()
            osc.stop(ctx.currentTime + 0.5)
        } catch {
            // Audio not available
        }
    }

    async function getTaskFocusMinutes(taskId: string): Promise<number> {
        return service.getTaskFocusMinutes(taskId)
    }

    return {
        sessions,
        todaySessions,
        todayMinutes,
        weekStats,
        isRunning,
        currentTaskId,
        currentTaskTitle,
        currentDuration,
        remainingSeconds,
        timerMode,
        loadStats,
        startTimer,
        completeTimer,
        cancelTimer,
        startBreak,
        getTaskFocusMinutes,
    }
})
