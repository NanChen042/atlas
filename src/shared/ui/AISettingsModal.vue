<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @click.self="close">
        <div class="bg-[var(--color-surface)] border border-[var(--color-border)]
                    rounded-2xl shadow-2xl w-full max-w-md mx-4
                    animate-[modal-in_0.2s_ease-out] overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
            <h3 class="text-base font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </span>
              AI 设置
            </h3>
            <button class="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-muted)]
                         hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors" @click="close">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 space-y-5">
            <!-- Provider -->
            <div>
              <label class="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">AI 服务商</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="(cfg, key) in PROVIDER_CONFIG"
                  :key="key"
                  :class="[
                    'px-3 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-all',
                    localConfig.provider === key
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)]/50'
                  ]"
                  @click="selectProvider(key as AIProvider)"
                >
                  {{ cfg.label }}
                </button>
              </div>
            </div>

            <!-- API Key -->
            <div>
              <label class="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">API Key</label>
              <div class="relative">
                <input
                  v-model="localConfig.apiKey"
                  :type="showKey ? 'text' : 'password'"
                  placeholder="sk-..."
                  class="w-full px-3 py-2.5 pr-10 rounded-xl border border-[var(--color-border)]
                         bg-[var(--color-surface-alt)] text-sm text-[var(--color-text-primary)]
                         placeholder:text-[var(--color-text-muted)]
                         focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                />
                <button
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center
                         rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]
                         cursor-pointer transition-colors"
                  @click="showKey = !showKey"
                >
                  <svg v-if="showKey" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <p class="text-[11px] text-[var(--color-text-muted)] mt-1.5">
                Key 仅存储在你的浏览器本地，不会上传到任何服务器
              </p>
            </div>

            <!-- Model -->
            <div>
              <label class="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">模型</label>
              <select
                v-model="localConfig.model"
                class="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)]
                       bg-[var(--color-surface-alt)] text-sm text-[var(--color-text-primary)]
                       cursor-pointer focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              >
                <option v-for="m in currentModels" :key="m.id" :value="m.id">
                  {{ m.label }}{{ m.tag === 'free' ? ' (免费)' : m.tag === 'reasoning' ? ' (推理)' : m.tag === 'vision' ? ' (视觉)' : '' }}
                </option>
              </select>
            </div>

            <!-- Status -->
            <div v-if="localConfig.apiKey" class="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs text-emerald-700 dark:text-emerald-300">AI 已就绪</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-[var(--color-border)] flex justify-end gap-2">
            <button class="px-4 py-2 text-sm rounded-xl border border-[var(--color-border)]
                         text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]
                         cursor-pointer transition-colors" @click="close">
              取消
            </button>
            <button class="px-4 py-2 text-sm rounded-xl text-white font-medium
                         bg-gradient-to-r from-violet-500 to-indigo-600
                         hover:from-violet-600 hover:to-indigo-700
                         cursor-pointer transition-all shadow-lg shadow-indigo-500/20" @click="save">
              保存
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useAIStore } from '@/domains/ai/store'
import { PROVIDER_CONFIG, type AIProvider } from '@/domains/ai/model'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ close: [] }>()

const aiStore = useAIStore()
const showKey = ref(false)

const localConfig = reactive({
    provider: aiStore.config.provider,
    apiKey: aiStore.config.apiKey,
    model: aiStore.config.model,
    baseUrl: aiStore.config.baseUrl,
})

const currentModels = computed(() =>
    PROVIDER_CONFIG[localConfig.provider]?.models || []
)

watch(() => props.visible, (v) => {
    if (v) {
        localConfig.provider = aiStore.config.provider
        localConfig.apiKey = aiStore.config.apiKey
        localConfig.model = aiStore.config.model
        localConfig.baseUrl = aiStore.config.baseUrl
    }
})

function selectProvider(p: AIProvider) {
    localConfig.provider = p
    localConfig.model = PROVIDER_CONFIG[p].defaultModel
    localConfig.baseUrl = PROVIDER_CONFIG[p].baseUrl
}

function save() {
    aiStore.updateConfig({ ...localConfig })
    emit('close')
}

function close() {
    emit('close')
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
