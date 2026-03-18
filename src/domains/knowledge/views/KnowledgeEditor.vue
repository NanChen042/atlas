<!-- src/domains/knowledge/views/KnowledgeEditor.vue -->
<template>
  <AppEmptyState v-if="!store.current" icon="📄" text="选择一条笔记或新建一条" />

  <div v-else class="h-full flex flex-col">
    <!-- Editor Header -->
    <AppEditorHeader
      :saveStatus="saveStatus"
      deleteTitle="删除笔记"
      @back="router.push('/knowledge')"
      @delete="showDeleteModal = true"
    >
      <template #left>
        <!-- Status Select -->
        <select :value="store.current.status" @change="changeStatus(($event.target as HTMLSelectElement).value as KnowledgeStatus)" class="text-xs px-2 py-1 rounded-lg border border-[var(--color-border)]
                 bg-[var(--color-surface)] text-[var(--color-text-secondary)] cursor-pointer
                 focus:outline-none focus:border-[var(--color-accent)]">
          <option v-for="(label, key) in STATUS_LABELS" :key="key" :value="key">
            {{ label }}
          </option>
        </select>
      </template>
      
      <template #right>
        <!-- AI Actions -->
        <div class="relative mr-2" ref="aiMenuRef">
          <button
            :class="[
              'flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all',
              aiMenuOpen || aiActionLoading
                ? 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30'
                : 'text-violet-500 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30'
            ]"
            @click="aiMenuOpen = !aiMenuOpen"
            title="AI 功能"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
            <span>AI</span>
            <span v-if="aiActionLoading" class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
          </button>

          <Transition name="slide">
            <div v-if="aiMenuOpen"
              class="absolute right-0 top-full mt-1 w-48 py-1 rounded-xl border border-[var(--color-border)]
                     bg-[var(--color-surface)] shadow-xl z-20 animate-[modal-in_0.15s_ease-out]">
              <button v-for="action in aiActions" :key="action.key"
                class="w-full text-left px-3 py-2 text-xs flex items-center gap-2
                       text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]
                       cursor-pointer transition-colors"
                @click="runAIAction(action.key)">
                <span v-html="action.icon"></span>
                {{ action.label }}
              </button>
            </div>
          </Transition>
        </div>

        <!-- Derive Task -->
        <button class="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors text-[var(--color-accent)] bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/20 mr-2" @click="deriveTask" title="从该笔记派生新任务">
           <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           派生任务
        </button>
        <!-- Preview toggle -->
        <button :class="[
            'w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors',
            preview
              ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]',
          ]" @click="preview = !preview" title="预览 Markdown">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </template>
    </AppEditorHeader>

    <!-- Editor Body -->
    <div class="flex-1 overflow-y-auto px-6 py-4">
      <div class="max-w-3xl mx-auto space-y-4">
        <!-- Title -->
        <input :value="store.current.title" @input="onTitleInput(($event.target as HTMLInputElement).value)" type="text" placeholder="无标题" class="w-full text-2xl font-bold text-[var(--color-text-primary)]
                 placeholder:text-[var(--color-text-muted)] bg-transparent
                 border-none outline-none" />

        <!-- Tags -->
        <div class="flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          <TagInput :modelValue="store.current.tags" @update:modelValue="onTagsChange" />
        </div>

        <hr class="border-[var(--color-border)]" />

        <!-- Content -->
        <div v-if="preview" class="prose prose-sm dark:prose-invert max-w-none min-h-[300px]
                                    text-[var(--color-text-primary)]" @click="handleContentClick">
          <div v-html="renderedContent" />
        </div>

        <textarea v-else :value="store.current.content" @input="onContentInput(($event.target as HTMLTextAreaElement).value)" placeholder="开始写作... 支持 Markdown 语法" class="w-full min-h-[300px] text-sm leading-relaxed resize-none
                 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                 bg-transparent border-none outline-none font-mono" />
      </div>
    </div>

    <!-- OCR Status Bar -->
    <div v-if="aiActionLoading"
      class="shrink-0 px-6 py-2.5 border-t border-[var(--color-border)]
             bg-gradient-to-r from-violet-500/5 to-indigo-500/5
             flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
      <span class="text-xs text-violet-600 dark:text-violet-400">AI 正在处理...</span>
      <button class="ml-auto text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]
                     cursor-pointer transition-colors" @click="aiStore.stopStreaming(); aiActionLoading = false">
        取消
      </button>
    </div>

    <!-- Hidden file input for OCR -->
    <input ref="ocrFileInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleOCRFile" />

    <!-- Delete confirmation -->
    <ConfirmModal :visible="showDeleteModal" title="删除笔记" message="确定要删除这条笔记吗？此操作不可撤销。" confirmText="删除" @confirm="deleteNote" @cancel="showDeleteModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKnowledgeStore } from '../store'
import { useTaskStore } from '@/domains/tasks/store'
import { useAIStore } from '@/domains/ai/store'
import { STATUS_LABELS, type KnowledgeStatus } from '../model'
import TagInput from '@/shared/ui/TagInput.vue'
import ConfirmModal from '@/shared/ui/ConfirmModal.vue'
import AppEmptyState from '@/shared/ui/AppEmptyState.vue'
import AppEditorHeader from '@/shared/ui/AppEditorHeader.vue'

const store = useKnowledgeStore()
const taskStore = useTaskStore()
const aiStore = useAIStore()
const route = useRoute()
const router = useRouter()

const preview = ref(false)
const showDeleteModal = ref(false)
const saveStatus = ref<'saving' | 'saved' | null>(null)
const aiMenuOpen = ref(false)
const aiMenuRef = ref<HTMLElement>()
const aiActionLoading = ref(false)

const ocrFileInput = ref<HTMLInputElement>()

const aiActions = [
  { key: 'summarize', label: 'AI 总结', icon: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/></svg>' },
  { key: 'continue', label: 'AI 续写', icon: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"/></svg>' },
  { key: 'improve', label: 'AI 润色', icon: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>' },
  { key: 'tags', label: 'AI 生成标签', icon: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"/></svg>' },
  { key: 'ocr', label: 'OCR 图片识别', icon: '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"/><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"/></svg>' },
]

const AI_PROMPTS: Record<string, string> = {
  summarize: '请用简洁的中文总结以下内容，提取关键要点，用 Markdown 列表格式输出：',
  continue: '请基于以下内容，用同样的风格和语言继续续写，保持连贯性：',
  improve: '请润色和优化以下内容，改善文笔和逻辑，保持原意不变，直接输出优化后的内容：',
  tags: '请根据以下内容生成 3-5 个精准的中文标签关键词，用逗号分隔，只输出标签词，不要其他内容：',
}

async function runAIAction(key: string) {
  if (!store.current || aiActionLoading.value) return
  aiMenuOpen.value = false

  const content = store.current.content
  if (!content.trim()) return

  aiActionLoading.value = true
  const prompt = AI_PROMPTS[key]

  if (key === 'tags') {
    const result = await aiStore.runQuickAction(prompt, content, () => {})
    if (result && !result.startsWith('⚠️')) {
      const tags = result.split(/[,，、\s]+/).map(t => t.trim()).filter(Boolean)
      const merged = [...new Set([...store.current.tags, ...tags])]
      onTagsChange(merged)
    }
    aiActionLoading.value = false
    return
  }

  if (key === 'summarize') {
    let summary = ''
    await aiStore.runQuickAction(prompt, content, (chunk) => { summary += chunk })
    if (summary && !summary.startsWith('⚠️')) {
      const separator = '\n\n---\n\n## AI 总结\n\n'
      if (store.current) {
        store.current.content += separator + summary
        scheduleSave({ content: store.current.content })
      }
    }
    aiActionLoading.value = false
    return
  }

  if (key === 'continue') {
    await aiStore.runQuickAction(prompt, content, (chunk) => {
      if (store.current) {
        store.current.content += chunk
      }
    })
    if (store.current) scheduleSave({ content: store.current.content })
    aiActionLoading.value = false
    return
  }

  if (key === 'improve') {
    let improved = ''
    await aiStore.runQuickAction(prompt, content, (chunk) => { improved += chunk })
    if (improved && !improved.startsWith('⚠️') && store.current) {
      store.current.content = improved
      scheduleSave({ content: improved })
    }
    aiActionLoading.value = false
    return
  }

  if (key === 'ocr') {
    ocrFileInput.value?.click()
    aiActionLoading.value = false
    return
  }
}

async function handleOCRFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !store.current) return

  aiActionLoading.value = true

  const reader = new FileReader()
  reader.onload = async () => {
    const base64 = reader.result as string
    let ocrText = ''
    await aiStore.runOCR(base64, (chunk) => {
      ocrText += chunk
    })
    if (ocrText && !ocrText.startsWith('⚠️') && store.current) {
      const separator = store.current.content.trim() ? '\n\n---\n\n## OCR 识别结果\n\n' : ''
      store.current.content += separator + ocrText
      scheduleSave({ content: store.current.content })
    }
    aiActionLoading.value = false
  }
  reader.readAsDataURL(file)
}

function handleClickOutside(e: MouseEvent) {
  if (aiMenuRef.value && !aiMenuRef.value.contains(e.target as Node)) {
    aiMenuOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

let saveTimer: ReturnType<typeof setTimeout> | null = null

// Load note when route changes
watch(
  () => route.params.id,
  async (id) => {
    if (id && typeof id === 'string') {
      await store.open(id)
    }
  },
  { immediate: true }
)

function scheduleSave(
  patch: Partial<{ title: string; content: string; tags: string[]; status: KnowledgeStatus }>
) {
  saveStatus.value = 'saving'

  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    await store.updateCurrent(patch)
    saveStatus.value = 'saved'
    setTimeout(() => {
      saveStatus.value = null
    }, 1500)
  }, 800)
}

function onTitleInput(value: string) {
  if (store.current) {
    store.current.title = value
    scheduleSave({ title: value })
  }
}

function onContentInput(value: string) {
  if (store.current) {
    store.current.content = value
    scheduleSave({ content: value })
  }
}

function onTagsChange(tags: string[]) {
  if (store.current) {
    store.current.tags = tags
    scheduleSave({ tags })
  }
}

function changeStatus(status: KnowledgeStatus) {
  if (store.current) {
    store.current.status = status
    scheduleSave({ status })
  }
}

async function deleteNote() {
  if (!store.current) return
  await store.remove(store.current.id)
  showDeleteModal.value = false
  router.push('/knowledge')
}

async function deriveTask() {
  if (!store.current) return
  const task = await taskStore.create({
      title: `来自: ${store.current.title || '无标题'}`,
      description: `这是从笔记 [${store.current.title || '无标题'}] 派生出的任务...`,
      relatedNoteId: store.current.id,
      tags: [...store.current.tags]
  })
  if (task) {
      router.push(`/tasks/${task.id}`)
  }
}

function handleContentClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (target.classList.contains('bidirectional-link')) {
    const link = target.getAttribute('data-link')
    if (link) {
      store.setSearch(link)
      store.setFilter('all')
      router.push('/knowledge')
    }
  }
}

// Simple Markdown rendering (basic without dependency)
const renderedContent = computed(() => {
  if (!store.current?.content) return '<p style="color: var(--color-text-muted)">空白笔记...</p>'

  let html = store.current.content
    // Escape HTML
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Code
    .replace(
      /`([^`]+)`/g,
      '<code style="background:var(--color-surface-alt);padding:0.1em 0.3em;border-radius:3px;font-size:0.9em">$1</code>'
    )
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Bidirectional Links
    .replace(/\[\[([^\]]+)\]\]/g, '<span class="bidirectional-link bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-1.5 py-0.5 rounded-md mx-1 font-medium cursor-pointer hover:bg-[var(--color-accent)]/20 transition-colors" data-link="$1">#$1</span>')
    // Links
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" style="color:var(--color-accent)">$1</a>'
    )
    // Line breaks → paragraphs
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')

  // Wrap loose <li> in <ul>
  html = html.replace(/((?:<li>.*?<\/li>\s*)+)/g, '<ul>$1</ul>')

  return `<p>${html}</p>`
})
</script>
