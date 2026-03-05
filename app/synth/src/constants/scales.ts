import type { ScaleDef } from '../types/synth'

export const scales: ScaleDef[] = [
  { name: 'Lydisch C', root: 0, notes: [0, 2, 4, 6, 7, 9, 11], noteNames: 'C D E F# G A B' },
  { name: 'Dorisch C', root: 0, notes: [0, 2, 3, 5, 7, 9, 10], noteNames: 'C D Eb F G A Bb' },
  { name: 'Mixolydisch C', root: 0, notes: [0, 2, 4, 5, 7, 9, 10], noteNames: 'C D E F G A Bb' },
  { name: 'Harmonisch Moll C', root: 0, notes: [0, 2, 3, 5, 7, 8, 11], noteNames: 'C D Eb F G Ab B' },
  { name: 'Melodisch Moll C Aufwärts', root: 0, notes: [0, 2, 3, 5, 7, 9, 11], noteNames: 'C D Eb F G A B' },
  { name: 'Phrygisch Dominant C', root: 0, notes: [0, 1, 4, 5, 7, 8, 10], noteNames: 'C Db E F G Ab Bb' },
  { name: 'Ungarisch Moll C', root: 0, notes: [0, 2, 3, 6, 7, 8, 11], noteNames: 'C D Eb F# G Ab B' },
  { name: 'Lydian Dominant C', root: 0, notes: [0, 2, 4, 6, 7, 9, 10], noteNames: 'C D E F# G A Bb' },
  { name: 'Blues C', root: 0, notes: [0, 3, 5, 6, 7, 10], noteNames: 'C Eb F F# G Bb' },
  { name: 'Hirajoshi C', root: 0, notes: [0, 2, 3, 7, 8], noteNames: 'C D Eb G Ab' },
  { name: 'In-Sen C', root: 0, notes: [0, 1, 5, 7, 8], noteNames: 'C Db F G Ab' },
  { name: 'Yo-Scale C', root: 0, notes: [0, 2, 4, 7, 9], noteNames: 'C D E G A' },
  { name: 'Prometheus C', root: 0, notes: [0, 2, 4, 6, 9, 10], noteNames: 'C D E F# A Bb' },
  { name: 'Overtone (Mixolydisch #11) C', root: 0, notes: [0, 2, 4, 6, 7, 9, 10], noteNames: 'C D E F# G A Bb' },
  { name: 'Romanian Minor C', root: 0, notes: [0, 2, 3, 6, 7, 9, 10], noteNames: 'C D Eb F# G A Bb' },
]
