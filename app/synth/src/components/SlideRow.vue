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
  padding: 5px 2px;
  font-size: 8px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 3px;
  letter-spacing: 0.5px;
  transition: background 0.1s, color 0.1s;
  text-transform: uppercase;
}

.slide-toggle--on {
  background: var(--bg-green);
  color: var(--green);
  border: 1px solid var(--green);
}

.slide-toggle--off {
  background: var(--bg-red);
  color: #883333;
  border: 1px solid #331111;
}

.slide-toggle--off:hover {
  border-color: #664444;
  color: #aa4444;
}
</style>
