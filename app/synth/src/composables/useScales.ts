import { ref, computed } from 'vue'
import { scales } from '../constants/scales'

const currentScaleIndex = ref(8) // Default: Blues C

export function useScales() {
  const currentScale = computed(() => scales[currentScaleIndex.value])

  function setScale(index: number) {
    currentScaleIndex.value = index
  }

  function getNoteInScale(noteOffset: number = 0, octaveRange: number = 2): number {
    const scale = scales[currentScaleIndex.value]
    const scaleIndex = Math.floor(Math.random() * scale.notes.length)
    const octaveOffset = Math.floor(Math.random() * (octaveRange * 2 + 1)) - octaveRange
    const noteInScale = scale.notes[scaleIndex]
    const finalNote = scale.root + noteInScale + (octaveOffset * 12)
    return Math.max(0, Math.min(48, finalNote))
  }

  function generateRandomScale() {
    const randomIndex = Math.floor(Math.random() * scales.length)
    setScale(randomIndex)
  }

  return { currentScaleIndex, currentScale, setScale, getNoteInScale, generateRandomScale }
}
