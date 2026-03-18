// src/domains/knowledge/model.ts

export type KnowledgeStatus = 'draft' | 'understood' | 'actionable'

export interface KnowledgeNote {
    id: string
    title: string
    content: string

    tags: string[]
    status: KnowledgeStatus

    createdAt: number
    updatedAt: number
}

/** Human-readable labels for each status */
export const STATUS_LABELS: Record<KnowledgeStatus, string> = {
    draft: '草稿',
    understood: '已理解',
    actionable: '可行动',
}

/** Status color mapping (Tailwind class fragments) */
export const STATUS_COLORS: Record<KnowledgeStatus, { bg: string; text: string }> = {
    draft: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
    understood: {
        bg: 'bg-sky-100 dark:bg-sky-900/40',
        text: 'text-sky-700 dark:text-sky-300',
    },
    actionable: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/40',
        text: 'text-emerald-700 dark:text-emerald-300',
    },
}