<script setup lang="ts">
import { scales } from '../constants/scales'
import { rhythmPatterns } from '../constants/rhythms'

defineProps<{
  currentScaleIndex: number
  activeRhythm: number
  loopLength: number
  stereoWidenerMix: number
}>()

const emit = defineEmits<{
  setScale: [value: number]
  setRhythm: [value: number]
  setLoopLength: [value: number]
  updateStereoWidener: [value: number]
}>()

const rhythmDescriptions: Record<number, string> = {
  0: 'AUS (Keine Fixierung)',
  1: 'Rhythmus 1 – Heavy 303',
  2: 'Rhythmus 2 – Soft Pulse',
  3: 'Rhythmus 3 – Mid Groove',
  4: 'Rhythmus 4 – Off-Beat',
  5: 'Rhythmus 5 – Triplet',
  6: 'Rhythmus 6 – Four-on-Floor',
  7: 'Rhythmus 7 – Sparse',
  8: 'Rhythmus 8 – Syncopated',
  9: 'Rhythmus 9 – Minimal',
  10: 'Rhythmus 10 – Swing',
  11: 'Rhythmus 11 – Extreme',
  12: 'Rhythmus 12 – Acid Pattern',
}
</script>

<template>
  <div class="scale-rhythm-grid">
    <div class="control-item">
      <label class="section-label section-label--cyan">TONART:</label>
      <select class="select-cyan" :value="currentScaleIndex" @change="$emit('setScale', Number(($event.target as HTMLSelectElement).value))">
        <option v-for="(scale, i) in scales" :key="i" :value="i">{{ scale.name }}</option>
      </select>
      <span class="scale-notes">{{ scales[currentScaleIndex]?.noteNames }}</span>
    </div>
    <div class="control-item">
      <label class="section-label section-label--red">RHYTHMUS:</label>
      <select :value="activeRhythm" @change="$emit('setRhythm', Number(($event.target as HTMLSelectElement).value))">
        <option v-for="(desc, id) in rhythmDescriptions" :key="id" :value="id">{{ desc }}</option>
      </select>
      <div class="hint-text" style="color: #cc4444;">Rot markierte Werte sind fixiert und geschützt</div>
    </div>
    <div class="control-item">
      <label class="section-label section-label--orange">LOOP LENGTH:</label>
      <input type="range" class="synth-slider loop-slider" min="1" max="32" step="1" :value="loopLength" @input="$emit('setLoopLength', Number(($event.target as HTMLInputElement).value))">
      <div class="loop-length-display"><span>{{ loopLength }}</span> Steps</div>
    </div>
    <div class="control-item">
      <label class="section-label section-label--green">STEREO WIDTH:</label>
      <input type="range" class="synth-slider stereo-slider" min="0" max="100" :value="stereoWidenerMix" @input="$emit('updateStereoWidener', Number(($event.target as HTMLInputElement).value))">
      <div class="loop-length-display"><span style="color: var(--green);">{{ stereoWidenerMix }}%</span></div>
    </div>
  </div>
</template>

<style scoped>
.select-cyan {
  background: var(--bg-darkest);
  color: var(--cyan);
  border-color: var(--cyan);
  font-weight: bold;
}

.select-cyan:hover {
  border-color: var(--cyan);
  background: var(--bg-cyan);
}

.scale-notes {
  color: var(--cyan);
  font-size: 9px;
  opacity: 0.8;
  letter-spacing: 0.5px;
}

.loop-slider {
  height: 24px;
  min-width: 200px;
}

.loop-slider::-webkit-slider-thumb {
  background: linear-gradient(180deg, var(--orange), #b06010) !important;
  box-shadow: 0 0 6px rgba(224, 128, 32, 0.4) !important;
}

.loop-slider::-moz-range-thumb {
  background: linear-gradient(180deg, var(--orange), #b06010) !important;
  box-shadow: 0 0 6px rgba(224, 128, 32, 0.4) !important;
}

.stereo-slider {
  height: 24px;
  min-width: 150px;
}

.stereo-slider::-webkit-slider-thumb {
  background: linear-gradient(180deg, var(--green), #0a8040) !important;
  box-shadow: 0 0 6px rgba(0, 216, 112, 0.4) !important;
}

.stereo-slider::-moz-range-thumb {
  background: linear-gradient(180deg, var(--green), #0a8040) !important;
  box-shadow: 0 0 6px rgba(0, 216, 112, 0.4) !important;
}
</style>
