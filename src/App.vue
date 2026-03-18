<template>
  <div class="h-screen w-screen flex bg-[var(--color-surface)] text-[var(--color-text-primary)]">
    <!-- Sidebar -->
    <AppSidebar />

    <!-- Main Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <AppHeader @search="showSearch = true" />
      <main class="flex-1 flex overflow-hidden">
        <!-- Left List Panel -->
        <div v-if="showListPanel" class="w-72 shrink-0 border-r border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
          <KnowledgeList v-if="currentDomain === 'knowledge'" />
          <TaskList v-else-if="currentDomain === 'tasks'" />
          <HabitList v-else-if="currentDomain === 'habits'" />
        </div>

        <!-- Content Area -->
        <div class="flex-1 min-w-0 bg-[var(--color-surface)]">
          <RouterView />
        </div>
      </main>
    </div>

    <!-- Global Search Modal -->
    <SearchModal :visible="showSearch" @close="showSearch = false" />

    <!-- AI Chat Panel -->
    <AIChatPanel />

    <!-- AI Settings Modal -->
    <AISettingsModal :visible="aiStore.settingsOpen" @close="aiStore.settingsOpen = false" />

    <!-- AI Floating Button -->
    <button
      v-if="!aiStore.panelOpen"
      class="fixed right-5 bottom-5 z-30 w-12 h-12 rounded-2xl
             bg-gradient-to-br from-violet-500 to-indigo-600 text-white
             shadow-lg shadow-indigo-500/30
             flex items-center justify-center cursor-pointer
             hover:shadow-xl hover:shadow-indigo-500/40 hover:-translate-y-0.5
             active:translate-y-0 transition-all
             ai-fab"
      @click="aiStore.togglePanel"
      title="AI 助手"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAIStore } from '@/domains/ai/store'
import AppHeader from '@/shared/ui/AppHeader.vue'
import AppSidebar from '@/shared/ui/AppSidebar.vue'
import SearchModal from '@/shared/ui/SearchModal.vue'
import AIChatPanel from '@/domains/ai/views/AIChatPanel.vue'
import AISettingsModal from '@/shared/ui/AISettingsModal.vue'
import KnowledgeList from '@/domains/knowledge/views/KnowledgeList.vue'
import TaskList from '@/domains/tasks/views/TaskList.vue'
import HabitList from '@/domains/habits/views/HabitList.vue'

const route = useRoute()
const aiStore = useAIStore()
const showSearch = ref(false)

const currentDomain = computed(() => {
  if (route.path.startsWith('/knowledge')) return 'knowledge'
  if (route.path.startsWith('/tasks')) return 'tasks'
  if (route.path.startsWith('/habits')) return 'habits'
  return null
})

const showListPanel = computed(() => {
  return currentDomain.value !== null
})

function handleKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    showSearch.value = !showSearch.value
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
