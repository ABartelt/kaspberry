<script setup lang="ts">
import type { SynthData } from '../types/synth'
import { midiToNoteName, getWaveformName } from '../audio/lookup'
import { Slider } from '@/components/ui/slider'

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
          <Slider :model-value="[synthData.osc1.globalPitch]" :min="24" :max="84" :step="1" @update:model-value="v => synthData.osc1.globalPitch = v[0]" />
          <span class="param-value">{{ midiToNoteName(synthData.osc1.globalPitch) }}</span>
        </div>
        <div class="param-row">
          <span class="param-label">WAVE</span>
          <Slider :model-value="[synthData.osc1.waveform]" :min="0" :max="100" :step="1" @update:model-value="v => synthData.osc1.waveform = v[0]" />
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
          <Slider :model-value="[synthData.osc2.offset]" :min="-12" :max="12" :step="1" @update:model-value="v => synthData.osc2.offset = v[0]" />
          <span class="param-value">{{ synthData.osc2.offset > 0 ? '+' : '' }}{{ synthData.osc2.offset }}</span>
        </div>
        <div class="param-row">
          <span class="param-label">WAVE</span>
          <Slider :model-value="[synthData.osc2.waveform]" :min="0" :max="100" :step="1" @update:model-value="v => synthData.osc2.waveform = v[0]" />
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
          <Slider :model-value="[synthData.oscMixer]" :min="-63" :max="63" :step="1" @update:model-value="v => synthData.oscMixer = v[0]" />
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
          <Slider :model-value="[synthData.sub.level]" :min="0" :max="100" :step="1" @update:model-value="v => synthData.sub.level = v[0]" />
          <span class="param-value">{{ synthData.sub.level }}%</span>
        </div>
        <div class="param-row">
          <span class="param-label">OCTAVE</span>
          <Slider :model-value="[synthData.sub.octave]" :min="-2" :max="0" :step="1" @update:model-value="v => synthData.sub.octave = v[0]" />
          <span class="param-value">{{ synthData.sub.octave }}</span>
        </div>
        <div class="param-row">
          <span class="param-label">WAVE</span>
          <Slider :model-value="[synthData.sub.waveform]" :min="0" :max="100" :step="1" @update:model-value="v => synthData.sub.waveform = v[0]" />
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
          <Slider :model-value="[synthData.unison.voices]" :min="1" :max="3" :step="1" @update:model-value="v => synthData.unison.voices = v[0]" />
          <span class="param-value">{{ synthData.unison.voices === 1 ? 'OFF' : synthData.unison.voices }}</span>
        </div>
        <div class="param-row">
          <span class="param-label">DETUNE</span>
          <Slider :model-value="[synthData.unison.detune]" :min="0" :max="50" :step="1" @update:model-value="v => synthData.unison.detune = v[0]" />
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
