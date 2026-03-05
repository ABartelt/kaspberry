import { shallowRef, triggerRef } from 'vue'
import Voice from '../audio/Voice'
import type { SynthData, VoiceTriggerParams } from '../types/synth'

const VOICE_COUNT = 16
let voicePool: Voice[] = []
let nextVoiceIndex = 0
let currentStepVoices: Voice[] = []

// shallowRef for voice status display (not reactive for the Voice objects themselves)
const voiceStatuses = shallowRef<Array<'active' | 'releasing' | 'inactive'>>(Array(VOICE_COUNT).fill('inactive'))

export function useVoicePool() {
  function initVoices(audioContext: AudioContext, noiseBuffer: AudioBuffer, masterGain: GainNode, delayNode: AudioNode, reverbNode: AudioNode) {
    voicePool = []
    for (let i = 0; i < VOICE_COUNT; i++) {
      const voice = new Voice(audioContext, i, noiseBuffer, updateVoiceStatus)
      voice.connectToMaster(masterGain, delayNode, reverbNode)
      voicePool.push(voice)
    }
    updateVoiceStatus()
  }

  function getFreeVoice(): Voice {
    // 1. Find inactive voice
    for (let i = 0; i < VOICE_COUNT; i++) {
      const idx = (nextVoiceIndex + i) % VOICE_COUNT
      if (!voicePool[idx].isActive) {
        nextVoiceIndex = (idx + 1) % VOICE_COUNT
        return voicePool[idx]
      }
    }
    // 2. Find voice in release phase (oldest first)
    let oldestRelease: Voice | null = null
    let oldestReleaseTime = Infinity
    for (const voice of voicePool) {
      if (voice.isInRelease && voice.releaseStartTime < oldestReleaseTime) {
        oldestRelease = voice
        oldestReleaseTime = voice.releaseStartTime
      }
    }
    if (oldestRelease) return oldestRelease
    // 3. Steal oldest active voice
    let oldest: Voice = voicePool[0]
    for (const voice of voicePool) {
      if (voice.lastTriggerTime < oldest.lastTriggerTime) oldest = voice
    }
    return oldest
  }

  function stopAllVoices() {
    voicePool.forEach(v => { if (v.isActive) v.quickRelease() })
    currentStepVoices = []
  }

  function updateVoiceStatus() {
    const statuses = voicePool.map(v => v.isActive ? (v.isInRelease ? 'releasing' : 'active') : 'inactive')
    voiceStatuses.value = statuses as any
    triggerRef(voiceStatuses)
  }

  function releaseCurrentStepVoices(quick: boolean) {
    currentStepVoices.forEach(v => { if (v.isActive) { quick ? v.quickRelease() : v.release() } })
    currentStepVoices = []
  }

  function trackStepVoice(voice: Voice) {
    currentStepVoices.push(voice)
  }

  return { initVoices, getFreeVoice, stopAllVoices, voiceStatuses, releaseCurrentStepVoices, trackStepVoice, getVoicePool: () => voicePool }
}
