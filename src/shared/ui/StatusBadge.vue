<!-- src/shared/ui/StatusBadge.vue -->
<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      STATUS_COLORS[status].bg,
      STATUS_COLORS[status].text,
    ]"
  >
    {{ STATUS_LABELS[status] }}
  </span>
</template>

<script setup lang="ts">
import type { KnowledgeStatus } from '@/domains/knowledge/model'
import { STATUS_LABELS, STATUS_COLORS } from '@/domains/knowledge/model'

defineProps<{ status: KnowledgeStatus }>()
</script>
