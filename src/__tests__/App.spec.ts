import { describe, it, expect } from 'vitest'

describe('App', () => {
  it('knowledge model types are defined', async () => {
    const model = await import('../domains/knowledge/model')
    expect(model.STATUS_LABELS).toBeDefined()
    expect(model.STATUS_LABELS.draft).toBe('草稿')
    expect(model.STATUS_LABELS.understood).toBe('已理解')
    expect(model.STATUS_LABELS.actionable).toBe('可行动')
  })
})
