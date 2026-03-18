<!-- src/shared/ui/AppEditorHeader.vue -->
<template>
  <div class="flex items-center justify-between px-6 py-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
    <div class="flex items-center gap-3 w-full">
      <!-- Back button (mobile) -->
      <button class="sm:hidden w-8 h-8 flex shrink-0 items-center justify-center rounded-lg hover:bg-[var(--color-surface-hover)] cursor-pointer text-[var(--color-text-secondary)]" @click="$emit('back')">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Left Slot (Status selects, Title inputs, etc) -->
      <div class="flex items-center gap-2 flex-1 min-w-0">
         <slot name="left"></slot>
      </div>

      <!-- Save indicator -->
      <Transition name="fade">
        <span v-if="saveStatus" class="shrink-0 text-[10px] text-[var(--color-text-muted)] flex items-center gap-1 mx-2 block">
          <span v-if="saveStatus === 'saving'" class="animate-pulse">●</span>
          <span v-else class="text-emerald-500">✓</span>
          <span class="hidden sm:inline">{{ saveStatus === 'saving' ? '保存中...' : '已保存' }}</span>
        </span>
      </Transition>

      <div class="flex items-center gap-1 shrink-0">
        <!-- Right Slot (Actions, Previews, etc) -->
        <slot name="right"></slot>

        <!-- Delete -->
        <button v-if="showDelete" class="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors" @click="$emit('delete')" :title="deleteTitle">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  saveStatus: 'saving' | 'saved' | null
  showDelete?: boolean
  deleteTitle?: string
}>(), {
  showDelete: true,
  deleteTitle: '删除'
})

defineEmits<{
  'back': [],
  'delete': []
}>()
</script>
