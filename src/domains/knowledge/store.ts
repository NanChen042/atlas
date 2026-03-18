// src/domains/knowledge/store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { KnowledgeNote, KnowledgeStatus } from './model'
import * as service from './service'

export const useKnowledgeStore = defineStore('knowledge', () => {
    /* ── state ── */
    const notes = ref<KnowledgeNote[]>([])
    const current = ref<KnowledgeNote | null>(null)
    const searchQuery = ref('')
    const filterStatus = ref<KnowledgeStatus | 'all'>('all')

    /* ── getters ── */
    const filteredNotes = computed(() => {
        let list = notes.value

        // status filter
        if (filterStatus.value !== 'all') {
            list = list.filter((n) => n.status === filterStatus.value)
        }

        // search filter
        const q = searchQuery.value.trim().toLowerCase()
        if (q) {
            list = list.filter(
                (n) =>
                    n.title.toLowerCase().includes(q) ||
                    n.content.toLowerCase().includes(q) ||
                    n.tags.some((t) => t.toLowerCase().includes(q)),
            )
        }

        return list
    })

    /* ── actions ── */
    async function loadList() {
        notes.value = await service.listNotes()

        // MVP closed loop: Create a welcome note if the db is completely empty
        if (notes.value.length === 0) {
            await createWelcomeNote()
            notes.value = await service.listNotes()
        }
    }

    async function createWelcomeNote() {
        const welcomeTitle = '👋 欢迎使用 Atlas!'
        const welcomeContent = `Atlas 是一个 Local-first、AI-增强的个人知识与生产力系统。

## 功能特性
- **本地优先**: 你的数据安全地存储在你的浏览器中。
- **快速编辑**: 支持所有 Markdown 快捷语法。
- **状态流转**: 在顶部栏将状态从 \`草稿\` 切换为 \`已理解\`。
- **标签系统**: 添加标签以便于快速检索。

## 快速开始
1. 尝试修改这条笔记的标题。
2. 点击右上角的 👁️ 预览按钮查看渲染后的结果。
3. 在左侧点击 "新建笔记" 创建你自己的第一条记录吧！`

        const note = await service.createNote()
        await service.updateNote(note.id, {
            title: welcomeTitle,
            content: welcomeContent,
            status: 'understood',
            tags: ['welcome', 'guide']
        })
    }

    async function open(id: string) {
        current.value = (await service.getNote(id)) || null
    }

    async function create() {
        const note = await service.createNote()
        notes.value.unshift(note)
        return note
    }

    async function save(note: KnowledgeNote) {
        note.updatedAt = Date.now()
        await service.saveNote(note)
    }

    async function updateCurrent(
        patch: Partial<Pick<KnowledgeNote, 'title' | 'content' | 'tags' | 'status'>>,
    ) {
        if (!current.value) return
        const updated = await service.updateNote(current.value.id, patch)
        if (updated) {
            current.value = updated
            // sync list
            const idx = notes.value.findIndex((n) => n.id === updated.id)
            if (idx >= 0) notes.value[idx] = updated
        }
    }

    async function remove(id: string) {
        await service.removeNote(id)
        notes.value = notes.value.filter((n) => n.id !== id)
        if (current.value?.id === id) current.value = null
    }

    function setSearch(q: string) {
        searchQuery.value = q
    }

    function setFilter(status: KnowledgeStatus | 'all') {
        filterStatus.value = status
    }

    return {
        notes,
        current,
        searchQuery,
        filterStatus,
        filteredNotes,
        loadList,
        open,
        create,
        save,
        updateCurrent,
        remove,
        setSearch,
        setFilter,
    }
})