import { reactive } from 'vue'
import type { SynthData } from '../types/synth'

const synthData = reactive<SynthData>({
  osc1: { globalPitch: 36, waveform: 0 },
  osc2: { offset: 0, waveform: 50 },
  sub: { level: 0, octave: -1, waveform: 100 },
  noise: { level: 0, adsr: { attack: 10, decay: 20, sustain: 70, release: 30 }, bandpass: { frequency: 1000, q: 5, keyTracking: false } },
  oscMixer: 0,
  filter: { frequency: 5000, resonance: 1, keyTracking: false },
  filterEnvelope: { attack: 10, decay: 200, sustain: 30, release: 100, amount: 3000 },
  unison: { voices: 1, detune: 10 },
  portamento: { time: 100, curve: 10 },
  reverb: { enabled: true, decayTime: 2500, preDelay: 30 },
  delay: { type: 2, noteValueIndex: 6, time: 0.25, feedback: 40 },
  distortion: { amount: 50, tone: 5000 },
  adsr: { attack: 10, decay: 20, sustain: 70, release: 30 },
})

export function useSynthParams() {
  function resetSynth() {
    Object.assign(synthData.osc1, { globalPitch: 36, waveform: 0 })
    Object.assign(synthData.osc2, { offset: 0, waveform: 50 })
    Object.assign(synthData.sub, { level: 0, octave: -1, waveform: 100 })
    Object.assign(synthData.noise, { level: 0 })
    Object.assign(synthData.noise.adsr, { attack: 10, decay: 20, sustain: 70, release: 30 })
    Object.assign(synthData.noise.bandpass, { frequency: 1000, q: 5, keyTracking: false })
    synthData.oscMixer = 0
    Object.assign(synthData.filter, { frequency: 5000, resonance: 1, keyTracking: false })
    Object.assign(synthData.filterEnvelope, { attack: 10, decay: 200, sustain: 30, release: 100, amount: 3000 })
    Object.assign(synthData.unison, { voices: 1, detune: 10 })
    Object.assign(synthData.portamento, { time: 100, curve: 10 })
    Object.assign(synthData.reverb, { enabled: true, decayTime: 2500, preDelay: 30 })
    Object.assign(synthData.delay, { type: 2, noteValueIndex: 6, time: 0.25, feedback: 40 })
    Object.assign(synthData.distortion, { amount: 50, tone: 5000 })
    Object.assign(synthData.adsr, { attack: 10, decay: 20, sustain: 70, release: 30 })
  }

  return { synthData, resetSynth }
}
