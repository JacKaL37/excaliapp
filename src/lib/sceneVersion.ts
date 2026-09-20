import { getSceneVersion } from '@excalidraw/excalidraw'

export type SceneVersionVerdict = 'seed' | 'unchanged' | 'changed'

// Classifies a new scene version against the previously seen one.
// 'seed': no previous version recorded (first tracked frame) — do not queue.
// 'unchanged': same version — do nothing.
// 'changed': new version — queue a sync.
export function classifySceneVersion(prev: number | null, next: number): SceneVersionVerdict {
  if (prev === null) return 'seed'
  return next === prev ? 'unchanged' : 'changed'
}

export function currentSceneVersion(elements: readonly any[]): number {
  return getSceneVersion(elements)
}
