import { openDB, type IDBPDatabase } from 'idb'
import type { FocusSession } from './model'

const DB_NAME = 'atlas-db-focus'
const DB_VERSION = 1
const STORE = 'focus-sessions'

let _db: IDBPDatabase | null = null

async function getDB(): Promise<IDBPDatabase> {
    if (_db) return _db
    _db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE)) {
                const store = db.createObjectStore(STORE, { keyPath: 'id' })
                store.createIndex('date', 'date')
                store.createIndex('taskId', 'taskId')
            }
        },
    })
    return _db
}

export async function initDB(): Promise<void> {
    await getDB()
}

export async function listSessions(): Promise<FocusSession[]> {
    const db = await getDB()
    const sessions = await db.getAll(STORE)
    return sessions.sort((a, b) => b.completedAt - a.completedAt)
}

export async function getSessionsForDate(date: string): Promise<FocusSession[]> {
    const db = await getDB()
    return db.getAllFromIndex(STORE, 'date', date)
}

export async function getSessionsForTask(taskId: string): Promise<FocusSession[]> {
    const db = await getDB()
    return db.getAllFromIndex(STORE, 'taskId', taskId)
}

export async function saveSession(session: FocusSession): Promise<void> {
    const db = await getDB()
    await db.put(STORE, session)
}
