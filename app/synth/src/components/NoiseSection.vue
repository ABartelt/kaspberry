<script setup lang="ts">
import type { SynthData } from '../types/synth'

defineProps<{
  synthData: SynthData
}>()
</script>

<template>
  <div class="synthesizer-panel">
    <div class="synth-section noise-section">
      <h3>NOISE</h3>
      <div class="synth-control">
        <label>Level (0-100%)</label>
        <input type="range" class="synth-slider" min="0" max="100" :value="synthData.noise.level" @input="synthData.noise.level = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.noise.level }}%</span>
      </div>
      <div class="synth-control">
        <label>Bandpass Freq/Offset</label>
        <input type="range" class="synth-slider" min="50" max="10000" :value="synthData.noise.bandpass.frequency" @input="synthData.noise.bandpass.frequency = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.noise.bandpass.frequency }} Hz</span>
      </div>
      <div class="synth-control">
        <label>Bandpass Q (0.1-20)</label>
        <input type="range" class="synth-slider" min="1" max="200" :value="Math.round(synthData.noise.bandpass.q * 10)" @input="synthData.noise.bandpass.q = Number(($event.target as HTMLInputElement).value) / 10">
        <span class="synth-value">{{ synthData.noise.bandpass.q.toFixed(1) }}</span>
      </div>
      <div class="synth-control">
        <label>BP Keyboard Tracking</label>
        <button @click="synthData.noise.bandpass.keyTracking = !synthData.noise.bandpass.keyTracking" style="width: 100%; padding: 6px; font-size: 10px;" :class="synthData.noise.bandpass.keyTracking ? 'random-btn' : 'reset-btn'">
          {{ synthData.noise.bandpass.keyTracking ? 'ON' : 'OFF' }}
        </button>
      </div>
    </div>

    <div class="synth-section noise-section">
      <h3>NOISE ADSR</h3>
      <div class="synth-control">
        <label>Attack (0-100ms)</label>
        <input type="range" class="synth-slider" min="0" max="100" :value="synthData.noise.adsr.attack" @input="synthData.noise.adsr.attack = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.noise.adsr.attack }}ms</span>
      </div>
      <div class="synth-control">
        <label>Decay (0-200ms)</label>
        <input type="range" class="synth-slider" min="0" max="200" :value="synthData.noise.adsr.decay" @input="synthData.noise.adsr.decay = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.noise.adsr.decay }}ms</span>
      </div>
      <div class="synth-control">
        <label>Sustain (0-100%)</label>
        <input type="range" class="synth-slider" min="0" max="100" :value="synthData.noise.adsr.sustain" @input="synthData.noise.adsr.sustain = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.noise.adsr.sustain }}%</span>
      </div>
      <div class="synth-control">
        <label>Release (0-500ms)</label>
        <input type="range" class="synth-slider" min="0" max="500" :value="synthData.noise.adsr.release" @input="synthData.noise.adsr.release = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.noise.adsr.release }}ms</span>
      </div>
    </div>
  </div>
</template>
