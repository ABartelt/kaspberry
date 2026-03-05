<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  modelValue: number
  min: number
  max: number
  step?: number
  displayValue?: string
  displaySuffix?: string
}>(), {
  step: 1,
  displaySuffix: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function onInput(e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="synth-control">
    <label>{{ label }}</label>
    <input type="range" class="synth-slider"
      :min="min" :max="max" :step="step" :value="modelValue"
      @input="onInput">
    <span class="synth-value">{{ displayValue ?? `${modelValue}${displaySuffix}` }}</span>
  </div>
</template>
