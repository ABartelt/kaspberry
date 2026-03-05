<script setup lang="ts">
import VoiceStatusDots from './VoiceStatusDots.vue'

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

function onBpmInput(e: Event) {
  emit('updateBpm', Number((e.target as HTMLInputElement).value))
}

const chaosOptions = [
  { value: 0, label: 'LOVE', color: 'love' },
  { value: 1, label: 'HATE', color: 'hate' },
  { value: 2, label: 'SABOTAGE', color: 'sabotage' },
]
</script>

<template>
  <div class="header-bar">
    <!-- 1/4: Transport + Chaos -->
    <div class="header-transport-chaos">
      <button :class="isPlaying ? 'transport-stop' : 'transport-play'" @click="$emit('togglePlay')">
        <span v-if="isPlaying">&#9632;</span>
        <span v-else>&#9654;</span>
      </button>
      <label class="chaos-label">MODE</label>
      <div class="chaos-btn-group">
        <button v-for="opt in chaosOptions" :key="opt.value"
          :class="['chaos-btn', `chaos-btn--${opt.color}`, { 'chaos-btn--active': chaosLevel === opt.value }]"
          @click="$emit('updateChaosLevel', opt.value)">
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- 1/4: BPM -->
    <div class="header-bpm">
      <label class="bpm-label">BPM</label>
      <input type="range" class="bpm-slider" min="10" max="290" :value="bpm" @input="onBpmInput">
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

.transport-play {
  background: var(--bg-green);
  border-color: var(--green);
  color: var(--green);
}
.transport-play:hover {
  background: var(--green);
  color: #000;
  box-shadow: 0 0 12px rgba(0, 216, 112, 0.4);
}

.transport-stop {
  background: var(--bg-red);
  border-color: var(--red);
  color: var(--red);
}
.transport-stop:hover {
  background: var(--red);
  color: #000;
  box-shadow: 0 0 12px rgba(216, 48, 48, 0.4);
}

.bpm-label {
  color: var(--amber-dim);
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  flex-shrink: 0;
}

.bpm-slider {
  flex: 1;
  min-width: 80px;
}

.chaos-label {
  color: var(--text-dim);
  font-size: 8px;
  font-weight: bold;
  letter-spacing: 1.5px;
  white-space: nowrap;
  flex-shrink: 0;
}

.chaos-btn-group {
  display: flex;
  gap: 0;
  flex-shrink: 0;
}

.chaos-btn {
  min-height: 36px;
  padding: 6px 10px;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0.8px;
  border-radius: 0;
  border: 1px solid var(--border-panel);
  background: var(--bg-darkest);
  color: var(--text-dimmer);
  cursor: pointer;
  transition: background 0.1s, color 0.1s, border-color 0.1s;
}

.chaos-btn:first-child {
  border-radius: 4px 0 0 4px;
}

.chaos-btn:last-child {
  border-radius: 0 4px 4px 0;
}

.chaos-btn + .chaos-btn {
  margin-left: -1px;
}

.chaos-btn--active {
  position: relative;
  z-index: 1;
}

.chaos-btn--love.chaos-btn--active {
  background: var(--bg-green);
  color: var(--green);
  border-color: var(--green);
}

.chaos-btn--hate.chaos-btn--active {
  background: var(--bg-orange);
  color: var(--orange);
  border-color: var(--orange);
}

.chaos-btn--sabotage.chaos-btn--active {
  background: var(--bg-red);
  color: var(--red);
  border-color: var(--red);
}

.chaos-btn:hover:not(.chaos-btn--active) {
  background: #111;
  color: var(--text-dim);
}
</style>
