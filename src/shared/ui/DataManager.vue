<!-- src/shared/ui/DataManager.vue -->
<template>
  <div>
    <!-- Trigger button -->
    <button
      class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm
             text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]
             cursor-pointer transition-colors"
      @click="open = true"
    >
      <span class="w-5 h-5 flex items-center justify-center shrink-0">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
        </svg>
      </span>
      <span v-show="!collapsed" class="whitespace-nowrap">数据管理</span>
    </button>

    <!-- Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/50" @click="open = false" />

          <!-- Dialog -->
          <div class="relative w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)]
                      rounded-2xl shadow-2xl animate-[modal-in_0.2s_ease-out] overflow-hidden">
            <!-- Header -->
            <div class="px-5 py-4 border-b border-[var(--color-border)]">
              <h2 class="text-base font-semibold text-[var(--color-text-primary)]">数据管理</h2>
              <p class="text-xs text-[var(--color-text-muted)] mt-1">导出备份或从备份文件恢复数据</p>
            </div>

            <!-- Body -->
            <div class="px-5 py-5 space-y-4">
              <!-- Export -->
              <div class="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <div class="flex items-center gap-3 mb-3">
                  <span class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <svg class="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                  </span>
                  <div>
                    <p class="text-sm font-medium text-[var(--color-text-primary)]">导出数据</p>
                    <p class="text-[11px] text-[var(--color-text-muted)]">将所有数据导出为 JSON 文件</p>
                  </div>
                </div>
                <button
                  :disabled="exporting"
                  class="w-full py-2 rounded-lg text-sm font-medium cursor-pointer transition-all
                         bg-emerald-500 hover:bg-emerald-600 text-white
                         disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="handleExport"
                >
                  {{ exporting ? '导出中...' : '导出备份' }}
                </button>
              </div>

              <!-- Import -->
              <div class="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)]">
                <div class="flex items-center gap-3 mb-3">
                  <span class="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                    <svg class="w-4.5 h-4.5 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </span>
                  <div>
                    <p class="text-sm font-medium text-[var(--color-text-primary)]">导入数据</p>
                    <p class="text-[11px] text-[var(--color-text-muted)]">从 JSON 备份文件恢复数据</p>
                  </div>
                </div>
                <button
                  :disabled="importing"
                  class="w-full py-2 rounded-lg text-sm font-medium cursor-pointer transition-all
                         bg-sky-500 hover:bg-sky-600 text-white
                         disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="fileInput?.click()"
                >
                  {{ importing ? '导入中...' : '选择备份文件' }}
                </button>
              </div>

              <!-- Status message -->
              <Transition name="slide">
                <div v-if="statusMessage" :class="[
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs',
                  statusType === 'success'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                ]">
                  <span>{{ statusType === 'success' ? '✅' : '❌' }}</span>
                  {{ statusMessage }}
                </div>
              </Transition>
            </div>

            <!-- Footer -->
            <div class="px-5 py-3 border-t border-[var(--color-border)] flex justify-end">
              <button
                class="px-4 py-1.5 rounded-lg text-sm text-[var(--color-text-secondary)]
                       hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
                @click="open = false"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Hidden file input -->
    <input ref="fileInput" type="file" accept=".json" class="hidden" @change="handleImport" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { openDB } from 'idb'

defineProps<{ collapsed?: boolean }>()

const open = ref(false)
const exporting = ref(false)
const importing = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')
const fileInput = ref<HTMLInputElement>()

interface BackupData {
  version: number
  exportedAt: string
  knowledge: unknown[]
  tasks: unknown[]
  habits: unknown[]
  habitLogs: unknown[]
  focusSessions: unknown[]
}

const DB_CONFIGS = [
  { dbName: 'atlas-db', stores: ['knowledge'], key: 'knowledge' },
  { dbName: 'atlas-db-tasks', stores: ['tasks'], key: 'tasks' },
  { dbName: 'atlas-db-habits', stores: ['habits', 'habit-logs'], keys: ['habits', 'habitLogs'] },
  { dbName: 'atlas-db-focus', stores: ['focus-sessions'], key: 'focusSessions' },
] as const

async function readStore(dbName: string, storeName: string): Promise<unknown[]> {
  try {
    const db = await openDB(dbName)
    if (!db.objectStoreNames.contains(storeName)) return []
    const data = await db.getAll(storeName)
    db.close()
    return data
  } catch {
    return []
  }
}

async function writeStore(dbName: string, storeName: string, items: unknown[]): Promise<void> {
  try {
    const db = await openDB(dbName)
    if (!db.objectStoreNames.contains(storeName)) {
      db.close()
      return
    }
    const tx = db.transaction(storeName, 'readwrite')
    for (const item of items) {
      await tx.store.put(item)
    }
    await tx.done
    db.close()
  } catch (err) {
    console.error(`[Atlas] Failed to write to ${dbName}/${storeName}:`, err)
  }
}

async function handleExport() {
  exporting.value = true
  statusMessage.value = ''

  try {
    const data: BackupData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      knowledge: await readStore('atlas-db', 'knowledge'),
      tasks: await readStore('atlas-db-tasks', 'tasks'),
      habits: await readStore('atlas-db-habits', 'habits'),
      habitLogs: await readStore('atlas-db-habits', 'habit-logs'),
      focusSessions: await readStore('atlas-db-focus', 'focus-sessions'),
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    const dateStr = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `atlas-backup-${dateStr}.json`
    a.click()
    URL.revokeObjectURL(url)

    const counts = [data.knowledge.length, data.tasks.length, data.habits.length, data.focusSessions.length]
    statusType.value = 'success'
    statusMessage.value = `导出成功！笔记 ${counts[0]} 条 · 任务 ${counts[1]} 条 · 习惯 ${counts[2]} 个 · 专注 ${counts[3]} 次`
  } catch (err) {
    statusType.value = 'error'
    statusMessage.value = `导出失败: ${err instanceof Error ? err.message : '未知错误'}`
  } finally {
    exporting.value = false
  }
}

async function handleImport(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  importing.value = true
  statusMessage.value = ''

  try {
    const text = await file.text()
    const data = JSON.parse(text) as BackupData

    if (!data.version || !data.exportedAt) {
      throw new Error('无效的备份文件格式')
    }

    if (data.knowledge?.length) await writeStore('atlas-db', 'knowledge', data.knowledge)
    if (data.tasks?.length) await writeStore('atlas-db-tasks', 'tasks', data.tasks)
    if (data.habits?.length) await writeStore('atlas-db-habits', 'habits', data.habits)
    if (data.habitLogs?.length) await writeStore('atlas-db-habits', 'habit-logs', data.habitLogs)
    if (data.focusSessions?.length) await writeStore('atlas-db-focus', 'focus-sessions', data.focusSessions)

    statusType.value = 'success'
    statusMessage.value = `导入成功！请刷新页面以加载新数据。`
  } catch (err) {
    statusType.value = 'error'
    statusMessage.value = `导入失败: ${err instanceof Error ? err.message : '文件格式错误'}`
  } finally {
    importing.value = false
  }
}
</script>
