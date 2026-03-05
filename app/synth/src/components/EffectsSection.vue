<script setup lang="ts">
import type { SynthData } from '../types/synth'
import { delayNoteValues } from '../constants/delay'
import SynthSlider from './SynthSlider.vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
      <SynthSlider label="Decay Time (0.1-5s)" :model-value="synthData.reverb.decayTime" :min="100" :max="5000" :display-value="`${(synthData.reverb.decayTime / 1000).toFixed(1)}s`" @update:model-value="v => synthData.reverb.decayTime = v" />
      <SynthSlider label="Pre-Delay (0-100ms)" v-model="synthData.reverb.preDelay" :min="0" :max="100" display-suffix="ms" />
      <div class="synth-control">
        <label>Dry/Wet via Seq Send</label>
        <div class="hint-text">Controlled by Reverb Send</div>
      </div>
    </div>

    <div class="synth-section">
      <h3>DELAY</h3>
      <div class="synth-control">
        <label>Type</label>
        <Select :model-value="String(synthData.delay.type)" @update:model-value="v => emit('setDelayType', Number(v))">
          <SelectTrigger class="text-orange border-orange font-bold hover:bg-bg-orange">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Classic 303 Slapback</SelectItem>
            <SelectItem value="1">Ping-Pong Light</SelectItem>
            <SelectItem value="2">Acid Echo</SelectItem>
          </SelectContent>
        </Select>
        <div class="hint-text">Different delay characters</div>
      </div>
      <SynthSlider label="Time (1/128 – 1/2 Note @ BPM)" :model-value="synthData.delay.noteValueIndex" :min="0" :max="18" :display-value="delayNoteValues[synthData.delay.noteValueIndex]?.name" @update:model-value="v => synthData.delay.noteValueIndex = v" />
      <SynthSlider label="Feedback (0-95%)" v-model="synthData.delay.feedback" :min="0" :max="95" display-suffix="%" />
      <div class="synth-control">
        <label>Dry/Wet via Seq Send</label>
        <div class="hint-text">Controlled by Delay Send</div>
      </div>
    </div>

    <div class="synth-section">
      <h3>DISTORTION</h3>
      <SynthSlider label="Drive (0-100)" v-model="synthData.distortion.amount" :min="0" :max="100" />
      <SynthSlider label="Tone (500-10000 Hz)" :model-value="synthData.distortion.tone" :min="500" :max="10000" :display-value="`${synthData.distortion.tone} Hz`" @update:model-value="v => synthData.distortion.tone = v" />
    </div>

    <div class="synth-section">
      <h3>SLIDE</h3>
      <SynthSlider label="Glide Time (10-250ms)" v-model="synthData.portamento.time" :min="10" :max="250" display-suffix="ms" />
      <SynthSlider label="Glide Curve" :model-value="synthData.portamento.curve" :min="1" :max="30" :display-value="synthData.portamento.curve <= 5 ? 'Linear' : synthData.portamento.curve <= 15 ? 'Medium' : 'Exponential'" @update:model-value="v => synthData.portamento.curve = v" />
      <div class="hint-text">Per Step via Slide ON/OFF</div>
    </div>
  </div>
</template>
