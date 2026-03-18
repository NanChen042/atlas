// src/domains/tasks/store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task, TaskStatus } from './model'
import * as service from './service'

export const useTaskStore = defineStore('tasks', () => {
    /* ── state ── */
    const tasks = ref<Task[]>([])
    const current = ref<Task | null>(null)
    const searchQuery = ref('')
    const filterStatus = ref<TaskStatus | 'all'>('all')

    /* ── getters ── */
    const filteredTasks = computed(() => {
        let list = tasks.value

        // status filter
        if (filterStatus.value !== 'all') {
            list = list.filter((n) => n.status === filterStatus.value)
        }

        // search filter
        const q = searchQuery.value.trim().toLowerCase()
        if (q) {
            list = list.filter(
                (n) => n.title.toLowerCase().includes(q) ||
                    n.description.toLowerCase().includes(q) ||
                    n.tags.some((t) => t.toLowerCase().includes(q)),
            )
        }

        return list
    })

    // Board view helpers
    const tasksByStatus = computed(() => {
        return {
            'todo': filteredTasks.value.filter(t => t.status === 'todo'),
            'in-progress': filteredTasks.value.filter(t => t.status === 'in-progress'),
            'done': filteredTasks.value.filter(t => t.status === 'done'),
            'cancelled': filteredTasks.value.filter(t => t.status === 'cancelled')
        }
    })

    /* ── actions ── */
    async function loadList() {
        tasks.value = await service.listTasks()
    }

    async function open(id: string) {
        current.value = (await service.getTask(id)) || null
    }

    async function create(initial?: Partial<Task>) {
        const t = await service.createTask(initial)
        tasks.value.unshift(t)
        return t
    }

    async function save(task: Task) {
        task.updatedAt = Date.now()
        await service.saveTask(task)
    }

    async function updateCurrent(
        patch: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'tags' | 'relatedNoteId' | 'dueDate'>>,
    ) {
        if (!current.value) return
        const updated = await service.updateTask(current.value.id, patch)
        if (updated) {
            current.value = updated
            const idx = tasks.value.findIndex((n) => n.id === updated.id)
            if (idx >= 0) tasks.value[idx] = updated
        }
    }

    async function updateStatus(id: string, newStatus: TaskStatus) {
        const updated = await service.updateTask(id, { status: newStatus })
        if (updated) {
            const idx = tasks.value.findIndex((n) => n.id === updated.id)
            if (idx >= 0) tasks.value[idx] = updated
            if (current.value?.id === id) current.value = updated
        }
    }

    async function remove(id: string) {
        await service.removeTask(id)
        tasks.value = tasks.value.filter((n) => n.id !== id)
        if (current.value?.id === id) current.value = null
    }

    function setSearch(q: string) {
        searchQuery.value = q
    }

    function setFilter(status: TaskStatus | 'all') {
        filterStatus.value = status
    }

    return {
        tasks,
        current,
        searchQuery,
        filterStatus,
        filteredTasks,
        tasksByStatus,
        loadList,
        open,
        create,
        save,
        updateCurrent,
        updateStatus,
        remove,
        setSearch,
        setFilter,
    }
})
