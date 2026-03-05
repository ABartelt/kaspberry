<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import type { StepData } from '../types/synth'
import { parameters } from '../constants/parameters'

// Filter out toggle params — Slide has its own dedicated row
const sliderParams = computed(() => parameters.filter(p => !p.isToggle))
import SequencerRow from './SequencerRow.vue'
import SlideRow from './SlideRow.vue'

const props = defineProps<{
  steps: StepData[]
  currentStep: number
  loopLength: number
  lockedCells: Set<string>
  globalPitch: number
}>()

const emit = defineEmits<{
  updateStepValue: [step: number, param: string, value: number]
  toggleSlide: [step: number]
  randomizeStep: [step: number]
  randomizeParameter: [key: string]
  resetParameter: [key: string]
  maxParameter: [key: string]
}>()

// Direct DOM step highlighting for performance
const tableRef = ref<HTMLElement | null>(null)
let lastHighlighted: HTMLElement[] = []

function highlightStep(stepIndex: number) {
  requestAnimationFrame(() => {
    for (const el of lastHighlighted) {
      el.classList.remove('current-step')
    }
    lastHighlighted = []
    if (tableRef.value) {
      const cells = tableRef.value.querySelectorAll(`[data-step="${stepIndex}"]`)
      cells.forEach(cell => {
        (cell as HTMLElement).classList.add('current-step')
        lastHighlighted.push(cell as HTMLElement)
      })
    }
  })
}

watch(() => props.currentStep, highlightStep)
onMounted(() => nextTick(() => highlightStep(props.currentStep)))
</script>

<template>
  <div class="table-wrapper" ref="tableRef">
    <table class="sequencer-table">
      <thead>
        <tr>
          <th class="th-param"></th>
          <th class="th-ctrl"></th>
          <th v-for="s in 32" :key="s" class="step-header"
            :class="[
              (s - 1) % 4 === 0 ? 'beat-start' : '',
              s === 16 ? 'bar-end' : '',
              s === 17 ? 'bar-start' : '',
            ]">
            <span class="step-num">{{ s }}</span>
            <button class="step-rnd" @click="$emit('randomizeStep', s - 1)" title="Randomize step">&#9733;</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <SequencerRow
          v-for="param in sliderParams"
          :key="param.key"
          :param="param"
          :steps="steps"
          :locked-cells="lockedCells"
          :global-pitch="param.isNote ? globalPitch : undefined"
          @update-step-value="(step, value) => $emit('updateStepValue', step, param.key, value)"
          @randomize="$emit('randomizeParameter', param.key)"
          @reset="$emit('resetParameter', param.key)"
          @max="$emit('maxParameter', param.key)"
        />
        <SlideRow
          :steps="steps"
          :locked-cells="lockedCells"
          @toggle-slide="(step) => $emit('toggleSlide', step)"
        />
      </tbody>
    </table>
  </div>
</template>
