import { ref } from 'vue'
import { chaosProfiles } from '../constants/chaos'
import { parameters } from '../constants/parameters'
import type { SynthData } from '../types/synth'

const chaosLevel = ref(0) // 0=LOVE, 1=HATE, 2=SABOTAGE

export function useChaos() {
  function getProfile() {
    return Object.values(chaosProfiles)[chaosLevel.value]
  }

  function getRandomInRange(min: number, max: number): number {
    return min + Math.random() * (max - min)
  }

  function getChaosValue(paramName: string): number {
    const profile = getProfile()
    const range = (profile as any)[paramName]
    if (range) return getRandomInRange(range.min, range.max)
    return Math.random() * 127
  }

  function getChaosValueForSequencer(paramKey: string, synthData: SynthData): number {
    const profile = getProfile()
    if (paramKey === 'volume' && profile.volume) return getRandomInRange(profile.volume.min, profile.volume.max)
    if (paramKey === 'oscMixer' && profile.oscMixer) return getRandomInRange(profile.oscMixer.min, profile.oscMixer.max)
    if (paramKey === 'delaySend' && profile.delaySend) return getRandomInRange(profile.delaySend.min, profile.delaySend.max)
    if (paramKey === 'reverbSend' && profile.reverbSend) return getRandomInRange(profile.reverbSend.min, profile.reverbSend.max)
    if (paramKey === 'distortion' && profile.distortion) return getRandomInRange(profile.distortion.min, profile.distortion.max)
    if (paramKey === 'attack' && profile.attack) return getRandomInRange(profile.attack.min, profile.attack.max) / 3.33
    if (paramKey === 'filterFreq' && profile.filterFreq) {
      const hz = getRandomInRange(profile.filterFreq.min, profile.filterFreq.max)
      return (hz - 1000) / 47.62
    }
    if (paramKey === 'filterRes' && profile.filterRes) {
      const res = getRandomInRange(profile.filterRes.min, profile.filterRes.max)
      return (res - synthData.filter.resonance) / 0.159
    }
    if (paramKey === 'release') {
      if (chaosLevel.value === 0) return getRandomInRange(100, 500)
      if (chaosLevel.value === 1) return getRandomInRange(50, 300)
      return getRandomInRange(10, 1000)
    }
    const param = parameters.find(p => p.key === paramKey)
    if (param) return param.min + Math.random() * (param.max - param.min)
    return Math.random() * 127
  }

  function updateChaosLevel(level: number) {
    chaosLevel.value = level
  }

  return { chaosLevel, getChaosValue, getChaosValueForSequencer, updateChaosLevel, getProfile }
}
