<script setup lang="ts">
import type { AccordionTriggerProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import {
  AccordionHeader,
  AccordionTrigger,
} from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<AccordionTriggerProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <AccordionHeader class="flex">
    <AccordionTrigger
      data-slot="accordion-trigger"
      v-bind="delegatedProps"
      :class="
        cn(
          'flex flex-1 items-center gap-2.5 px-3.5 py-2.5 bg-bg-darker text-amber font-mono text-xs font-bold tracking-[1.5px] uppercase cursor-pointer select-none min-h-[44px] border-b border-border-subtle list-none touch-manipulation transition-[background] duration-[120ms] hover:bg-[#131300] active:bg-[#181800] [&[data-state=open]]:border-b-amber-dim [&[data-state=open]>span.chevron]:rotate-90 [&[data-state=open]>span.chevron]:text-amber outline-none',
          props.class,
        )
      "
    >
      <span class="chevron text-[11px] inline-block min-w-[14px] text-amber-dim transition-transform duration-200">&#9656;</span>
      <slot />
    </AccordionTrigger>
  </AccordionHeader>
</template>
