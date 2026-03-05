import type { DelayNoteValue, DelayTypeConfig } from '../types/synth'

export const delayNoteValues: DelayNoteValue[] = [
  { name: '1/128', factor: 1 / 32 },
  { name: '1/64', factor: 1 / 16 },
  { name: '1/32 T', factor: 1 / 12 },
  { name: '1/32', factor: 1 / 8 },
  { name: '1/16 T', factor: 1 / 6 },
  { name: '1/16.', factor: 3 / 16 },
  { name: '1/16', factor: 1 / 4 },
  { name: '1/8 T', factor: 1 / 3 },
  { name: '1/8.', factor: 3 / 8 },
  { name: '1/8', factor: 1 / 2 },
  { name: '1/4 T', factor: 2 / 3 },
  { name: '1/4.', factor: 3 / 4 },
  { name: '1/4', factor: 1 },
  { name: '1/2 T', factor: 4 / 3 },
  { name: '1/2.', factor: 3 / 2 },
  { name: '1/2', factor: 2 },
  { name: '1/1 T', factor: 8 / 3 },
  { name: '1/1.', factor: 3 },
  { name: '1/1', factor: 4 },
]

export const delayTypes: DelayTypeConfig[] = [
  {
    name: 'Classic 303 Slapback',
    description: 'Short, tight delay with damped highs',
    timeRange: { min: 0.06, max: 0.12 },
    feedbackMultiplier: 0.6,
    toneFilterFreq: 2000,
    toneFilterQ: 0.7,
    stereoWidth: 0,
    modulationDepth: 0,
    modulationRate: 0,
  },
  {
    name: 'Ping-Pong Light',
    description: 'Stereo bouncing delay',
    timeRange: { min: 0.1, max: 0.5 },
    feedbackMultiplier: 0.8,
    toneFilterFreq: 5000,
    toneFilterQ: 0.5,
    stereoWidth: 0.8,
    modulationDepth: 0,
    modulationRate: 0,
  },
  {
    name: 'Acid Echo',
    description: 'Classic acid delay with modulation',
    timeRange: { min: 0.05, max: 1.0 },
    feedbackMultiplier: 1.0,
    toneFilterFreq: 8000,
    toneFilterQ: 0.3,
    stereoWidth: 0.3,
    modulationDepth: 0.002,
    modulationRate: 0.5,
  },
]

export function calculateDelayTime(noteValueIndex: number, bpm: number): number {
  const quarterNoteDuration = 60 / bpm
  const noteFactor = delayNoteValues[noteValueIndex].factor
  return quarterNoteDuration * noteFactor
}
