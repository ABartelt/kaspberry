<script setup lang="ts">
import type { TabsTriggerProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { TabsTrigger, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<TabsTriggerProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TabsTrigger
    data-slot="tabs-trigger"
    :class="cn(
      'flex-1 min-h-[44px] px-2 py-2.5 text-xs font-bold tracking-[1.5px] uppercase font-mono border-none border-r border-border-dim bg-bg-darkest text-text-dim cursor-pointer transition-[background,color] duration-[120ms] last:border-r-0 touch-manipulation hover:bg-[#0e0e04] hover:text-amber-dim data-[state=active]:bg-bg-darker data-[state=active]:text-amber data-[state=active]:border-b-2 data-[state=active]:border-b-amber data-[state=active]:shadow-[0_2px_8px_rgba(0,0,0,0.3)] disabled:pointer-events-none disabled:opacity-50',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </TabsTrigger>
</template>
