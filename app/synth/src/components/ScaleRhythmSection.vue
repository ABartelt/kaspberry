<script setup lang="ts">
import { scales } from '../constants/scales'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

defineProps<{
  currentScaleIndex: number
  activeRhythm: number
  loopLength: number
  stereoWidenerMix: number
}>()

const emit = defineEmits<{
  setScale: [value: number]
  setRhythm: [value: number]
  setLoopLength: [value: number]
  updateStereoWidener: [value: number]
}>()

const rhythmDescriptions: Record<number, string> = {
  0: 'AUS (Keine Fixierung)',
  1: 'Rhythmus 1 – Heavy 303',
  2: 'Rhythmus 2 – Soft Pulse',
  3: 'Rhythmus 3 – Mid Groove',
  4: 'Rhythmus 4 – Off-Beat',
  5: 'Rhythmus 5 – Triplet',
  6: 'Rhythmus 6 – Four-on-Floor',
  7: 'Rhythmus 7 – Sparse',
  8: 'Rhythmus 8 – Syncopated',
  9: 'Rhythmus 9 – Minimal',
  10: 'Rhythmus 10 – Swing',
  11: 'Rhythmus 11 – Extreme',
  12: 'Rhythmus 12 – Acid Pattern',
}
</script>

<template>
  <div class="scale-rhythm-grid">
    <div class="control-item">
      <label class="section-label section-label--cyan">TONART:</label>
      <Select :model-value="String(currentScaleIndex)" @update:model-value="v => emit('setScale', Number(v))">
        <SelectTrigger class="text-cyan border-cyan font-bold hover:border-cyan hover:bg-bg-cyan">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="(scale, i) in scales" :key="i" :value="String(i)">{{ scale.name }}</SelectItem>
        </SelectContent>
      </Select>
      <span class="text-cyan text-[9px] opacity-80 tracking-[0.5px]">{{ scales[currentScaleIndex]?.noteNames }}</span>
    </div>
    <div class="control-item">
      <label class="section-label section-label--red">RHYTHMUS:</label>
      <Select :model-value="String(activeRhythm)" @update:model-value="v => emit('setRhythm', Number(v))">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem v-for="(desc, id) in rhythmDescriptions" :key="id" :value="String(id)">{{ desc }}</SelectItem>
        </SelectContent>
      </Select>
      <div class="hint-text" style="color: #cc4444;">Rot markierte Werte sind fixiert und geschützt</div>
    </div>
    <div class="control-item">
      <label class="section-label section-label--orange">LOOP LENGTH:</label>
      <Slider
        :model-value="[loopLength]"
        :min="1" :max="32" :step="1"
        class="h-6 min-w-[200px]"
        @update:model-value="v => emit('setLoopLength', v[0])"
      />
      <div class="loop-length-display"><span>{{ loopLength }}</span> Steps</div>
    </div>
    <div class="control-item">
      <label class="section-label section-label--green">STEREO WIDTH:</label>
      <Slider
        :model-value="[stereoWidenerMix]"
        :min="0" :max="100" :step="1"
        class="h-6 min-w-[150px]"
        @update:model-value="v => emit('updateStereoWidener', v[0])"
      />
      <div class="loop-length-display"><span style="color: var(--green);">{{ stereoWidenerMix }}%</span></div>
    </div>
  </div>
</template>
