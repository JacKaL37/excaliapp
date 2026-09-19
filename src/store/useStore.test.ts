import { describe, it, expect, beforeEach } from 'vitest'
import { invoke } from '@tauri-apps/api/core'
import { useStore } from './useStore'
import { Preferences } from '../types'

const defaultPrefs: Preferences = {
  lastDirectory: null,
  recentDirectories: [],
  theme: 'system',
  sidebarVisible: true,
  showDecorations: true,
}

describe('setTheme', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    useStore.setState({ preferences: { ...defaultPrefs } })
  })

  it('sets light theme, removes .dark, and persists', () => {
    document.documentElement.classList.add('dark')

    useStore.getState().setTheme('light')

    expect(useStore.getState().preferences.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(invoke).toHaveBeenCalledWith('save_preferences', {
      preferences: expect.objectContaining({ theme: 'light' }),
    })
  })

  it('sets dark theme, adds .dark, and persists', () => {
    useStore.getState().setTheme('dark')

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(invoke).toHaveBeenCalledWith('save_preferences', {
      preferences: expect.objectContaining({ theme: 'dark' }),
    })
  })

  it('system theme follows prefers-color-scheme', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    })

    useStore.getState().setTheme('system')

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('keeps other preference fields intact', () => {
    useStore.setState({
      preferences: {
        ...defaultPrefs,
        lastDirectory: 'C:/drawings',
        recentDirectories: ['C:/drawings'],
      },
    })

    useStore.getState().setTheme('dark')

    expect(useStore.getState().preferences.lastDirectory).toBe('C:/drawings')
    expect(useStore.getState().preferences.recentDirectories).toEqual(['C:/drawings'])
  })
})
