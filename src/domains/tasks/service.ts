// src/domains/tasks/service.ts
import {
    listTasks,
    getTask,
    saveTask,
    deleteTask as repoDelete,
} from './repository'
import type { Task, TaskStatus, TaskPriority } from './model'

export async function createTask(initial?: Partial<Task>): Promise<Task> {
    const now = Date.now()
    const task: Task = {
        id: crypto.randomUUID(),
        title: initial?.title || '新任务',
        description: initial?.description || '',
        status: initial?.status || 'todo',
        priority: initial?.priority || 'medium',
        tags: initial?.tags || [],
        relatedNoteId: initial?.relatedNoteId,
        projectId: initial?.projectId,
        dueDate: initial?.dueDate,
        createdAt: now,
        updatedAt: now,
    }
    await saveTask(task)
    return task
}

export async function updateTask(
    id: string,
    patch: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'tags' | 'relatedNoteId' | 'dueDate'>>,
): Promise<Task | null> {
    const task = await getTask(id)
    if (!task) return null

    Object.assign(task, patch, { updatedAt: Date.now() })
    await saveTask(task)
    return task
}

export async function removeTask(id: string): Promise<void> {
    await repoDelete(id)
}

export { listTasks, getTask, saveTask }
