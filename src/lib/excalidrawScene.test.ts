import { describe, it, expect } from 'vitest'
import { serializeExcalidrawScene } from './excalidrawScene'

describe('serializeExcalidrawScene', () => {
  it('includes theme in the saved appState', () => {
    const appState = { theme: 'dark', viewBackgroundColor: '#000000', gridSize: null }

    const json = serializeExcalidrawScene([], appState, {})
    const parsed = JSON.parse(json)

    expect(parsed.appState.theme).toBe('dark')
    expect(parsed.appState.viewBackgroundColor).toBe('#000000')
  })

  it('preserves theme as undefined when the appState has none (light default)', () => {
    const json = serializeExcalidrawScene([], { gridSize: null }, {})
    const parsed = JSON.parse(json)

    expect(parsed.appState).not.toHaveProperty('theme')
  })
})
