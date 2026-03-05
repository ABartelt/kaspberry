<script setup lang="ts">
import type { StepData } from '../types/synth'

defineProps<{
  steps: StepData[]
  lockedCells: Set<string>
}>()

const emit = defineEmits<{
  toggleSlide: [step: number]
}>()
</script>

<template>
  <tr>
    <td class="param-name">Slide</td>
    <td class="param-controls"></td>
    <td v-for="s in 32" :key="s" :data-step="s - 1"
      :class="{ locked: lockedCells.has(`${s - 1}-slide`) }">
      <button
        class="slide-toggle"
        :class="steps[s - 1].slide ? 'slide-toggle--on' : 'slide-toggle--off'"
        @click="$emit('toggleSlide', s - 1)">
        {{ steps[s - 1].slide ? 'ON' : 'OFF' }}
      </button>
    </td>
  </tr>
</template>

<style scoped>
.slide-toggle {
  width: 100%;
  padding: 4px 1px;
  font-size: 7px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 2px;
  letter-spacing: 0.5px;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
  text-transform: uppercase;
  touch-action: manipulation;
}

.slide-toggle--on {
  background: #001a00;
  color: var(--green);
  border: 1px solid #004400;
  box-shadow: 0 0 3px rgba(0, 216, 112, 0.15);
}

.slide-toggle--on:hover {
  background: var(--bg-green);
  border-color: var(--green);
}

.slide-toggle--off {
  background: transparent;
  color: #442222;
  border: 1px solid #1a0a0a;
}

.slide-toggle--off:hover {
  border-color: #442222;
  color: #884444;
}
</style>
