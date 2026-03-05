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
    <div class="synth-section noise-section">
      <h3>NOISE</h3>
      <SynthSlider label="Level (0-100%)" v-model="synthData.noise.level" :min="0" :max="100" display-suffix="%" />
      <SynthSlider label="Bandpass Freq/Offset" :model-value="synthData.noise.bandpass.frequency" :min="50" :max="10000" :display-value="`${synthData.noise.bandpass.frequency} Hz`" @update:model-value="v => synthData.noise.bandpass.frequency = v" />
      <SynthSlider label="Bandpass Q (0.1-20)" :model-value="Math.round(synthData.noise.bandpass.q * 10)" :min="1" :max="200" :display-value="synthData.noise.bandpass.q.toFixed(1)" @update:model-value="v => synthData.noise.bandpass.q = v / 10" />
      <div class="synth-control">
        <label>BP Keyboard Tracking</label>
        <Button :variant="synthData.noise.bandpass.keyTracking ? 'random' : 'reset'" class="w-full text-[10px] py-1.5" @click="synthData.noise.bandpass.keyTracking = !synthData.noise.bandpass.keyTracking">
          {{ synthData.noise.bandpass.keyTracking ? 'ON' : 'OFF' }}
        </Button>
      </div>
    </div>

    <div class="synth-section noise-section">
      <h3>NOISE ADSR</h3>
      <SynthSlider label="Attack (0-100ms)" v-model="synthData.noise.adsr.attack" :min="0" :max="100" display-suffix="ms" />
      <SynthSlider label="Decay (0-200ms)" v-model="synthData.noise.adsr.decay" :min="0" :max="200" display-suffix="ms" />
      <SynthSlider label="Sustain (0-100%)" v-model="synthData.noise.adsr.sustain" :min="0" :max="100" display-suffix="%" />
      <SynthSlider label="Release (0-500ms)" v-model="synthData.noise.adsr.release" :min="0" :max="500" display-suffix="ms" />
    </div>
  </div>
</template>
