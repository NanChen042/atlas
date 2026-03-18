// src/domains/knowledge/service.ts
import {
    listNotes,
    getNote,
    saveNote,
    deleteNote as repoDelete,
} from './repository'
import type { KnowledgeNote, KnowledgeStatus } from './model'

export async function createNote(): Promise<KnowledgeNote> {
    const now = Date.now()
    const note: KnowledgeNote = {
        id: crypto.randomUUID(),
        title: '',
        content: '',
        status: 'draft',
        tags: [],
        createdAt: now,
        updatedAt: now,
    }
    await saveNote(note)
    return note
}

export async function updateNote(
    id: string,
    patch: Partial<Pick<KnowledgeNote, 'title' | 'content' | 'tags' | 'status'>>,
): Promise<KnowledgeNote | null> {
    const note = await getNote(id)
    if (!note) return null

    Object.assign(note, patch, { updatedAt: Date.now() })
    await saveNote(note)
    return note
}

export async function removeNote(id: string): Promise<void> {
    await repoDelete(id)
}

export { listNotes, getNote, saveNote }