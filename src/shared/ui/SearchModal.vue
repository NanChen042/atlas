<!-- src/shared/ui/SearchModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm" @click.self="close">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)]
                    rounded-xl shadow-2xl w-full max-w-lg mx-4
                    animate-[modal-in_0.15s_ease-out] overflow-hidden">
          <!-- Search Input -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
            <svg class="w-5 h-5 text-[var(--color-text-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              ref="inputEl"
              v-model="query"
              type="text"
              placeholder="搜索笔记、任务..."
              class="flex-1 text-sm bg-transparent outline-none border-none
                     text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
              @keydown.escape="close"
              @keydown.down.prevent="moveSelection(1)"
              @keydown.up.prevent="moveSelection(-1)"
              @keydown.enter.prevent="confirmSelection"
            />
            <kbd class="px-1.5 py-0.5 rounded text-[10px] bg-[var(--color-surface-alt)]
                       border border-[var(--color-border)] text-[var(--color-text-muted)]">ESC</kbd>
          </div>

          <!-- Results -->
          <div class="max-h-[50vh] overflow-y-auto">
            <div v-if="!query.trim()" class="px-4 py-8 text-center">
              <p class="text-sm text-[var(--color-text-muted)]">输入关键词开始搜索</p>
            </div>

            <div v-else-if="allResults.length === 0" class="px-4 py-8 text-center">
              <p class="text-sm text-[var(--color-text-muted)]">未找到匹配的内容</p>
            </div>

            <div v-else>
              <!-- Knowledge Results -->
              <div v-if="knowledgeResults.length > 0">
                <div class="px-4 py-1.5 text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider bg-[var(--color-surface-alt)]">
                  知识笔记
                </div>
                <button
                  v-for="(item, i) in knowledgeResults"
                  :key="item.id"
                  :class="[
                    'w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors cursor-pointer',
                    selectedIndex === getGlobalIndex('knowledge', i)
                      ? 'bg-[var(--color-accent)]/10'
                      : 'hover:bg-[var(--color-surface-hover)]'
                  ]"
                  @click="goTo(`/knowledge/${item.id}`)"
                  @mouseenter="selectedIndex = getGlobalIndex('knowledge', i)"
                >
                  <span class="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 text-sm">📄</span>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-[var(--color-text-primary)] truncate">{{ item.title || '无标题' }}</p>
                    <p class="text-[11px] text-[var(--color-text-muted)] truncate">{{ item.content?.slice(0, 60) || '空白笔记' }}</p>
                  </div>
                </button>
              </div>

              <!-- Task Results -->
              <div v-if="taskResults.length > 0">
                <div class="px-4 py-1.5 text-[10px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider bg-[var(--color-surface-alt)]">
                  任务
                </div>
                <button
                  v-for="(item, i) in taskResults"
                  :key="item.id"
                  :class="[
                    'w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors cursor-pointer',
                    selectedIndex === getGlobalIndex('tasks', i)
                      ? 'bg-[var(--color-accent)]/10'
                      : 'hover:bg-[var(--color-surface-hover)]'
                  ]"
                  @click="goTo(`/tasks/${item.id}`)"
                  @mouseenter="selectedIndex = getGlobalIndex('tasks', i)"
                >
                  <span class="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 text-sm">📋</span>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-[var(--color-text-primary)] truncate">{{ item.title || '无标题任务' }}</p>
                    <p class="text-[11px] text-[var(--color-text-muted)] truncate">{{ item.description?.slice(0, 60) || '无描述' }}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="allResults.length > 0" class="px-4 py-2 border-t border-[var(--color-border)] flex items-center gap-3 text-[10px] text-[var(--color-text-muted)]">
            <span class="flex items-center gap-1"><kbd class="px-1 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)]">↑↓</kbd> 导航</span>
            <span class="flex items-center gap-1"><kbd class="px-1 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-surface-alt)]">↵</kbd> 打开</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useKnowledgeStore } from '@/domains/knowledge/store'
import { useTaskStore } from '@/domains/tasks/store'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()

const router = useRouter()
const knowledgeStore = useKnowledgeStore()
const taskStore = useTaskStore()

const query = ref('')
const selectedIndex = ref(0)
const inputEl = ref<HTMLInputElement>()

const knowledgeResults = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return knowledgeStore.notes
    .filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.tags.some(t => t.toLowerCase().includes(q)))
    .slice(0, 5)
})

const taskResults = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return taskStore.tasks
    .filter(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some(tag => tag.toLowerCase().includes(q)))
    .slice(0, 5)
})

const allResults = computed(() => [
  ...knowledgeResults.value.map(r => ({ ...r, _type: 'knowledge' as const })),
  ...taskResults.value.map(r => ({ ...r, _type: 'tasks' as const })),
])

function getGlobalIndex(type: 'knowledge' | 'tasks', localIndex: number): number {
  if (type === 'knowledge') return localIndex
  return knowledgeResults.value.length + localIndex
}

function moveSelection(delta: number) {
  const len = allResults.value.length
  if (len === 0) return
  selectedIndex.value = (selectedIndex.value + delta + len) % len
}

function confirmSelection() {
  const item = allResults.value[selectedIndex.value]
  if (item) {
    goTo(`/${item._type}/${item.id}`)
  }
}

function goTo(path: string) {
  router.push(path)
  close()
}

function close() {
  query.value = ''
  selectedIndex.value = 0
  emit('close')
}

watch(() => query.value, () => {
  selectedIndex.value = 0
})

watch(() => props.visible, async (v) => {
  if (v) {
    await nextTick()
    inputEl.value?.focus()
  }
})
</script>

<style scoped>
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
