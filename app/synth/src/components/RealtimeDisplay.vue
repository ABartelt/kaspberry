<script setup lang="ts">
import type { StepData } from '../types/synth'
import { midiToNoteName } from '../audio/lookup'

const props = defineProps<{
  currentStep: number
  steps: StepData[]
  globalPitch: number
}>()

function getStep(): StepData {
  return props.steps[props.currentStep] || props.steps[0]
}
</script>

<template>
  <div class="realtime-values">
    <h2>STEP: <span class="step-number">{{ currentStep + 1 }}</span></h2>
    <div class="value-grid">
      <div class="value-item">
        <div class="value-label">Vol</div>
        <div class="value-display">{{ getStep().volume }}</div>
      </div>
      <div class="value-item">
        <div class="value-label">Pitch</div>
        <div class="value-display">{{ midiToNoteName(getStep().pitch + globalPitch) }}</div>
      </div>
      <div class="value-item">
        <div class="value-label">OSC</div>
        <div class="value-display">{{ getStep().oscMixer }}</div>
      </div>
      <div class="value-item">
        <div class="value-label">Flt.Frq</div>
        <div class="value-display">{{ getStep().filterFreq }}</div>
      </div>
      <div class="value-item">
        <div class="value-label">Flt.Res</div>
        <div class="value-display">{{ getStep().filterRes }}</div>
      </div>
      <div class="value-item">
        <div class="value-label">Att</div>
        <div class="value-display">{{ getStep().attack }}</div>
      </div>
      <div class="value-item">
        <div class="value-label">Rel</div>
        <div class="value-display">{{ getStep().release }}</div>
      </div>
      <div class="value-item">
        <div class="value-label">Dly</div>
        <div class="value-display">{{ getStep().delaySend }}</div>
      </div>
      <div class="value-item">
        <div class="value-label">Rvb</div>
        <div class="value-display">{{ getStep().reverbSend }}</div>
      </div>
      <div class="value-item">
        <div class="value-label">Dist</div>
        <div class="value-display">{{ getStep().distortion }}</div>
      </div>
      <div class="value-item">
        <div class="value-label">Slide</div>
        <div class="value-display" :class="getStep().slide ? 'slide-on-text' : 'slide-off-text'">{{ getStep().slide ? 'ON' : 'OFF' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.step-number {
  color: var(--amber-bright);
  font-size: 14px;
  text-shadow: 0 0 8px var(--amber-glow);
}

.slide-on-text {
  color: var(--green) !important;
}

.slide-off-text {
  color: var(--text-dimmer) !important;
}
</style>
