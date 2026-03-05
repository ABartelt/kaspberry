import type { SynthData, SequencerState } from '../types/synth'
import { parameters } from '../constants/parameters'
import { midiToNoteName } from '../audio/lookup'

export function useRandomizer() {
  function randomizeSynth(
    synthData: SynthData,
    getChaosValue: (param: string) => number
  ) {
    // OSC2 offset
    synthData.osc2.offset = -12 + Math.floor(Math.random() * 25)
    // OSC1/2 waveform
    synthData.osc1.waveform = Math.floor(Math.random() * 101)
    synthData.osc2.waveform = Math.floor(Math.random() * 101)
    // OSC mixer
    synthData.oscMixer = Math.floor(Math.random() * 127) - 63
    // Sub
    synthData.sub.level = Math.floor(Math.random() * 101)
    synthData.sub.octave = -2 + Math.floor(Math.random() * 3)
    synthData.sub.waveform = Math.floor(Math.random() * 101)
    // Noise
    synthData.noise.level = Math.floor(getChaosValue('noise'))
    synthData.noise.bandpass.frequency = Math.floor(Math.random() * 9951) + 50
    synthData.noise.bandpass.q = (Math.floor(Math.random() * 200) + 1) / 10
    synthData.noise.adsr.attack = Math.floor(getChaosValue('attack'))
    synthData.noise.adsr.decay = Math.floor(Math.random() * 201)
    synthData.noise.adsr.sustain = Math.floor(Math.random() * 101)
    synthData.noise.adsr.release = Math.floor(Math.random() * 501)
    // ADSR
    synthData.adsr.attack = Math.floor(getChaosValue('attack'))
    synthData.adsr.decay = Math.floor(Math.random() * 201)
    synthData.adsr.sustain = Math.floor(Math.random() * 101)
    synthData.adsr.release = Math.floor(Math.random() * 501)
    // Filter
    synthData.filter.frequency = Math.floor(getChaosValue('filterFreq'))
    synthData.filter.resonance = getChaosValue('filterRes')
    // Filter envelope
    synthData.filterEnvelope.attack = Math.floor(Math.random() * 501)
    synthData.filterEnvelope.decay = Math.floor(Math.random() * 1001)
    synthData.filterEnvelope.sustain = Math.floor(Math.random() * 101)
    synthData.filterEnvelope.release = Math.floor(Math.random() * 1001)
    synthData.filterEnvelope.amount = Math.floor(Math.random() * 20001) - 10000
    // Portamento
    synthData.portamento.time = 10 + Math.floor(Math.random() * 241)
    synthData.portamento.curve = 1 + Math.floor(Math.random() * 30)
  }

  function resetSynthDefaults(synthData: SynthData) {
    synthData.osc2.offset = 0
    synthData.osc1.waveform = 0
    synthData.osc2.waveform = 50
    synthData.oscMixer = 0
    synthData.sub.level = 0
    synthData.sub.octave = -1
    synthData.sub.waveform = 100
    synthData.noise.level = 0
    synthData.noise.bandpass.frequency = 1000
    synthData.noise.bandpass.q = 5
    Object.assign(synthData.noise.adsr, { attack: 10, decay: 20, sustain: 70, release: 30 })
    Object.assign(synthData.adsr, { attack: 10, decay: 20, sustain: 70, release: 30 })
    Object.assign(synthData.filter, { frequency: 5000, resonance: 1 })
    Object.assign(synthData.filterEnvelope, { attack: 10, decay: 200, sustain: 30, release: 100, amount: 3000 })
    Object.assign(synthData.portamento, { time: 100, curve: 10 })
  }

  function randomizeSequencer(
    sequencerData: SequencerState,
    getNoteInScale: () => number,
    getChaosValueForSequencer: (key: string) => number,
    isCellLocked: (step: number, param: string) => boolean
  ) {
    for (let step = 0; step < 32; step++) {
      parameters.forEach(param => {
        if (isCellLocked(step, param.key)) return
        if (param.isToggle) {
          sequencerData.steps[step].slide = Math.random() > 0.5
        } else if (param.key === 'pitch') {
          sequencerData.steps[step].pitch = getNoteInScale()
        } else {
          const value = getChaosValueForSequencer(param.key)
          ;(sequencerData.steps[step] as any)[param.key] = Math.round(value)
        }
      })
    }
  }

  function resetSequencer(
    sequencerData: SequencerState,
    isCellLocked: (step: number, param: string) => boolean
  ) {
    for (let step = 0; step < 32; step++) {
      parameters.forEach(param => {
        if (isCellLocked(step, param.key)) return
        if (param.isToggle) {
          sequencerData.steps[step].slide = false
        } else {
          ;(sequencerData.steps[step] as any)[param.key] = param.default
        }
      })
    }
  }

  function randomizeFX(synthData: SynthData, getChaosValue: (param: string) => number) {
    synthData.reverb.decayTime = 100 + Math.floor(Math.random() * 4901)
    synthData.reverb.preDelay = Math.floor(Math.random() * 101)
    synthData.delay.noteValueIndex = Math.floor(Math.random() * 19)
    synthData.delay.feedback = Math.floor(getChaosValue('feedback') * 95)
    synthData.distortion.amount = Math.floor(Math.random() * 101)
    synthData.distortion.tone = 500 + Math.floor(Math.random() * 9501)
  }

  function resetFX(synthData: SynthData) {
    synthData.reverb.decayTime = 2500
    synthData.reverb.preDelay = 30
    synthData.delay.noteValueIndex = 6
    synthData.delay.time = 0.25
    synthData.delay.feedback = 40
    synthData.distortion.amount = 50
    synthData.distortion.tone = 5000
  }

  function randomizeStep(
    stepIndex: number,
    sequencerData: SequencerState,
    getNoteInScale: () => number,
    getChaosValueForSequencer: (key: string) => number,
    isCellLocked: (step: number, param: string) => boolean
  ) {
    parameters.forEach(param => {
      if (isCellLocked(stepIndex, param.key)) return
      if (param.isToggle) {
        sequencerData.steps[stepIndex].slide = Math.random() > 0.5
      } else if (param.key === 'pitch') {
        sequencerData.steps[stepIndex].pitch = getNoteInScale()
      } else {
        ;(sequencerData.steps[stepIndex] as any)[param.key] = Math.round(getChaosValueForSequencer(param.key))
      }
    })
  }

  function randomizeParameter(
    paramKey: string,
    sequencerData: SequencerState,
    getNoteInScale: () => number,
    getChaosValueForSequencer: (key: string) => number,
    isCellLocked: (step: number, param: string) => boolean
  ) {
    for (let step = 0; step < 32; step++) {
      if (isCellLocked(step, paramKey)) continue
      if (paramKey === 'slide') {
        sequencerData.steps[step].slide = Math.random() > 0.5
      } else if (paramKey === 'pitch') {
        sequencerData.steps[step].pitch = getNoteInScale()
      } else {
        ;(sequencerData.steps[step] as any)[paramKey] = Math.round(getChaosValueForSequencer(paramKey))
      }
    }
  }

  function resetParameter(
    paramKey: string,
    sequencerData: SequencerState,
    isCellLocked: (step: number, param: string) => boolean
  ) {
    const param = parameters.find(p => p.key === paramKey)
    if (!param) return
    for (let step = 0; step < 32; step++) {
      if (isCellLocked(step, paramKey)) continue
      if (param.isToggle) {
        sequencerData.steps[step].slide = false
      } else {
        ;(sequencerData.steps[step] as any)[paramKey] = param.default
      }
    }
  }

  function maxParameter(
    paramKey: string,
    sequencerData: SequencerState,
    isCellLocked: (step: number, param: string) => boolean
  ) {
    const param = parameters.find(p => p.key === paramKey)
    if (!param || param.isToggle) return
    const value = paramKey === 'oscMixer' ? param.min : param.max // OC1 = min for oscMixer
    for (let step = 0; step < 32; step++) {
      if (isCellLocked(step, paramKey)) continue
      ;(sequencerData.steps[step] as any)[paramKey] = value
    }
  }

  return {
    randomizeSynth, resetSynthDefaults, randomizeSequencer, resetSequencer,
    randomizeFX, resetFX, randomizeStep, randomizeParameter, resetParameter, maxParameter,
  }
}
