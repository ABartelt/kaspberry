import type { SynthData, SequencerState } from '../types/synth'
import { globalPresets } from '../constants/presets'
import { parameters } from '../constants/parameters'
import { calculateDelayTime } from '../constants/delay'

export function usePresets() {
  function loadPreset(
    presetNumber: number,
    synthData: SynthData,
    sequencerData: SequencerState,
    options: {
      setDelayType: (type: number) => void
      updateReverbImpulse: () => void
      applyRhythm: (id: number) => void
      activeRhythm: number
      isCellLocked: (step: number, param: string) => boolean
      delayNode: DelayNode | null
      delayFeedback: GainNode | null
    }
  ) {
    const preset = globalPresets[presetNumber]
    if (!preset) return

    // Apply preset values to synthData
    synthData.oscMixer = preset.oscMixer
    synthData.sub.level = preset.subLevel
    synthData.noise.level = preset.noiseLevel
    synthData.noise.bandpass.q = preset.noiseBpQ / 10
    synthData.noise.adsr.attack = preset.noiseAdsr[0]
    synthData.noise.adsr.decay = preset.noiseAdsr[1]
    synthData.noise.adsr.sustain = preset.noiseAdsr[2]
    synthData.noise.adsr.release = preset.noiseAdsr[3]
    synthData.adsr.attack = preset.ampAdsr[0]
    synthData.adsr.decay = preset.ampAdsr[1]
    synthData.adsr.sustain = preset.ampAdsr[2]
    synthData.adsr.release = preset.ampAdsr[3]
    synthData.filter.frequency = preset.filterFreq
    synthData.filter.resonance = preset.filterRes / 10
    synthData.filterEnvelope.amount = preset.filterEnvAmt
    synthData.filterEnvelope.attack = preset.filterEnv[0]
    synthData.filterEnvelope.decay = preset.filterEnv[1]
    synthData.filterEnvelope.sustain = preset.filterEnv[2]
    synthData.filterEnvelope.release = preset.filterEnv[3]
    synthData.portamento.time = preset.glideTime
    synthData.reverb.decayTime = preset.reverbDecay
    synthData.reverb.preDelay = preset.reverbPredelay
    synthData.delay.type = preset.delayType
    synthData.delay.noteValueIndex = preset.delayTime
    synthData.delay.time = calculateDelayTime(preset.delayTime, sequencerData.bpm)
    synthData.delay.feedback = preset.delayFeedback
    synthData.distortion.amount = preset.distDrive
    synthData.distortion.tone = preset.distTone

    // Apply audio engine changes
    options.setDelayType(preset.delayType)
    if (options.delayNode) options.delayNode.delayTime.value = synthData.delay.time
    if (options.delayFeedback) options.delayFeedback.gain.value = synthData.delay.feedback / 100

    // Reset sequencer params (except volume/pitch/slide/FX)
    const paramsToReset = ['oscMixer', 'filterFreq', 'filterRes', 'attack', 'release']
    for (let step = 0; step < 32; step++) {
      paramsToReset.forEach(paramKey => {
        if (options.isCellLocked(step, paramKey)) return
        const param = parameters.find(p => p.key === paramKey)
        if (!param) return
        ;(sequencerData.steps[step] as any)[paramKey] = param.default
      })
    }

    options.updateReverbImpulse()
    if (options.activeRhythm !== 0) options.applyRhythm(options.activeRhythm)
  }

  return { loadPreset }
}
