// src/domains/tasks/model.ts

export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    tags: string[]

    // Optional reference to a Knowledge Note
    relatedNoteId?: string

    // For workflows
    projectId?: string

    dueDate?: number
    createdAt: number
    updatedAt: number
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    'todo': '待办',
    'in-progress': '进行中',
    'done': '已完成',
    'cancelled': '已取消'
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
    'low': '低优先级',
    'medium': '中优先级',
    'high': '高优先级'
}
