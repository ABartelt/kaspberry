<script setup lang="ts">
defineProps<{
  title: string
  open?: boolean
}>()
</script>

<template>
  <details class="accordion-section" :open="open">
    <summary>{{ title }}</summary>
    <div class="accordion-content">
      <slot />
    </div>
  </details>
</template>
