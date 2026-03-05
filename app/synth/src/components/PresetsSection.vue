<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'

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
      <span class="text-amber-dim text-[10px] font-bold tracking-[0.5px]">{{ currentPage + 1 }}/{{ totalPages }}</span>
    </div>
    <div class="preset-carousel">
      <Button variant="nav" :disabled="currentPage === 0" @click="prevPage">&#9664;</Button>
      <div class="preset-slide">
        <Button v-for="p in currentPresets" :key="p.index"
          variant="preset"
          @click="emit('loadPreset', p.index)">
          {{ p.label }}
        </Button>
      </div>
      <Button variant="nav" :disabled="currentPage === totalPages - 1" @click="nextPage">&#9654;</Button>
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

.preset-carousel {
  display: flex;
  align-items: stretch;
  gap: 6px;
}

.preset-slide {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  flex: 1;
}
</style>
