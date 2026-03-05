// Pure lookup / conversion utilities — no framework imports

export function midiToFreq(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export function midiToFreqInverse(freq: number): number {
  return 69 + 12 * Math.log2(freq / 440);
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export function midiToNoteName(midiNote: number): string {
  const octave = Math.floor(midiNote / 12);
  const name = NOTE_NAMES[midiNote % 12];
  return `${name}${octave}`;
}

export const oscMixerLookup = {
  osc1Gain: new Float64Array(127),
  osc2Gain: new Float64Array(127),

  init(): void {
    for (let i = 0; i < 127; i++) {
      const oscMixer = i - 63;
      const mixerNorm = (oscMixer + 63) / 126;
      this.osc1Gain[i] = (1 - mixerNorm) * 0.4;
      this.osc2Gain[i] = mixerNorm * 0.4;
    }
  },

  getGains(oscMixer: number): { osc1: number; osc2: number } {
    const index = oscMixer + 63;
    return {
      osc1: this.osc1Gain[index],
      osc2: this.osc2Gain[index],
    };
  },
};

oscMixerLookup.init();

export function getWaveformName(value: number): string {
  if (value < 33) return 'Sinus';
  if (value < 67) return 'Dreieck';
  return 'Sägezahn';
}

export function getOscType(value: number): OscillatorType {
  if (value < 33) return 'sine';
  if (value < 67) return 'triangle';
  return 'sawtooth';
}
