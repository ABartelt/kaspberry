<script setup lang="ts">
import VoiceStatusDots from './VoiceStatusDots.vue'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

defineProps<{
  isPlaying: boolean
  bpm: number
  voiceStatuses: string[]
  chaosLevel: number
}>()

const emit = defineEmits<{
  togglePlay: []
  updateBpm: [value: number]
  updateChaosLevel: [value: number]
}>()

const chaosOptions = [
  { value: 0, label: 'LOVE', color: 'love' as const },
  { value: 1, label: 'HATE', color: 'hate' as const },
  { value: 2, label: 'SABOTAGE', color: 'sabotage' as const },
]
</script>

<template>
  <div class="header-bar">
    <!-- 1/4: Transport + Chaos -->
    <div class="header-transport-chaos">
      <Button :variant="isPlaying ? 'stop' : 'play'" class="min-w-[44px] rounded-[5px] shrink-0" @click="emit('togglePlay')">
        <span v-if="isPlaying">&#9632;</span>
        <span v-else>&#9654;</span>
      </Button>
      <label class="text-text-dim text-[8px] font-bold tracking-[1.5px] whitespace-nowrap shrink-0">MODE</label>
      <div class="flex shrink-0">
        <Button v-for="(opt, i) in chaosOptions" :key="opt.value"
          variant="chaos"
          :class="[
            i === 0 ? 'rounded-l' : '',
            i === chaosOptions.length - 1 ? 'rounded-r' : '',
            i > 0 ? '-ml-px' : '',
            chaosLevel === opt.value ? 'relative z-[1]' : '',
            chaosLevel === opt.value && opt.color === 'love' ? 'bg-bg-green text-green border-green' : '',
            chaosLevel === opt.value && opt.color === 'hate' ? 'bg-bg-orange text-orange border-orange' : '',
            chaosLevel === opt.value && opt.color === 'sabotage' ? 'bg-bg-red text-red border-red' : '',
          ]"
          @click="emit('updateChaosLevel', opt.value)">
          {{ opt.label }}
        </Button>
      </div>
    </div>

    <!-- 1/4: BPM -->
    <div class="header-bpm">
      <label class="text-amber-dim text-[10px] font-bold tracking-[1.5px] uppercase shrink-0">BPM</label>
      <Slider
        :model-value="[bpm]"
        :min="10" :max="290" :step="1"
        class="flex-1 min-w-[80px]"
        @update:model-value="v => emit('updateBpm', v[0])"
      />
      <span class="bpm-value">{{ bpm }}</span>
    </div>

    <!-- 1/2: Voices -->
    <div class="header-voices">
      <VoiceStatusDots :statuses="voiceStatuses" />
    </div>
  </div>
</template>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-transport-chaos {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.header-bpm {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.header-voices {
  flex: 2;
  display: flex;
  min-width: 0;
}

.bpm-value {
  color: var(--amber-bright);
  font-size: 20px;
  font-weight: bold;
  min-width: 60px;
  text-align: center;
  letter-spacing: 1px;
  text-shadow: 0 0 8px var(--amber-glow);
}
</style>
