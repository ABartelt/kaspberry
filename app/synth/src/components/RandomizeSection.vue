<script setup lang="ts">
import { Button } from '@/components/ui/button'

defineEmits<{
  randomizeSynth: []
  resetSynth: []
  randomizeSequencer: []
  resetSequencer: []
  randomizeFX: []
  resetFX: []
}>()
</script>

<template>
  <div class="randomize-wrapper">
    <label class="section-label section-label--cyan">RANDOMIZE:</label>
    <div class="randomize-grid">
      <Button variant="random" size="lg" class="text-[11px] px-3" @click="$emit('randomizeSynth')">RANDOMIZE SYNTH</Button>
      <Button variant="reset" size="lg" class="text-[11px] px-3" @click="$emit('resetSynth')">RESET SYNTH</Button>
      <Button variant="random" size="lg" class="text-[11px] px-3" @click="$emit('randomizeSequencer')">RANDOMIZE SEQUENCER</Button>
      <Button variant="reset" size="lg" class="text-[11px] px-3" @click="$emit('resetSequencer')">RESET SEQUENCER</Button>
      <Button variant="random" size="lg" class="text-[11px] px-3" @click="$emit('randomizeFX')">RANDOMIZE FX</Button>
      <Button variant="reset" size="lg" class="text-[11px] px-3" @click="$emit('resetFX')">RESET FX</Button>
    </div>
  </div>
</template>

<style scoped>
.randomize-wrapper {
  padding: 8px 10px;
  border: 1px solid var(--border-panel);
  border-radius: var(--panel-radius);
  background: var(--bg-darker);
  box-shadow: var(--panel-inset);
}

.randomize-wrapper .randomize-grid {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  box-shadow: none;
  margin-top: 6px;
}
</style>
