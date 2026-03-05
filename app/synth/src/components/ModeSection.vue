<script setup lang="ts">
import { Toggle } from '@/components/ui/toggle'
import { Slider } from '@/components/ui/slider'

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
    <Toggle :pressed="fastEnabled" @update:pressed="emit('toggleFast')" variant="default" size="lg" class="px-4 py-2 text-xs">FAST STUPID!</Toggle>
    <Toggle :pressed="slowEnabled" @update:pressed="emit('toggleSlow')" variant="orange" size="lg" class="px-4 py-2 text-xs">SLOW STUPID!</Toggle>

    <div class="inline-control">
      <label class="section-label--amber" title="Anzahl zufälliger Parameter, die nach SLOW STUPID zurückgesetzt werden">SLOWER STUPID (0-50):</label>
      <Slider
        :model-value="[slowerStupidAmount]"
        :min="0" :max="50" :step="1"
        class="w-[100px]"
        @update:model-value="v => emit('updateSlowerStupid', v[0])"
      />
      <span class="text-amber-bright text-xs font-bold min-w-[30px] text-center">{{ slowerStupidAmount }}</span>
    </div>
  </div>
</template>
