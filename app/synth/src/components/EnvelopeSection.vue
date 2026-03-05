<script setup lang="ts">
import type { SynthData } from '../types/synth'

defineProps<{
  synthData: SynthData
}>()
</script>

<template>
  <div class="synthesizer-panel">
    <div class="synth-section">
      <h3>ADSR ENVELOPE</h3>
      <div class="synth-control">
        <label>Attack (0-100ms) + Seq</label>
        <input type="range" class="synth-slider" min="0" max="100" :value="synthData.adsr.attack" @input="synthData.adsr.attack = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.adsr.attack }}ms</span>
      </div>
      <div class="synth-control">
        <label>Decay (0-200ms)</label>
        <input type="range" class="synth-slider" min="0" max="200" :value="synthData.adsr.decay" @input="synthData.adsr.decay = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.adsr.decay }}ms</span>
      </div>
      <div class="synth-control">
        <label>Sustain (0-100%)</label>
        <input type="range" class="synth-slider" min="0" max="100" :value="synthData.adsr.sustain" @input="synthData.adsr.sustain = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.adsr.sustain }}%</span>
      </div>
      <div class="synth-control">
        <label>Release (0-500ms) + Seq</label>
        <input type="range" class="synth-slider" min="0" max="500" :value="synthData.adsr.release" @input="synthData.adsr.release = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.adsr.release }}ms</span>
      </div>
    </div>
  </div>
</template>
