// src/domains/knowledge/repository.ts
import { openDB, type IDBPDatabase } from 'idb'
import type { KnowledgeNote } from './model'

const DB_NAME = 'atlas-db'
const DB_VERSION = 2
const STORE = 'knowledge'

let _db: IDBPDatabase | null = null

async function getDB(): Promise<IDBPDatabase> {
    if (_db) return _db
    _db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, _newVersion, transaction) {
            if (!db.objectStoreNames.contains(STORE)) {
                const store = db.createObjectStore(STORE, { keyPath: 'id' })
                store.createIndex('status', 'status')
                store.createIndex('updatedAt', 'updatedAt')
            } else if (oldVersion < 2) {
                const store = transaction.objectStore(STORE)
                if (!store.indexNames.contains('status')) {
                    store.createIndex('status', 'status')
                }
                if (!store.indexNames.contains('updatedAt')) {
                    store.createIndex('updatedAt', 'updatedAt')
                }
            }
        },
    })
    return _db
}

export async function initDB(): Promise<void> {
    await getDB()
}

export async function listNotes(): Promise<KnowledgeNote[]> {
    const db = await getDB()
    const notes = await db.getAll(STORE)
    return notes.sort((a, b) => b.updatedAt - a.updatedAt)
}

export async function getNote(id: string): Promise<KnowledgeNote | undefined> {
    const db = await getDB()
    return db.get(STORE, id)
}

export async function saveNote(note: KnowledgeNote): Promise<void> {
    const db = await getDB()
    await db.put(STORE, note)
}

export async function deleteNote(id: string): Promise<void> {
    const db = await getDB()
    await db.delete(STORE, id)
}