<script setup lang="ts">
import type { SynthData } from '../types/synth'
import { midiToNoteName, getWaveformName } from '../audio/lookup'

defineProps<{
  synthData: SynthData
}>()
</script>

<template>
  <div class="osc-layout">
    <!-- OSC 1 -->
    <div class="osc-module">
      <div class="module-header">OSC 1</div>
      <div class="module-body">
        <div class="param-row">
          <span class="param-label">PITCH</span>
          <input type="range" class="synth-slider" min="24" max="84" :value="synthData.osc1.globalPitch" @input="synthData.osc1.globalPitch = Number(($event.target as HTMLInputElement).value)">
          <span class="param-value">{{ midiToNoteName(synthData.osc1.globalPitch) }}</span>
        </div>
        <div class="param-row">
          <span class="param-label">WAVE</span>
          <input type="range" class="synth-slider" min="0" max="100" :value="synthData.osc1.waveform" @input="synthData.osc1.waveform = Number(($event.target as HTMLInputElement).value)">
          <span class="param-value">{{ getWaveformName(synthData.osc1.waveform) }}</span>
        </div>
      </div>
    </div>

    <!-- OSC 2 -->
    <div class="osc-module">
      <div class="module-header">OSC 2</div>
      <div class="module-body">
        <div class="param-row">
          <span class="param-label">OFFSET</span>
          <input type="range" class="synth-slider" min="-12" max="12" :value="synthData.osc2.offset" @input="synthData.osc2.offset = Number(($event.target as HTMLInputElement).value)">
          <span class="param-value">{{ synthData.osc2.offset > 0 ? '+' : '' }}{{ synthData.osc2.offset }}</span>
        </div>
        <div class="param-row">
          <span class="param-label">WAVE</span>
          <input type="range" class="synth-slider" min="0" max="100" :value="synthData.osc2.waveform" @input="synthData.osc2.waveform = Number(($event.target as HTMLInputElement).value)">
          <span class="param-value">{{ getWaveformName(synthData.osc2.waveform) }}</span>
        </div>
      </div>
    </div>

    <!-- MIXER -->
    <div class="osc-module mixer-module">
      <div class="module-header module-header--amber">MIXER</div>
      <div class="module-body">
        <div class="param-row">
          <span class="param-label">OSC1 &#8596; OSC2</span>
          <input type="range" class="synth-slider" min="-63" max="63" :value="synthData.oscMixer" @input="synthData.oscMixer = Number(($event.target as HTMLInputElement).value)">
          <span class="param-value">{{ synthData.oscMixer }}</span>
        </div>
      </div>
    </div>

    <!-- SUB -->
    <div class="osc-module">
      <div class="module-header module-header--green">SUB</div>
      <div class="module-body">
        <div class="param-row">
          <span class="param-label">LEVEL</span>
          <input type="range" class="synth-slider" min="0" max="100" :value="synthData.sub.level" @input="synthData.sub.level = Number(($event.target as HTMLInputElement).value)">
          <span class="param-value">{{ synthData.sub.level }}%</span>
        </div>
        <div class="param-row">
          <span class="param-label">OCTAVE</span>
          <input type="range" class="synth-slider" min="-2" max="0" step="1" :value="synthData.sub.octave" @input="synthData.sub.octave = Number(($event.target as HTMLInputElement).value)">
          <span class="param-value">{{ synthData.sub.octave }}</span>
        </div>
        <div class="param-row">
          <span class="param-label">WAVE</span>
          <input type="range" class="synth-slider" min="0" max="100" :value="synthData.sub.waveform" @input="synthData.sub.waveform = Number(($event.target as HTMLInputElement).value)">
          <span class="param-value">{{ getWaveformName(synthData.sub.waveform) }}</span>
        </div>
      </div>
    </div>

    <!-- UNISON -->
    <div class="osc-module">
      <div class="module-header module-header--orange">UNISON</div>
      <div class="module-body">
        <div class="param-row">
          <span class="param-label">VOICES</span>
          <input type="range" class="synth-slider" min="1" max="3" step="1" :value="synthData.unison.voices" @input="synthData.unison.voices = Number(($event.target as HTMLInputElement).value)">
          <span class="param-value">{{ synthData.unison.voices === 1 ? 'OFF' : synthData.unison.voices }}</span>
        </div>
        <div class="param-row">
          <span class="param-label">DETUNE</span>
          <input type="range" class="synth-slider" min="0" max="50" :value="synthData.unison.detune" @input="synthData.unison.detune = Number(($event.target as HTMLInputElement).value)">
          <span class="param-value">{{ synthData.unison.detune }}c</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.osc-layout {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  align-items: start;
}

.osc-module {
  background: var(--bg-darkest);
  border: 1px solid var(--border-panel);
  border-radius: var(--panel-radius);
  overflow: hidden;
}

.module-header {
  background: var(--bg-cyan);
  color: var(--cyan);
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 2px;
  text-align: center;
  padding: 6px 8px;
  border-bottom: 1px solid var(--border-dim);
}

.module-header--amber {
  background: var(--bg-yellow);
  color: var(--amber);
}

.module-header--green {
  background: var(--bg-green);
  color: var(--green);
}

.module-header--orange {
  background: var(--bg-orange);
  color: var(--orange);
}

.module-body {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.param-row {
  display: grid;
  grid-template-columns: 60px 1fr 55px;
  align-items: center;
  gap: 6px;
}

.param-label {
  color: var(--text-dim);
  font-size: 8px;
  font-weight: bold;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  white-space: nowrap;
}

.param-value {
  color: var(--amber-bright);
  font-size: 11px;
  font-weight: bold;
  text-align: right;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

@media (max-width: 1200px) {
  .osc-layout {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
