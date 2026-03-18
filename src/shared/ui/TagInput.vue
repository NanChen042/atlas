<!-- src/shared/ui/TagInput.vue -->
<template>
  <div class="flex flex-wrap gap-1.5 items-center">
    <span v-for="(tag, i) in modelValue" :key="tag" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium
             bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300
             transition-transform hover:scale-105">
      {{ tag }}
      <button class="ml-0.5 hover:text-violet-900 dark:hover:text-violet-100 cursor-pointer" @click="removeTag(i)" aria-label="Remove tag">
        ×
      </button>
    </span>

    <input ref="inputEl" v-model="inputValue" type="text" class="text-xs bg-transparent outline-none border-none min-w-[80px] flex-1
             text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]" :placeholder="modelValue.length === 0 ? '添加标签...' : ''" @keydown.enter.prevent="addTag" @keydown.comma.prevent="addTag" @keydown.backspace="onBackspace" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits<{
  'update:modelValue': [tags: string[]]
}>()

const inputValue = ref('')
const inputEl = ref<HTMLInputElement>()

function addTag() {
  const tag = inputValue.value.trim().replace(/,/g, '')
  if (tag && !props.modelValue.includes(tag)) {
    emit('update:modelValue', [...props.modelValue, tag])
  }
  inputValue.value = ''
}

function removeTag(index: number) {
  const copy = [...props.modelValue]
  copy.splice(index, 1)
  emit('update:modelValue', copy)
}

function onBackspace() {
  if (inputValue.value === '' && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1)
  }
}
</script>
