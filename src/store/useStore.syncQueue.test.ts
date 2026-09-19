import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useStore, SYNC_DEBOUNCE_MS } from './useStore'

const path = 'C:/drawings/test.excalidraw'
const elements = [{ id: 'e1', type: 'rectangle', version: 1 }]
const appState = { sceneVersion: 5, theme: 'light' }

beforeEach(() => {
  vi.useFakeTimers()
  useStore.setState({
    activeFile: { name: 'test.excalidraw', path, modified: false },
    isDirty: false,
    fileContent: '{}',
    openTabs: [],
  })
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

describe('scene sync queue', () => {
  it('marks dirty immediately and defers content sync', () => {
    useStore.getState().queueSceneChange(path, elements, appState, {})

    expect(useStore.getState().isDirty).toBe(true)
    expect(useStore.getState().fileContent).toBe('{}')

    vi.advanceTimersByTime(SYNC_DEBOUNCE_MS)
    expect(useStore.getState().fileContent).toContain('"elements"')
  })

  it('coalesces rapid changes into one content sync', () => {
    const spy = vi.spyOn(useStore.getState(), 'setFileContent')

    useStore.getState().queueSceneChange(path, elements, appState, {})
    vi.advanceTimersByTime(SYNC_DEBOUNCE_MS / 2)
    useStore.getState().queueSceneChange(path, elements, { ...appState, sceneVersion: 6 }, {})
    vi.advanceTimersByTime(SYNC_DEBOUNCE_MS)

    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  it('flush applies pending content immediately', () => {
    useStore.getState().queueSceneChange(path, elements, appState, {})

    useStore.getState().flushPendingSync(path)

    expect(useStore.getState().fileContent).toContain('"elements"')
  })

  it('cancel drops the pending sync', () => {
    useStore.getState().queueSceneChange(path, elements, appState, {})

    useStore.getState().cancelPendingSync(path)
    vi.advanceTimersByTime(SYNC_DEBOUNCE_MS)

    expect(useStore.getState().fileContent).toBe('{}')
  })

  it('pending sync does not clobber a different active file', () => {
    useStore.getState().queueSceneChange(path, elements, appState, {})

    useStore.setState({
      activeFile: { name: 'other.excalidraw', path: 'C:/other.excalidraw', modified: false },
    })
    vi.advanceTimersByTime(SYNC_DEBOUNCE_MS)

    expect(useStore.getState().fileContent).toBe('{}')
  })
})
