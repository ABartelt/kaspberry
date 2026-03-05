<script setup lang="ts">
import { Slider } from '@/components/ui/slider'

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

function onUpdate(val: number[]) {
  emit('update:modelValue', val[0])
}
</script>

<template>
  <div class="synth-control">
    <label>{{ label }}</label>
    <Slider
      :model-value="[modelValue]"
      :min="min"
      :max="max"
      :step="step"
      @update:model-value="onUpdate"
    />
    <span class="synth-value">{{ displayValue ?? `${modelValue}${displaySuffix}` }}</span>
  </div>
</template>
