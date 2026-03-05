<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

defineProps<{
  title: string
  open?: boolean
}>()
</script>

<template>
  <Accordion type="single" collapsible :default-value="open ? 'item' : undefined">
    <AccordionItem value="item">
      <AccordionTrigger>{{ title }}</AccordionTrigger>
      <AccordionContent>
        <slot />
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
