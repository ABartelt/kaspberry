<script setup lang="ts">
import type { SynthData } from '../types/synth'
import SynthSlider from './SynthSlider.vue'

defineProps<{
  synthData: SynthData
}>()
</script>

<template>
  <div class="synthesizer-panel">
    <div class="synth-section">
      <h3>ADSR ENVELOPE</h3>
      <SynthSlider label="Attack (0-100ms) + Seq" v-model="synthData.adsr.attack" :min="0" :max="100" display-suffix="ms" />
      <SynthSlider label="Decay (0-200ms)" v-model="synthData.adsr.decay" :min="0" :max="200" display-suffix="ms" />
      <SynthSlider label="Sustain (0-100%)" v-model="synthData.adsr.sustain" :min="0" :max="100" display-suffix="%" />
      <SynthSlider label="Release (0-500ms) + Seq" v-model="synthData.adsr.release" :min="0" :max="500" display-suffix="ms" />
    </div>
  </div>
</template>
