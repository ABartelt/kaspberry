<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  loadPreset: [value: number]
}>()

const presetLabels = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX']

const currentPage = ref(0)
const totalPages = 5

const currentPresets = computed(() => {
  const start = currentPage.value * 4
  return presetLabels.slice(start, start + 4).map((label, i) => ({
    label,
    index: start + i + 1,
  }))
})

function prevPage() {
  if (currentPage.value > 0) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages - 1) currentPage.value++
}
</script>

<template>
  <div class="preset-wrapper">
    <div class="preset-header">
      <label class="section-label section-label--orange">PRESETS:</label>
      <span class="page-indicator">{{ currentPage + 1 }}/{{ totalPages }}</span>
    </div>
    <div class="preset-carousel">
      <button class="nav-btn" :disabled="currentPage === 0" @click="prevPage">&#9664;</button>
      <div class="preset-slide">
        <button v-for="p in currentPresets" :key="p.index"
          @click="$emit('loadPreset', p.index)"
          class="preset-btn">
          {{ p.label }}
        </button>
      </div>
      <button class="nav-btn" :disabled="currentPage === totalPages - 1" @click="nextPage">&#9654;</button>
    </div>
  </div>
</template>

<style scoped>
.preset-wrapper {
  padding: 8px 10px;
  border: 1px solid var(--border-panel);
  border-radius: var(--panel-radius);
  background: var(--bg-darker);
  box-shadow: var(--panel-inset);
}

.preset-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.page-indicator {
  color: var(--amber-dim);
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.preset-carousel {
  display: flex;
  align-items: stretch;
  gap: 6px;
}

.nav-btn {
  padding: 2px 8px;
  font-size: 10px;
  min-width: 28px;
  background: var(--bg-darkest);
  border: 1px solid var(--border-panel);
  color: var(--amber);
  cursor: pointer;
  border-radius: 3px;
  flex-shrink: 0;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.nav-btn:hover:not(:disabled) {
  background: var(--amber);
  color: #000;
}

.preset-slide {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  flex: 1;
}
</style>
