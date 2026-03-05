import type { ParameterDef } from '../types/synth'

export const parameters: ParameterDef[] = [
  { name: 'Volume', key: 'volume', min: 0, max: 127, default: 0 },
  { name: 'Pitch', key: 'pitch', min: 0, max: 48, default: 0, isNote: true },
  { name: 'OSC Mix', key: 'oscMixer', min: -63, max: 63, default: 0 },
  { name: 'Flt Freq', key: 'filterFreq', min: -63, max: 63, default: 0 },
  { name: 'Flt Res', key: 'filterRes', min: -63, max: 63, default: 0 },
  { name: 'Attack', key: 'attack', min: 0, max: 30, default: 0 },
  { name: 'Release', key: 'release', min: 0, max: 127, default: 0 },
  { name: 'Dly Send', key: 'delaySend', min: 0, max: 127, default: 0 },
  { name: 'Rvb Send', key: 'reverbSend', min: 0, max: 127, default: 0 },
  { name: 'Distort', key: 'distortion', min: 0, max: 127, default: 0 },
  { name: 'Slide', key: 'slide', min: 0, max: 1, default: 0, isToggle: true },
]
