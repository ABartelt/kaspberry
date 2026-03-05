<script setup lang="ts">
import type { SynthData } from '../types/synth'
import SynthSlider from './SynthSlider.vue'
import { Button } from '@/components/ui/button'

defineProps<{
  synthData: SynthData
}>()
</script>

<template>
  <div class="synthesizer-panel">
    <div class="synth-section">
      <h3>LOWPASS</h3>
      <SynthSlider label="Frequenz (50-10000 Hz) + Seq" :model-value="synthData.filter.frequency" :min="50" :max="10000" :display-value="`${synthData.filter.frequency} Hz`" @update:model-value="v => synthData.filter.frequency = v" />
      <SynthSlider label="Resonanz (0.1-20) + Seq" :model-value="Math.round(synthData.filter.resonance * 10)" :min="1" :max="200" :display-value="synthData.filter.resonance.toFixed(1)" @update:model-value="v => synthData.filter.resonance = v / 10" />
      <div class="synth-control">
        <label>Keyboard Tracking</label>
        <Button :variant="synthData.filter.keyTracking ? 'random' : 'reset'" class="w-full text-[10px] py-1.5" @click="synthData.filter.keyTracking = !synthData.filter.keyTracking">
          {{ synthData.filter.keyTracking ? 'ON' : 'OFF' }}
        </Button>
      </div>
    </div>

    <div class="synth-section">
      <h3>FILTER ENV</h3>
      <SynthSlider label="Attack (0-500ms)" v-model="synthData.filterEnvelope.attack" :min="0" :max="500" display-suffix="ms" />
      <SynthSlider label="Decay (0-1000ms)" v-model="synthData.filterEnvelope.decay" :min="0" :max="1000" display-suffix="ms" />
      <SynthSlider label="Sustain (0-100%)" v-model="synthData.filterEnvelope.sustain" :min="0" :max="100" display-suffix="%" />
      <SynthSlider label="Release (0-1000ms)" v-model="synthData.filterEnvelope.release" :min="0" :max="1000" display-suffix="ms" />
      <SynthSlider label="Amount (-10000 to +10000 Hz)" v-model="synthData.filterEnvelope.amount" :min="-10000" :max="10000" :display-value="`${synthData.filterEnvelope.amount > 0 ? '+' : ''}${synthData.filterEnvelope.amount} Hz`" />
      <div style="font-size: 8px; color: #888; margin-top: 4px;">TB-303 Essential! Filter Cutoff Modulation</div>
    </div>
  </div>
</template>
