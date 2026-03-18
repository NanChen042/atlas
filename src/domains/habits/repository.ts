import { openDB, type IDBPDatabase } from 'idb'
import type { Habit, HabitLog } from './model'

const DB_NAME = 'atlas-db-habits'
const DB_VERSION = 1
const HABITS_STORE = 'habits'
const LOGS_STORE = 'habit-logs'

let _db: IDBPDatabase | null = null

async function getDB(): Promise<IDBPDatabase> {
    if (_db) return _db
    _db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(HABITS_STORE)) {
                db.createObjectStore(HABITS_STORE, { keyPath: 'id' })
            }
            if (!db.objectStoreNames.contains(LOGS_STORE)) {
                const logStore = db.createObjectStore(LOGS_STORE, { keyPath: 'id' })
                logStore.createIndex('habitId', 'habitId')
                logStore.createIndex('date', 'date')
                logStore.createIndex('habitDate', ['habitId', 'date'])
            }
        },
    })
    return _db
}

export async function initDB(): Promise<void> {
    await getDB()
}

export async function listHabits(): Promise<Habit[]> {
    const db = await getDB()
    const habits = await db.getAll(HABITS_STORE)
    return habits.sort((a, b) => a.createdAt - b.createdAt)
}

export async function getHabit(id: string): Promise<Habit | undefined> {
    const db = await getDB()
    return db.get(HABITS_STORE, id)
}

export async function saveHabit(habit: Habit): Promise<void> {
    const db = await getDB()
    await db.put(HABITS_STORE, habit)
}

export async function deleteHabit(id: string): Promise<void> {
    const db = await getDB()
    await db.delete(HABITS_STORE, id)
    const allLogs = await db.getAllFromIndex(LOGS_STORE, 'habitId', id)
    const tx = db.transaction(LOGS_STORE, 'readwrite')
    for (const log of allLogs) {
        await tx.store.delete(log.id)
    }
    await tx.done
}

export async function getLogsForHabit(habitId: string): Promise<HabitLog[]> {
    const db = await getDB()
    return db.getAllFromIndex(LOGS_STORE, 'habitId', habitId)
}

export async function getLogsForDate(date: string): Promise<HabitLog[]> {
    const db = await getDB()
    return db.getAllFromIndex(LOGS_STORE, 'date', date)
}

export async function getAllLogs(): Promise<HabitLog[]> {
    const db = await getDB()
    return db.getAll(LOGS_STORE)
}

export async function saveLog(log: HabitLog): Promise<void> {
    const db = await getDB()
    await db.put(LOGS_STORE, log)
}

export async function deleteLog(id: string): Promise<void> {
    const db = await getDB()
    await db.delete(LOGS_STORE, id)
}
