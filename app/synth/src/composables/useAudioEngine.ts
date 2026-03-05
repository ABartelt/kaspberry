import { initAudio, getAudioContext, getMasterGain, getDelayNode, getDelayFeedback, getReverbNode, getNoiseBuffer, setDelayType as engineSetDelayType, updateStereoWidener, updateReverbImpulse, createReverb } from '../audio/AudioEngine'
import type { SynthData } from '../types/synth'
import { calculateDelayTime } from '../constants/delay'

export function useAudioEngine() {
  return {
    initAudio,
    getAudioContext,
    getMasterGain,
    getDelayNode,
    getDelayFeedback,
    getReverbNode,
    getNoiseBuffer,
    setDelayType: (typeIndex: number, synthData: SynthData) => engineSetDelayType(typeIndex, synthData),
    updateStereoWidener,
    updateReverbImpulse,
    calculateDelayTime,
  }
}
