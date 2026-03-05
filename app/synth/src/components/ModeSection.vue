<script setup lang="ts">
defineProps<{
  fastEnabled: boolean
  slowEnabled: boolean
  slowerStupidAmount: number
}>()

const emit = defineEmits<{
  toggleFast: []
  toggleSlow: []
  updateSlowerStupid: [value: number]
}>()
</script>

<template>
  <div class="mode-controls">
    <button @click="$emit('toggleFast')" :class="fastEnabled ? 'stupid-btn-on' : 'stupid-btn-off'">FAST STUPID!</button>
    <button @click="$emit('toggleSlow')" :class="slowEnabled ? 'stupid2-btn-on' : 'stupid2-btn-off'">SLOW STUPID!</button>

    <div class="inline-control">
      <label class="section-label--amber" title="Anzahl zufälliger Parameter, die nach SLOW STUPID zurückgesetzt werden">SLOWER STUPID (0-50):</label>
      <input type="range" min="0" max="50" :value="slowerStupidAmount" class="mode-slider" @input="$emit('updateSlowerStupid', Number(($event.target as HTMLInputElement).value))">
      <span class="inline-value">{{ slowerStupidAmount }}</span>
    </div>
  </div>
</template>

<style scoped>
.mode-slider {
  width: 100px;
}

.inline-value {
  color: var(--amber-bright);
  font-size: 12px;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
}
</style>
