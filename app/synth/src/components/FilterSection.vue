<script setup lang="ts">
import type { SynthData } from '../types/synth'

defineProps<{
  synthData: SynthData
}>()
</script>

<template>
  <div class="synthesizer-panel">
    <div class="synth-section">
      <h3>LOWPASS</h3>
      <div class="synth-control">
        <label>Frequenz (50-10000 Hz) + Seq</label>
        <input type="range" class="synth-slider" min="50" max="10000" :value="synthData.filter.frequency" @input="synthData.filter.frequency = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.filter.frequency }} Hz</span>
      </div>
      <div class="synth-control">
        <label>Resonanz (0.1-20) + Seq</label>
        <input type="range" class="synth-slider" min="1" max="200" :value="Math.round(synthData.filter.resonance * 10)" @input="synthData.filter.resonance = Number(($event.target as HTMLInputElement).value) / 10">
        <span class="synth-value">{{ synthData.filter.resonance.toFixed(1) }}</span>
      </div>
      <div class="synth-control">
        <label>Keyboard Tracking</label>
        <button @click="synthData.filter.keyTracking = !synthData.filter.keyTracking" style="width: 100%; padding: 6px; font-size: 10px;" :class="synthData.filter.keyTracking ? 'random-btn' : 'reset-btn'">
          {{ synthData.filter.keyTracking ? 'ON' : 'OFF' }}
        </button>
      </div>
    </div>

    <div class="synth-section">
      <h3>FILTER ENV</h3>
      <div class="synth-control">
        <label>Attack (0-500ms)</label>
        <input type="range" class="synth-slider" min="0" max="500" :value="synthData.filterEnvelope.attack" @input="synthData.filterEnvelope.attack = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.filterEnvelope.attack }}ms</span>
      </div>
      <div class="synth-control">
        <label>Decay (0-1000ms)</label>
        <input type="range" class="synth-slider" min="0" max="1000" :value="synthData.filterEnvelope.decay" @input="synthData.filterEnvelope.decay = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.filterEnvelope.decay }}ms</span>
      </div>
      <div class="synth-control">
        <label>Sustain (0-100%)</label>
        <input type="range" class="synth-slider" min="0" max="100" :value="synthData.filterEnvelope.sustain" @input="synthData.filterEnvelope.sustain = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.filterEnvelope.sustain }}%</span>
      </div>
      <div class="synth-control">
        <label>Release (0-1000ms)</label>
        <input type="range" class="synth-slider" min="0" max="1000" :value="synthData.filterEnvelope.release" @input="synthData.filterEnvelope.release = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.filterEnvelope.release }}ms</span>
      </div>
      <div class="synth-control">
        <label>Amount (-10000 to +10000 Hz)</label>
        <input type="range" class="synth-slider" min="-10000" max="10000" :value="synthData.filterEnvelope.amount" @input="synthData.filterEnvelope.amount = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.filterEnvelope.amount > 0 ? '+' : '' }}{{ synthData.filterEnvelope.amount }} Hz</span>
      </div>
      <div style="font-size: 8px; color: #888; margin-top: 4px;">TB-303 Essential! Filter Cutoff Modulation</div>
    </div>
  </div>
</template>
