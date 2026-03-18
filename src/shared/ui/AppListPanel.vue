<!-- src/shared/ui/AppListPanel.vue -->
<template>
  <div class="h-full flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)]">
    <!-- Toolbar -->
    <div class="px-4 py-3 border-b border-[var(--color-border)] space-y-3">
      <!-- Search -->
      <div class="relative">
        <svg class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input :value="searchQuery" @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)" type="text" :placeholder="searchPlaceholder" class="w-full pl-8 pr-3 py-1.5 rounded-lg text-sm
                 bg-[var(--color-surface-alt)] border border-[var(--color-border)]
                 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]
                 focus:border-[var(--color-accent)] focus:outline-none transition-colors" />
      </div>

      <!-- Filters Row -->
      <div class="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
        <button v-for="f in filters" :key="f.value" :class="[
            'shrink-0 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors',
            currentFilter === f.value
              ? 'bg-[var(--color-accent)] text-white'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]',
          ]" @click="$emit('update:filter', f.value as any)">
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- New Button -->
    <div class="px-4 py-2 border-b border-[var(--color-border)]">
      <button :class="[
                'w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors active:scale-[0.98] cursor-pointer',
                buttonStyle === 'primary' ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white' : 
                'text-[var(--color-accent)] bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)] hover:text-white'
             ]" @click="$emit('create')">
        <slot name="create-icon">
          <!-- fallback icon -->
           <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </slot>
        {{ createText }}
      </button>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="isEmpty" class="px-4 py-12 text-center">
        <div class="text-3xl mb-3">{{ emptyIcon }}</div>
        <p class="text-sm text-[var(--color-text-muted)]">
          {{ isSearching ? emptySearchText : emptyText }}
        </p>
      </div>

      <ul v-else class="divide-y divide-[var(--color-border)]">
        <slot />
      </ul>
    </div>
    
    <!-- Footer Slot -->
    <div v-if="$slots.footer" class="px-4 py-2 border-t border-[var(--color-border)] text-[10px] text-[var(--color-text-muted)]">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends string">
defineProps<{
  searchQuery: string
  searchPlaceholder?: string
  filters: { label: string, value: T }[]
  currentFilter: T
  createText?: string
  buttonStyle?: 'primary' | 'secondary'
  isEmpty: boolean
  isSearching?: boolean
  emptyIcon?: string
  emptyText?: string
  emptySearchText?: string
}>()

defineEmits<{
  'update:searchQuery': [value: string]
  'update:filter': [value: T]
  'create': []
}>()
</script>
