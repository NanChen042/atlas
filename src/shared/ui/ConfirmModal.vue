<!-- src/shared/ui/ConfirmModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="cancel">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)]
                 rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4
                 animate-[modal-in_0.2s_ease-out]">
          <h3 class="text-base font-semibold text-[var(--color-text-primary)] mb-2">
            {{ title }}
          </h3>
          <p class="text-sm text-[var(--color-text-secondary)] mb-6">
            {{ message }}
          </p>
          <div class="flex justify-end gap-2">
            <button class="px-3 py-1.5 text-sm rounded-lg border border-[var(--color-border)]
                     text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]
                     cursor-pointer transition-colors" @click="cancel">
              取消
            </button>
            <button class="px-3 py-1.5 text-sm rounded-lg text-white
                     bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)]
                     cursor-pointer transition-colors" @click="confirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  title?: string
  message?: string
  confirmText?: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

function confirm() {
  emit('confirm')
}

function cancel() {
  emit('cancel')
}
</script>

<style scoped>
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
