export interface StepData {
  volume: number
  pitch: number
  oscMixer: number
  filterFreq: number
  filterRes: number
  attack: number
  release: number
  delaySend: number
  reverbSend: number
  distortion: number
  slide: boolean
}

export interface SequencerState {
  bpm: number
  currentStep: number
  loopLength: number
  isPlaying: boolean
  intervalId: number | null
  steps: StepData[]
}

export interface OscData {
  globalPitch: number
  waveform: number
}

export interface Osc2Data {
  offset: number
  waveform: number
}

export interface SubData {
  level: number
  octave: number
  waveform: number
}

export interface NoiseADSR {
  attack: number
  decay: number
  sustain: number
  release: number
}

export interface NoiseBandpass {
  frequency: number
  q: number
  keyTracking: boolean
}

export interface NoiseData {
  level: number
  adsr: NoiseADSR
  bandpass: NoiseBandpass
}

export interface FilterData {
  frequency: number
  resonance: number
  keyTracking: boolean
}

export interface FilterEnvelopeData {
  attack: number
  decay: number
  sustain: number
  release: number
  amount: number
}

export interface UnisonData {
  voices: number
  detune: number
}

export interface PortamentoData {
  time: number
  curve: number
}

export interface ReverbData {
  enabled: boolean
  decayTime: number
  preDelay: number
}

export interface DelayData {
  type: number
  noteValueIndex: number
  time: number
  feedback: number
}

export interface DistortionData {
  amount: number
  tone: number
}

export interface ADSRData {
  attack: number
  decay: number
  sustain: number
  release: number
}

export interface SynthData {
  osc1: OscData
  osc2: Osc2Data
  sub: SubData
  noise: NoiseData
  oscMixer: number
  filter: FilterData
  filterEnvelope: FilterEnvelopeData
  unison: UnisonData
  portamento: PortamentoData
  reverb: ReverbData
  delay: DelayData
  distortion: DistortionData
  adsr: ADSRData
}

export interface ParameterDef {
  name: string
  key: string
  min: number
  max: number
  default: number
  isNote?: boolean
  isToggle?: boolean
}

export interface ScaleDef {
  name: string
  root: number
  notes: number[]
  noteNames: string
}

export interface ChaosRange {
  min: number
  max: number
}

export interface ChaosProfile {
  name: string
  color: string
  description: string
  noise: ChaosRange
  distortion: ChaosRange
  filterRes: ChaosRange
  filterFreq: ChaosRange
  feedback: ChaosRange
  attack: ChaosRange
  oscMixer: ChaosRange
  volume: ChaosRange
  waveform: string
  reverbSend: ChaosRange
  delaySend: ChaosRange
}

export interface DelayNoteValue {
  name: string
  factor: number
}

export interface DelayTypeConfig {
  name: string
  description: string
  timeRange: { min: number; max: number }
  feedbackMultiplier: number
  toneFilterFreq: number
  toneFilterQ: number
  stereoWidth: number
  modulationDepth: number
  modulationRate: number
}

export interface RhythmStep {
  volume: number
  accent: number
  slide: boolean
}

export interface RhythmPattern {
  name: string
  data: [number, number, boolean][] | null
}

export interface PresetData {
  name: string
  oscMixer: number
  subLevel: number
  noiseLevel: number
  noiseBpQ: number
  noiseAdsr: [number, number, number, number]
  ampAdsr: [number, number, number, number]
  filterFreq: number
  filterRes: number
  filterEnvAmt: number
  filterEnv: [number, number, number, number]
  glideTime: number
  reverbDecay: number
  reverbPredelay: number
  delayType: number
  delayTime: number
  delayFeedback: number
  distDrive: number
  distTone: number
}

export interface VoiceTriggerParams {
  pitch: number
  oscMixer: number
  filterFrequency: number
  filterResonance: number
  attackTime: number
  decayTime: number
  sustainLevel: number
  duration: number
  useSlide: boolean
  lastFreq: number | null
  portamentoTime: number
  portamentoCurve: number
  noiseAttackTime: number
  noiseDecayTime: number
  noiseSustainLevel: number
  delaySend: number
  reverbSend: number
  distortion: number
  fadeIn: boolean
}
