import { describe, it, expect, vi } from 'vitest'
import { classifySceneVersion } from './sceneVersion'

// The real @excalidraw/excalidraw bundle imports open-color/open-color.json
// without an import attribute; vitest externalizes node_modules, so Node's
// native ESM loader (Node 23+) rejects it. The unit tests below only exercise
// classifySceneVersion (pure logic), so stub the package's getSceneVersion
// with an equivalent sum of element versions. The editor's wiring against the
// real package is covered by typecheck.
vi.mock('@excalidraw/excalidraw', () => ({
  getSceneVersion: (elements: readonly any[]) =>
    (elements as any[]).reduce((sum, e) => sum + (e?.version || 0), 0),
}))

describe('classifySceneVersion', () => {
  it('seeds on the first observation', () => {
    expect(classifySceneVersion(null, 10)).toBe('seed')
  })

  it('reports unchanged when versions match', () => {
    expect(classifySceneVersion(10, 10)).toBe('unchanged')
  })

  it('reports changed when the version moves', () => {
    expect(classifySceneVersion(10, 11)).toBe('changed')
  })

  it('reports unchanged after a seed', () => {
    expect(classifySceneVersion(10, 10)).toBe('unchanged')
  })
})
