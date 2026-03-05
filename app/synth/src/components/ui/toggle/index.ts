import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Toggle } from "./Toggle.vue"

export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded text-sm font-bold font-mono uppercase tracking-wide touch-manipulation min-h-[44px] cursor-pointer disabled:pointer-events-none disabled:opacity-50 outline-none transition-all whitespace-nowrap border active:scale-[0.97] active:brightness-[0.85]",
  {
    variants: {
      variant: {
        default:
          "data-[state=on]:bg-bg-cyan data-[state=on]:text-cyan data-[state=on]:border-cyan data-[state=on]:shadow-[0_0_10px_rgba(0,200,200,0.3)] data-[state=off]:bg-bg-darkest data-[state=off]:text-text-dimmer data-[state=off]:border-border-panel data-[state=off]:hover:bg-border-panel data-[state=off]:hover:text-text-dim",
        orange:
          "data-[state=on]:bg-bg-orange data-[state=on]:text-orange data-[state=on]:border-orange data-[state=on]:shadow-[0_0_10px_rgba(224,128,32,0.3)] data-[state=off]:bg-bg-darkest data-[state=off]:text-text-dimmer data-[state=off]:border-border-panel data-[state=off]:hover:bg-border-panel data-[state=off]:hover:text-text-dim",
        outline:
          "border border-border-panel bg-transparent data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      },
      size: {
        default: "px-4 py-2 text-xs",
        sm: "min-h-[36px] px-3 py-1 text-[10px]",
        lg: "min-h-[44px] px-4 py-2 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ToggleVariants = VariantProps<typeof toggleVariants>
