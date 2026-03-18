// src/domains/tasks/repository.ts
import { openDB, type IDBPDatabase } from 'idb'
import type { Task } from './model'

const DB_NAME = 'atlas-db-tasks'
const DB_VERSION = 1
const STORE = 'tasks'

let _db: IDBPDatabase | null = null

async function getDB(): Promise<IDBPDatabase> {
    if (_db) return _db
    _db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE)) {
                const store = db.createObjectStore(STORE, { keyPath: 'id' })
                store.createIndex('status', 'status')
                store.createIndex('updatedAt', 'updatedAt')
                store.createIndex('relatedNoteId', 'relatedNoteId')
                store.createIndex('projectId', 'projectId')
            }
        },
    })
    return _db
}

export async function initDB(): Promise<void> {
    await getDB()
}

export async function listTasks(): Promise<Task[]> {
    const db = await getDB()
    const tasks = await db.getAll(STORE)
    return tasks.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function getTask(id: string): Promise<Task | undefined> {
    const db = await getDB()
    return db.get(STORE, id)
}

export async function saveTask(task: Task): Promise<void> {
    const db = await getDB()
    await db.put(STORE, task)
}

export async function deleteTask(id: string): Promise<void> {
    const db = await getDB()
    await db.delete(STORE, id)
}
