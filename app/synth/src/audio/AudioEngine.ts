import type { SynthData, DelayTypeConfig } from '../types/synth'
import { delayTypes, calculateDelayTime } from '../constants/delay'

let audioContext: AudioContext | null = null
let masterGain: GainNode | null = null
let reverbNode: ConvolverNode | null = null
let delayNode: DelayNode | null = null
let delayFeedback: GainNode | null = null
let delayToneFilter: BiquadFilterNode | null = null
let delayStereoPanner: StereoPannerNode | null = null
let delayModulationLFO: OscillatorNode | null = null
let noiseBuffer: AudioBuffer | null = null

const stereoWidenerMinimal = {
  input: null as GainNode | null,
  output: null as GainNode | null,
  splitter: null as ChannelSplitterNode | null,
  merger: null as ChannelMergerNode | null,
  delayL: null as DelayNode | null,
  delayR: null as DelayNode | null,
  lfo: null as OscillatorNode | null,
  lfoGainL: null as GainNode | null,
  lfoGainR: null as GainNode | null,
  dryGain: null as GainNode | null,
  wetGain: null as GainNode | null,
}

export function initAudio(): void {
  if (audioContext) return

  audioContext = new AudioContext()

  masterGain = audioContext.createGain()
  masterGain.gain.value = 0.3

  createStereoWidenerMinimal()
  createNoiseBuffer()

  // Reverb: convolver → masterGain
  reverbNode = audioContext.createConvolver()
  reverbNode.connect(masterGain)

  // Delay chain
  delayNode = audioContext.createDelay(5.0)
  delayFeedback = audioContext.createGain()
  delayToneFilter = audioContext.createBiquadFilter()
  delayStereoPanner = audioContext.createStereoPanner()
  delayModulationLFO = audioContext.createOscillator()

  delayNode.delayTime.value = 0.3
  delayFeedback.gain.value = 0.3

  delayToneFilter.type = 'lowpass'
  delayToneFilter.frequency.value = 5000
  delayToneFilter.Q.value = 0.5

  delayStereoPanner.pan.value = 0

  delayModulationLFO.type = 'sine'
  delayModulationLFO.frequency.value = 0.5

  // Feedback loop: delayNode → delayFeedback → toneFilter → stereoPanner → delayNode
  delayNode.connect(delayFeedback)
  delayFeedback.connect(delayToneFilter)
  delayToneFilter.connect(delayStereoPanner)
  delayStereoPanner.connect(delayNode)

  // Delay output → masterGain
  delayNode.connect(masterGain)

  delayModulationLFO.start()

  // Route: masterGain → widener.input, widener.output → destination
  if (stereoWidenerMinimal.input && stereoWidenerMinimal.output) {
    masterGain.connect(stereoWidenerMinimal.input)
    stereoWidenerMinimal.output.connect(audioContext.destination)
  } else {
    masterGain.connect(audioContext.destination)
  }
}

export function getAudioContext(): AudioContext | null {
  return audioContext
}

export function getMasterGain(): GainNode | null {
  return masterGain
}

export function getDelayNode(): DelayNode | null {
  return delayNode
}

export function getDelayFeedback(): GainNode | null {
  return delayFeedback
}

export function getReverbNode(): ConvolverNode | null {
  return reverbNode
}

export function getNoiseBuffer(): AudioBuffer | null {
  return noiseBuffer
}

export function createNoiseBuffer(): void {
  if (!audioContext) return

  const bufferSize = audioContext.sampleRate * 1
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  noiseBuffer = buffer
}

export function createReverb(synthData: SynthData): void {
  if (!audioContext || !reverbNode) return

  const duration = synthData.reverb.decayTime / 1000
  const sampleRate = audioContext.sampleRate
  const length = Math.floor(sampleRate * duration)
  const impulse = audioContext.createBuffer(2, length, sampleRate)

  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      const decay = Math.pow(1 - i / length, 2)
      channelData[i] = (Math.random() * 2 - 1) * decay
    }
  }

  reverbNode.buffer = impulse
}

export function updateReverbImpulse(synthData: SynthData): void {
  createReverb(synthData)
}

export function createDelay(synthData: SynthData): void {
  if (!audioContext || !masterGain) return

  delayNode = audioContext.createDelay(5.0)
  delayFeedback = audioContext.createGain()
  delayToneFilter = audioContext.createBiquadFilter()
  delayStereoPanner = audioContext.createStereoPanner()
  delayModulationLFO = audioContext.createOscillator()

  const delayTime = calculateDelayTime(synthData.delay.noteValueIndex, 120)
  delayNode.delayTime.value = delayTime
  delayFeedback.gain.value = synthData.delay.feedback / 100

  delayToneFilter.type = 'lowpass'
  delayToneFilter.frequency.value = 5000
  delayToneFilter.Q.value = 0.5

  delayStereoPanner.pan.value = 0

  delayModulationLFO.type = 'sine'
  delayModulationLFO.frequency.value = 0.5

  // Feedback loop: delayNode → delayFeedback → delayNode
  delayNode.connect(delayFeedback)
  delayFeedback.connect(delayToneFilter)
  delayToneFilter.connect(delayStereoPanner)
  delayStereoPanner.connect(delayNode)

  // Output: delayNode → masterGain
  delayNode.connect(masterGain)

  delayModulationLFO.start()
}

export function setDelayType(typeIndex: number, synthData: SynthData): void {
  if (!delayNode || !delayFeedback || !delayToneFilter || !delayStereoPanner || !delayModulationLFO) return

  const config: DelayTypeConfig = delayTypes[typeIndex]
  if (!config) return

  delayToneFilter.frequency.value = config.toneFilterFreq
  delayToneFilter.Q.value = config.toneFilterQ

  updateStereoWidener(config.stereoWidth)

  if (config.modulationDepth > 0 && config.modulationRate > 0 && audioContext) {
    delayModulationLFO.frequency.value = config.modulationRate

    const lfoGain = audioContext.createGain()
    lfoGain.gain.value = config.modulationDepth
    delayModulationLFO.connect(lfoGain)
    lfoGain.connect(delayNode.delayTime)
  }
}

export function updateStereoWidener(mix: number): void {
  if (!stereoWidenerMinimal.dryGain || !stereoWidenerMinimal.wetGain) return

  stereoWidenerMinimal.dryGain.gain.value = 1 - mix
  stereoWidenerMinimal.wetGain.gain.value = mix
}

export function createStereoWidenerMinimal(): void {
  if (!audioContext) return

  stereoWidenerMinimal.input = audioContext.createGain()
  stereoWidenerMinimal.output = audioContext.createGain()
  stereoWidenerMinimal.splitter = audioContext.createChannelSplitter(2)
  stereoWidenerMinimal.merger = audioContext.createChannelMerger(2)
  stereoWidenerMinimal.delayL = audioContext.createDelay(0.1)
  stereoWidenerMinimal.delayR = audioContext.createDelay(0.1)
  stereoWidenerMinimal.lfo = audioContext.createOscillator()
  stereoWidenerMinimal.lfoGainL = audioContext.createGain()
  stereoWidenerMinimal.lfoGainR = audioContext.createGain()
  stereoWidenerMinimal.dryGain = audioContext.createGain()
  stereoWidenerMinimal.wetGain = audioContext.createGain()

  // Fixed 22ms Haas delay
  stereoWidenerMinimal.delayL.delayTime.value = 0.022
  stereoWidenerMinimal.delayR.delayTime.value = 0.022

  // LFO: 0.5Hz, 3ms depth
  stereoWidenerMinimal.lfo.type = 'sine'
  stereoWidenerMinimal.lfo.frequency.value = 0.5

  const depthSeconds = 0.003
  stereoWidenerMinimal.lfoGainL.gain.value = depthSeconds
  stereoWidenerMinimal.lfoGainR.gain.value = -depthSeconds // inverted polarity for right

  stereoWidenerMinimal.lfo.connect(stereoWidenerMinimal.lfoGainL)
  stereoWidenerMinimal.lfo.connect(stereoWidenerMinimal.lfoGainR)
  stereoWidenerMinimal.lfoGainL.connect(stereoWidenerMinimal.delayL.delayTime)
  stereoWidenerMinimal.lfoGainR.connect(stereoWidenerMinimal.delayR.delayTime)

  // Default mix: 0 (dry only until explicitly updated)
  stereoWidenerMinimal.dryGain.gain.value = 1
  stereoWidenerMinimal.wetGain.gain.value = 0

  // Dry path: input → dryGain → output
  stereoWidenerMinimal.input.connect(stereoWidenerMinimal.dryGain)
  stereoWidenerMinimal.dryGain.connect(stereoWidenerMinimal.output)

  // Wet path: input → splitter → delayL/R → merger → wetGain → output
  stereoWidenerMinimal.input.connect(stereoWidenerMinimal.splitter)
  stereoWidenerMinimal.splitter.connect(stereoWidenerMinimal.delayL, 0)
  stereoWidenerMinimal.splitter.connect(stereoWidenerMinimal.delayR, 1)
  stereoWidenerMinimal.delayL.connect(stereoWidenerMinimal.merger, 0, 0)
  stereoWidenerMinimal.delayR.connect(stereoWidenerMinimal.merger, 0, 1)
  stereoWidenerMinimal.merger.connect(stereoWidenerMinimal.wetGain)
  stereoWidenerMinimal.wetGain.connect(stereoWidenerMinimal.output)

  stereoWidenerMinimal.lfo.start()
}
