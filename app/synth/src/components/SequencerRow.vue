<script setup lang="ts">
import type { StepData, ParameterDef } from '../types/synth'
import { midiToNoteName } from '../audio/lookup'

const props = defineProps<{
  param: ParameterDef
  steps: StepData[]
  lockedCells: Set<string>
  globalPitch?: number
}>()

const emit = defineEmits<{
  updateStepValue: [step: number, value: number]
  randomize: []
  reset: []
  max: []
}>()

function getValue(stepIndex: number): number {
  return props.steps[stepIndex][props.param.key as keyof StepData] as number
}

function isLocked(stepIndex: number): boolean {
  return props.lockedCells.has(`${stepIndex}-${props.param.key}`)
}

function displayValue(stepIndex: number): string {
  const val = getValue(stepIndex)
  if (props.param.isNote) return midiToNoteName(val + (props.globalPitch ?? 0))
  return String(val)
}

function onInput(stepIndex: number, e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  emit('updateStepValue', stepIndex, val)
}
</script>

<template>
  <tr>
    <td class="param-name">{{ param.name }}</td>
    <td class="param-controls">
      <div class="ctrl-group">
        <button class="ctrl-btn ctrl-btn--random" @click="$emit('randomize')" title="Randomize">&#9733;</button>
        <button class="ctrl-btn ctrl-btn--reset" @click="$emit('reset')" title="Reset">&#10005;</button>
        <button class="ctrl-btn ctrl-btn--max" @click="$emit('max')" title="Max">&#9650;</button>
      </div>
    </td>
    <td v-for="s in 32" :key="s" :data-step="s - 1"
      :class="{ locked: isLocked(s - 1) }">
      <input type="range" class="step-slider"
        :min="param.min" :max="param.max"
        :value="getValue(s - 1)"
        orient="vertical"
        @input="onInput(s - 1, $event)">
      <div class="step-value" :class="{ 'step-value--locked': isLocked(s - 1) }">
        {{ displayValue(s - 1) }}
      </div>
    </td>
  </tr>
</template>

<style scoped>
.ctrl-group {
  display: flex;
  gap: 0;
}

.ctrl-btn {
  padding: 4px 6px;
  font-size: 8px;
  min-height: 0;
  min-width: 0;
  line-height: 1;
  border-radius: 0;
  border: 1px solid var(--border-panel);
  background: var(--bg-darkest);
  color: var(--text-dim);
  cursor: pointer;
  transition: background 0.1s, color 0.1s;
}

.ctrl-btn:first-child {
  border-radius: 3px 0 0 3px;
}

.ctrl-btn:last-child {
  border-radius: 0 3px 3px 0;
}

.ctrl-btn + .ctrl-btn {
  margin-left: -1px;
}

.ctrl-btn:hover {
  position: relative;
  z-index: 1;
}

.ctrl-btn--random:hover {
  background: var(--bg-cyan);
  color: var(--cyan);
  border-color: var(--cyan);
}

.ctrl-btn--reset:hover {
  background: var(--bg-red);
  color: var(--red);
  border-color: var(--red);
}

.ctrl-btn--max:hover {
  background: var(--bg-orange);
  color: var(--orange);
  border-color: var(--orange);
}

.step-value--locked {
  color: #cc4444 !important;
}
</style>
