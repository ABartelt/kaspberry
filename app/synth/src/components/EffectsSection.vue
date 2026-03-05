<script setup lang="ts">
import type { SynthData } from '../types/synth'
import { delayNoteValues } from '../constants/delay'

defineProps<{
  synthData: SynthData
}>()

const emit = defineEmits<{
  setDelayType: [value: number]
}>()
</script>

<template>
  <div class="effects-grid">
    <div class="synth-section">
      <h3>REVERB</h3>
      <div class="synth-control">
        <label>Decay Time (0.1-5s)</label>
        <input type="range" class="synth-slider" min="100" max="5000" :value="synthData.reverb.decayTime" @input="synthData.reverb.decayTime = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ (synthData.reverb.decayTime / 1000).toFixed(1) }}s</span>
      </div>
      <div class="synth-control">
        <label>Pre-Delay (0-100ms)</label>
        <input type="range" class="synth-slider" min="0" max="100" :value="synthData.reverb.preDelay" @input="synthData.reverb.preDelay = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.reverb.preDelay }}ms</span>
      </div>
      <div class="synth-control">
        <label>Dry/Wet via Seq Send</label>
        <div class="hint-text">Controlled by Reverb Send</div>
      </div>
    </div>

    <div class="synth-section">
      <h3>DELAY</h3>
      <div class="synth-control">
        <label>Type</label>
        <select class="delay-type-select" :value="synthData.delay.type" @change="$emit('setDelayType', Number(($event.target as HTMLSelectElement).value))">
          <option value="0">Classic 303 Slapback</option>
          <option value="1">Ping-Pong Light</option>
          <option value="2">Acid Echo</option>
        </select>
        <div class="hint-text">Different delay characters</div>
      </div>
      <div class="synth-control">
        <label>Time (1/128 – 1/2 Note @ BPM)</label>
        <input type="range" class="synth-slider" min="0" max="18" step="1" :value="synthData.delay.noteValueIndex" @input="synthData.delay.noteValueIndex = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ delayNoteValues[synthData.delay.noteValueIndex]?.name }}</span>
      </div>
      <div class="synth-control">
        <label>Feedback (0-95%)</label>
        <input type="range" class="synth-slider" min="0" max="95" :value="synthData.delay.feedback" @input="synthData.delay.feedback = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.delay.feedback }}%</span>
      </div>
      <div class="synth-control">
        <label>Dry/Wet via Seq Send</label>
        <div class="hint-text">Controlled by Delay Send</div>
      </div>
    </div>

    <div class="synth-section">
      <h3>DISTORTION</h3>
      <div class="synth-control">
        <label>Drive (0-100)</label>
        <input type="range" class="synth-slider" min="0" max="100" :value="synthData.distortion.amount" @input="synthData.distortion.amount = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.distortion.amount }}</span>
      </div>
      <div class="synth-control">
        <label>Tone (500-10000 Hz)</label>
        <input type="range" class="synth-slider" min="500" max="10000" :value="synthData.distortion.tone" @input="synthData.distortion.tone = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.distortion.tone }} Hz</span>
      </div>
    </div>

    <div class="synth-section">
      <h3>SLIDE</h3>
      <div class="synth-control">
        <label>Glide Time (10-250ms)</label>
        <input type="range" class="synth-slider" min="10" max="250" :value="synthData.portamento.time" @input="synthData.portamento.time = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.portamento.time }}ms</span>
      </div>
      <div class="synth-control">
        <label>Glide Curve</label>
        <input type="range" class="synth-slider" min="1" max="30" :value="synthData.portamento.curve" @input="synthData.portamento.curve = Number(($event.target as HTMLInputElement).value)">
        <span class="synth-value">{{ synthData.portamento.curve <= 5 ? 'Linear' : synthData.portamento.curve <= 15 ? 'Medium' : 'Exponential' }}</span>
      </div>
      <div class="hint-text">Per Step via Slide ON/OFF</div>
    </div>

  </div>
</template>

<style scoped>
.delay-type-select {
  width: 100%;
  height: 32px;
  background: var(--bg-darkest);
  color: var(--orange);
  border: 1px solid var(--orange);
  cursor: pointer;
  font-weight: bold;
  font-size: 11px;
  border-radius: 4px;
  padding: 4px 8px;
}

.delay-type-select:hover {
  background: var(--bg-orange);
}

</style>
