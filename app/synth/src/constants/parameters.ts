import type { ParameterDef } from '../types/synth'

export const parameters: ParameterDef[] = [
  { name: 'Lautstärke', key: 'volume', min: 0, max: 127, default: 0 },
  { name: 'Tonhöhe', key: 'pitch', min: 0, max: 48, default: 0, isNote: true },
  { name: 'OSC-Mixer', key: 'oscMixer', min: -63, max: 63, default: 0 },
  { name: 'Filterfrequenz', key: 'filterFreq', min: -63, max: 63, default: 0 },
  { name: 'Filterresonanz', key: 'filterRes', min: -63, max: 63, default: 0 },
  { name: 'Attack', key: 'attack', min: 0, max: 30, default: 0 },
  { name: 'Release', key: 'release', min: 0, max: 127, default: 0 },
  { name: 'Delay Send', key: 'delaySend', min: 0, max: 127, default: 0 },
  { name: 'Reverb Send', key: 'reverbSend', min: 0, max: 127, default: 0 },
  { name: 'Verzerrung', key: 'distortion', min: 0, max: 127, default: 0 },
  { name: 'Slide', key: 'slide', min: 0, max: 1, default: 0, isToggle: true },
]
