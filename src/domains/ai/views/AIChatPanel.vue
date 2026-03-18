<template>
  <Transition name="ai-panel">
    <aside v-if="aiStore.panelOpen"
      class="fixed right-0 top-0 h-screen w-[420px] max-w-[90vw] z-40
             bg-[var(--color-surface)] border-l border-[var(--color-border)]
             flex flex-col shadow-2xl shadow-black/10">

      <!-- Header -->
      <div class="h-12 px-4 flex items-center justify-between shrink-0 border-b border-[var(--color-border)]
                  bg-gradient-to-r from-violet-500/5 to-indigo-500/5">
        <div class="flex items-center gap-2">
          <span class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center ai-glow">
            <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </span>
          <span class="text-sm font-semibold text-[var(--color-text-primary)]">AI 助手</span>
          <span v-if="aiStore.isStreaming" class="flex items-center gap-1 text-[10px] text-violet-500">
            <span class="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
            思考中
          </span>
        </div>
        <div class="flex items-center gap-1">
          <button class="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-text-muted)]
                       hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                  @click="aiStore.settingsOpen = true" title="AI 设置">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <button class="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-text-muted)]
                       hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                  @click="aiStore.clearMessages" title="清空对话">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
          <button class="w-7 h-7 flex items-center justify-center rounded-lg text-[var(--color-text-muted)]
                       hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                  @click="aiStore.togglePanel" title="关闭">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div ref="messagesEl" class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <!-- Empty state -->
        <div v-if="aiStore.messages.length === 0" class="flex flex-col items-center justify-center h-full text-center">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mb-4
                      animate-[float_3s_ease-in-out_infinite]">
            <svg class="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
          </div>
          <h3 class="text-sm font-semibold text-[var(--color-text-primary)] mb-1">Atlas AI 助手</h3>
          <p class="text-xs text-[var(--color-text-muted)] max-w-[240px] mb-6">
            我可以帮你整理知识、分析任务、制定计划。试试问我任何问题吧！
          </p>
          <div class="space-y-2 w-full max-w-[280px]">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion"
              class="w-full text-left px-3 py-2.5 rounded-xl border border-[var(--color-border)]
                     text-xs text-[var(--color-text-secondary)]
                     hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent)]/5
                     cursor-pointer transition-all"
              @click="sendSuggestion(suggestion)"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>

        <!-- Message bubbles -->
        <template v-for="msg in aiStore.messages" :key="msg.id">
          <div :class="[
            'flex gap-2.5 animate-[msg-in_0.3s_ease-out]',
            msg.role === 'user' ? 'flex-row-reverse' : ''
          ]">
            <!-- Avatar -->
            <div :class="[
              'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white text-xs',
              msg.role === 'user'
                ? 'bg-gradient-to-br from-sky-500 to-blue-600'
                : 'bg-gradient-to-br from-violet-500 to-indigo-600 ai-glow'
            ]">
              <template v-if="msg.role === 'user'">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </template>
              <template v-else>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </template>
            </div>

            <!-- Bubble -->
            <div :class="[
              'max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-[var(--color-accent)] text-white rounded-tr-md'
                : 'bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-tl-md'
            ]">
              <div v-if="msg.role === 'assistant'" v-html="renderMarkdown(msg.content)" class="ai-prose"></div>
              <span v-else class="whitespace-pre-wrap">{{ msg.content }}</span>

              <!-- Loading dots -->
              <div v-if="msg.loading && !msg.content" class="flex items-center gap-1 py-1">
                <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-[bounce_1s_ease-in-out_infinite]"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-[bounce_1s_ease-in-out_0.15s_infinite]"></span>
                <span class="w-1.5 h-1.5 rounded-full bg-violet-400 animate-[bounce_1s_ease-in-out_0.3s_infinite]"></span>
              </div>

              <!-- Cursor blink during streaming -->
              <span v-if="msg.loading && msg.content" class="inline-block w-0.5 h-4 bg-violet-500 ml-0.5 align-middle animate-[blink_0.8s_step-end_infinite]"></span>
            </div>
          </div>
        </template>
      </div>

      <!-- Input -->
      <div class="shrink-0 border-t border-[var(--color-border)] p-3">
        <div v-if="!aiStore.isConfigured" class="text-center py-3">
          <p class="text-xs text-[var(--color-text-muted)] mb-2">请先配置 API Key</p>
          <button class="px-4 py-2 text-xs rounded-xl text-white font-medium
                       bg-gradient-to-r from-violet-500 to-indigo-600
                       hover:from-violet-600 hover:to-indigo-700
                       cursor-pointer transition-all" @click="aiStore.settingsOpen = true">
            配置 AI
          </button>
        </div>

        <div v-else class="flex items-end gap-2">
          <div class="flex-1 relative">
            <textarea
              ref="inputEl"
              v-model="inputText"
              placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
              rows="1"
              class="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)]
                     bg-[var(--color-surface-alt)] text-sm text-[var(--color-text-primary)]
                     placeholder:text-[var(--color-text-muted)]
                     focus:outline-none focus:border-[var(--color-accent)]
                     resize-none transition-colors"
              :style="{ maxHeight: '120px', height: textareaHeight }"
              @keydown="handleKeydown"
              @input="autoResize"
            ></textarea>
          </div>

          <button
            v-if="aiStore.isStreaming"
            class="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl
                   bg-red-500 hover:bg-red-600 text-white cursor-pointer transition-all"
            @click="aiStore.stopStreaming" title="停止生成">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
          <button
            v-else
            :disabled="!inputText.trim()"
            :class="[
              'w-9 h-9 shrink-0 flex items-center justify-center rounded-xl transition-all',
              inputText.trim()
                ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white cursor-pointer hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5'
                : 'bg-[var(--color-surface-alt)] text-[var(--color-text-muted)] cursor-not-allowed'
            ]"
            @click="send" title="发送">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useAIStore } from '@/domains/ai/store'

const aiStore = useAIStore()
const inputText = ref('')
const inputEl = ref<HTMLTextAreaElement>()
const messagesEl = ref<HTMLDivElement>()
const textareaHeight = ref('40px')

const suggestions = [
  '帮我制定一个学习计划',
  '如何提高工作效率？',
  '总结一下今天的待办事项',
]

function send() {
  const text = inputText.value.trim()
  if (!text || aiStore.isStreaming) return
  inputText.value = ''
  textareaHeight.value = '40px'
  aiStore.sendMessage(text)
}

function sendSuggestion(text: string) {
  aiStore.sendMessage(text)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

function autoResize() {
  if (!inputEl.value) return
  inputEl.value.style.height = '40px'
  const scrollH = inputEl.value.scrollHeight
  textareaHeight.value = Math.min(scrollH, 120) + 'px'
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) {
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    }
  })
}

watch(() => aiStore.messages.length, scrollToBottom)
watch(
  () => aiStore.messages[aiStore.messages.length - 1]?.content,
  scrollToBottom,
)

function renderMarkdown(text: string): string {
  if (!text) return ''

  // 1. Strip <think> blocks (Qwen3 reasoning output)
  let src = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
  // Handle incomplete <think> tag during streaming
  src = src.replace(/<think>[\s\S]*$/g, '').trim()

  if (!src) return '<span class="text-violet-400 text-xs">思考中...</span>'

  // 2. Extract code blocks BEFORE escaping HTML
  const codeBlocks: string[] = []
  src = src.replace(/```(\w*)\n?([\s\S]*?)```/g, (_match, lang, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    const langLabel = lang ? `<span class="ai-code-lang">${lang}</span>` : ''
    codeBlocks.push(`<pre class="ai-code-block">${langLabel}<code>${escaped}</code></pre>`)
    return `\x00CB${codeBlocks.length - 1}\x00`
  })

  // 3. Extract inline code
  const inlineCodes: string[] = []
  src = src.replace(/`([^`\n]+)`/g, (_match, code) => {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    inlineCodes.push(`<code class="ai-inline-code">${escaped}</code>`)
    return `\x00IC${inlineCodes.length - 1}\x00`
  })

  // 4. Now escape remaining HTML
  src = src
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 5. Process block-level elements
  const lines = src.split('\n')
  const out: string[] = []
  let inList = false

  for (const line of lines) {
    const trimmed = line.trim()

    // Placeholder line (code block) - close any list, output as-is
    if (trimmed.startsWith('\x00CB')) {
      if (inList) { out.push('</ul>'); inList = false }
      out.push(trimmed)
      continue
    }

    // Empty line
    if (!trimmed) {
      if (inList) { out.push('</ul>'); inList = false }
      out.push('<div class="h-2"></div>')
      continue
    }

    // Headers
    const h3 = trimmed.match(/^### (.+)$/)
    if (h3) { if (inList) { out.push('</ul>'); inList = false }; out.push(`<h4 class="ai-h">${h3[1]}</h4>`); continue }
    const h2 = trimmed.match(/^## (.+)$/)
    if (h2) { if (inList) { out.push('</ul>'); inList = false }; out.push(`<h3 class="ai-h">${h2[1]}</h3>`); continue }
    const h1 = trimmed.match(/^# (.+)$/)
    if (h1) { if (inList) { out.push('</ul>'); inList = false }; out.push(`<h2 class="ai-h">${h1[1]}</h2>`); continue }

    // Unordered list
    const ul = trimmed.match(/^[-*] (.+)$/)
    if (ul) {
      if (!inList) { out.push('<ul class="ai-ul">'); inList = true }
      out.push(`<li class="ai-li">${inlineFormat(ul[1])}</li>`)
      continue
    }

    // Ordered list
    const ol = trimmed.match(/^\d+\.\s+(.+)$/)
    if (ol) {
      if (!inList) { out.push('<ol class="ai-ol-list">'); inList = true }
      out.push(`<li class="ai-li ai-ol">${inlineFormat(ol[1])}</li>`)
      continue
    }

    // Normal paragraph
    if (inList) { out.push('</ul>'); inList = false }
    out.push(`<p class="ai-p">${inlineFormat(trimmed)}</p>`)
  }

  if (inList) out.push('</ul>')

  let html = out.join('')

  // 6. Restore placeholders
  html = html.replace(/\x00CB(\d+)\x00/g, (_m, i) => codeBlocks[parseInt(i)])
  html = html.replace(/\x00IC(\d+)\x00/g, (_m, i) => inlineCodes[parseInt(i)])

  return html
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="ai-link">$1</a>')
}
</script>

<style scoped>
.ai-panel-enter-active,
.ai-panel-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
}
.ai-panel-enter-from,
.ai-panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.ai-glow {
  box-shadow: 0 0 16px rgba(139, 92, 246, 0.3);
}

/* ── Markdown Prose Styles ── */
.ai-prose {
  word-break: break-word;
  overflow-wrap: break-word;
}
.ai-prose :deep(.ai-p) {
  margin: 0.2em 0;
  line-height: 1.7;
}
.ai-prose :deep(.ai-h) {
  font-weight: 600;
  margin: 0.6em 0 0.2em;
  line-height: 1.4;
}
.ai-prose :deep(h2.ai-h) { font-size: 1.1em; }
.ai-prose :deep(h3.ai-h) { font-size: 1.05em; }
.ai-prose :deep(h4.ai-h) { font-size: 1em; }

.ai-prose :deep(.ai-ul),
.ai-prose :deep(.ai-ol-list) {
  padding-left: 0;
  margin: 0.3em 0;
  list-style: none;
}
.ai-prose :deep(.ai-li) {
  position: relative;
  padding-left: 1.2em;
  margin: 0.2em 0;
  line-height: 1.6;
}
.ai-prose :deep(.ai-ul > .ai-li::before) {
  content: '•';
  position: absolute;
  left: 0.1em;
  color: var(--color-accent);
  font-weight: bold;
}
.ai-prose :deep(.ai-ol-list) {
  counter-reset: ai-ol-counter;
}
.ai-prose :deep(.ai-ol-list > .ai-li) {
  counter-increment: ai-ol-counter;
}
.ai-prose :deep(.ai-ol-list > .ai-li::before) {
  content: counter(ai-ol-counter) '.';
  position: absolute;
  left: 0;
  color: var(--color-accent);
  font-weight: 600;
  font-size: 0.85em;
}

.ai-prose :deep(.ai-code-block) {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.6rem;
  padding: 0.7em 0.9em;
  margin: 0.5em 0;
  overflow-x: auto;
  font-size: 0.82em;
  line-height: 1.6;
  font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
  white-space: pre;
}
.ai-prose :deep(.ai-code-lang) {
  position: absolute;
  top: 0.3em;
  right: 0.6em;
  font-size: 0.7em;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-sans);
}
.ai-prose :deep(.ai-inline-code) {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0.1em 0.35em;
  border-radius: 0.3rem;
  font-size: 0.88em;
  font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
}
.ai-prose :deep(.ai-link) {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.ai-prose :deep(.ai-link:hover) {
  opacity: 0.8;
}
.ai-prose :deep(strong) {
  font-weight: 600;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes msg-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
