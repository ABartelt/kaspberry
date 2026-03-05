import { reactive, ref } from 'vue'
import type { SequencerState, StepData } from '../types/synth'
import { parameters } from '../constants/parameters'
import { midiToFreq, midiToNoteName } from '../audio/lookup'

function createDefaultStep(): StepData {
  return { volume: 0, pitch: 0, oscMixer: 0, filterFreq: 0, filterRes: 0, attack: 0, release: 0, delaySend: 0, reverbSend: 0, distortion: 0, slide: false }
}

const sequencerData = reactive<SequencerState>({
  bpm: 130,
  currentStep: 0,
  loopLength: 32,
  isPlaying: false,
  intervalId: null,
  steps: Array.from({ length: 32 }, createDefaultStep),
})

// Callbacks registered by App.vue
let onStepCallback: ((step: number) => void) | null = null

export function useSequencer() {
  function registerStepCallback(cb: (step: number) => void) {
    onStepCallback = cb
  }

  function startSequence() {
    if (sequencerData.isPlaying) return
    sequencerData.isPlaying = true
    const interval = (60 / sequencerData.bpm) * 1000 / 4 // 16th notes
    sequencerData.intervalId = window.setInterval(() => {
      if (onStepCallback) onStepCallback(sequencerData.currentStep)
      sequencerData.currentStep = (sequencerData.currentStep + 1) % sequencerData.loopLength
    }, interval) as unknown as number
  }

  function stopSequence() {
    sequencerData.isPlaying = false
    if (sequencerData.intervalId !== null) {
      clearInterval(sequencerData.intervalId)
      sequencerData.intervalId = null
    }
    sequencerData.currentStep = 0
  }

  function updateBPM(newBPM: number) {
    sequencerData.bpm = newBPM
    if (sequencerData.isPlaying) {
      stopSequence()
      startSequence()
    }
  }

  function setLoopLength(length: number) {
    sequencerData.loopLength = length
    if (sequencerData.isPlaying && sequencerData.currentStep >= length) {
      sequencerData.currentStep = 0
    }
  }

  function updateStepValue(step: number, param: string, value: number | boolean) {
    (sequencerData.steps[step] as any)[param] = value
  }

  function toggleSlide(step: number) {
    sequencerData.steps[step].slide = !sequencerData.steps[step].slide
  }

  return { sequencerData, startSequence, stopSequence, updateBPM, setLoopLength, updateStepValue, toggleSlide, registerStepCallback }
}
