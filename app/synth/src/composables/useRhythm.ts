import { ref } from 'vue'
import { rhythmPatterns } from '../constants/rhythms'
import type { SequencerState } from '../types/synth'

const activeRhythm = ref(6)
const lockedCells = ref<Set<string>>(new Set())

export function useRhythm() {
  function isCellLocked(step: number, paramKey: string): boolean {
    return lockedCells.value.has(`${step}-${paramKey}`)
  }

  function applyRhythm(rhythmId: number, sequencerData: SequencerState) {
    activeRhythm.value = rhythmId

    const pattern = rhythmPatterns[rhythmId]
    if (!pattern || !pattern.data) {
      lockedCells.value = new Set()
      return
    }

    const newLocked = new Set<string>()

    for (let step = 0; step < 32; step++) {
      const stepData = pattern.data[step]
      if (!stepData) continue

      const [volume, distortion, slide] = stepData

      sequencerData.steps[step].volume = volume
      sequencerData.steps[step].distortion = distortion
      sequencerData.steps[step].slide = slide

      // Lock cells that have non-zero values (matching original behavior)
      if (volume > 0) newLocked.add(`${step}-volume`)
      if (distortion > 0) newLocked.add(`${step}-distortion`)
      if (slide) newLocked.add(`${step}-slide`)
    }

    // Assign the complete set at once to trigger reactivity
    lockedCells.value = newLocked
  }

  function clearRhythm() {
    activeRhythm.value = 0
    lockedCells.value = new Set()
  }

  return { activeRhythm, lockedCells, isCellLocked, applyRhythm, clearRhythm }
}
