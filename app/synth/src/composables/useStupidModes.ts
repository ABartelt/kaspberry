import { ref } from 'vue'

const fastEnabled = ref(false)
const slowEnabled = ref(false)
const slowerStupidAmount = ref(10)

let fastLoopCounter = 0
let fastActionIndex = 0
let slowTimerId: number | null = null
let slowLoopCounter = 0

// Callbacks registered by App.vue
let randomizeSynthFn: (() => void) | null = null
let randomizeSequencerFn: (() => void) | null = null
let resetFXFn: (() => void) | null = null
let randomizeFXFn: (() => void) | null = null
let slowRandomizeFn: (() => void) | null = null
let getBPMFn: (() => number) | null = null
let isPlayingFn: (() => boolean) | null = null

export function useStupidModes() {
  function registerCallbacks(cbs: {
    randomizeSynth: () => void
    randomizeSequencer: () => void
    resetFX: () => void
    randomizeFX: () => void
    slowRandomize: () => void
    getBPM: () => number
    isPlaying: () => boolean
  }) {
    randomizeSynthFn = cbs.randomizeSynth
    randomizeSequencerFn = cbs.randomizeSequencer
    resetFXFn = cbs.resetFX
    randomizeFXFn = cbs.randomizeFX
    slowRandomizeFn = cbs.slowRandomize
    getBPMFn = cbs.getBPM
    isPlayingFn = cbs.isPlaying
  }

  function executeFastStupidAction() {
    if (!fastEnabled.value) return
    const actions = [randomizeSynthFn, randomizeSequencerFn, resetFXFn, randomizeFXFn]
    const action = actions[fastActionIndex % actions.length]
    if (action) action()
    fastActionIndex++
  }

  // Called from sequencer step loop
  function onSequencerStep() {
    if (fastEnabled.value) {
      fastLoopCounter++
      if (fastLoopCounter % 32 === 0) {
        executeFastStupidAction()
      }
    }
  }

  function toggleFastStupid() {
    fastEnabled.value = !fastEnabled.value
    if (fastEnabled.value) {
      if (slowEnabled.value) toggleSlowStupid()
    } else {
      fastLoopCounter = 0
      fastActionIndex = 0
    }
  }

  function toggleSlowStupid() {
    slowEnabled.value = !slowEnabled.value
    if (slowEnabled.value) {
      if (fastEnabled.value) toggleFastStupid()
      startSlowTimer()
    } else {
      stopSlowTimer()
      slowLoopCounter = 0
    }
  }

  function startSlowTimer() {
    stopSlowTimer()
    const bpm = getBPMFn ? getBPMFn() : 130
    const interval = (60 / bpm) * 1000 / 4 * 64
    slowTimerId = window.setInterval(() => {
      if (isPlayingFn && isPlayingFn() && slowEnabled.value && slowRandomizeFn) {
        slowLoopCounter++
        slowRandomizeFn()
      }
    }, interval)
  }

  function stopSlowTimer() {
    if (slowTimerId !== null) {
      clearInterval(slowTimerId)
      slowTimerId = null
    }
  }

  function updateSlowTimerSpeed() {
    if (slowEnabled.value && slowTimerId !== null) {
      stopSlowTimer()
      startSlowTimer()
    }
  }

  function updateSlowerStupid(value: number) {
    slowerStupidAmount.value = value
  }

  return {
    fastEnabled, slowEnabled, slowerStupidAmount,
    toggleFastStupid, toggleSlowStupid, updateSlowerStupid,
    onSequencerStep, registerCallbacks, updateSlowTimerSpeed,
  }
}
