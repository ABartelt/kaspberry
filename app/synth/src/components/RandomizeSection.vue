<script setup lang="ts">
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
      <button @click="$emit('randomizeSynth')" class="random-btn">RANDOMIZE SYNTH</button>
      <button @click="$emit('resetSynth')" class="reset-btn">RESET SYNTH</button>
      <button @click="$emit('randomizeSequencer')" class="random-btn">RANDOMIZE SEQUENCER</button>
      <button @click="$emit('resetSequencer')" class="reset-btn">RESET SEQUENCER</button>
      <button @click="$emit('randomizeFX')" class="random-btn">RANDOMIZE FX</button>
      <button @click="$emit('resetFX')" class="reset-btn">RESET FX</button>
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
