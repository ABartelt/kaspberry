<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  statuses: string[]
}>()

const statusText = computed(() => {
  const active = props.statuses.filter(s => s === 'active').length
  const releasing = props.statuses.filter(s => s === 'releasing').length
  const total = props.statuses.length
  const used = active + releasing
  let text = `${used}/${total}`
  if (releasing > 0) text += `, ${releasing} releasing`
  return text
})
</script>

<template>
  <div class="voice-panel">
    <span class="voice-label">VOICES</span>
    <span class="voice-status-text">({{ statusText }})</span>
    <div class="voice-dots">
      <span v-for="(status, i) in statuses" :key="i"
        class="voice-dot"
        :class="{
          'voice-dot-active': status === 'active',
          'voice-dot-releasing': status === 'releasing',
          'voice-dot-inactive': status !== 'active' && status !== 'releasing'
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.voice-panel {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 4px 8px;
  background: var(--bg-darkest);
  border: 1px solid var(--border-dim);
  border-radius: 4px;
}

.voice-label {
  color: var(--text-dim);
  font-size: 8px;
  font-weight: bold;
  letter-spacing: 1.5px;
  white-space: nowrap;
}

.voice-status-text {
  color: var(--amber-dim);
  font-size: 9px;
  white-space: nowrap;
  flex-shrink: 0;
}

.voice-dots {
  display: flex;
  gap: 6px;
  flex: 1;
  justify-content: space-evenly;
}

.voice-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.voice-dot-active {
  background: var(--green);
  box-shadow: 0 0 6px rgba(0, 216, 112, 0.6);
}

.voice-dot-releasing {
  background: var(--amber);
  box-shadow: 0 0 6px var(--amber-glow);
}

.voice-dot-inactive {
  background: var(--border-dim);
}
</style>
