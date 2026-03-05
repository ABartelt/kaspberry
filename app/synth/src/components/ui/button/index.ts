import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-semibold font-mono uppercase tracking-wide transition-all touch-manipulation min-h-[44px] cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none active:scale-[0.97] active:brightness-[0.85]",
  {
    variants: {
      variant: {
        default:
          "bg-bg-green text-amber border border-amber-dim px-2 py-1 text-[9px] tracking-[0.3px] hover:bg-amber hover:text-black hover:border-amber",
        play:
          "bg-bg-green text-green border border-green px-4 py-2 text-base hover:bg-green hover:text-black hover:shadow-[0_0_12px_rgba(0,216,112,0.4)]",
        stop:
          "bg-bg-red text-red border border-red px-4 py-2 text-base hover:bg-red hover:text-black hover:shadow-[0_0_12px_rgba(216,48,48,0.4)]",
        random:
          "bg-bg-cyan text-cyan border border-cyan hover:bg-cyan hover:text-black hover:shadow-[0_0_8px_rgba(0,200,200,0.3)]",
        reset:
          "bg-bg-yellow text-amber border border-amber-dim hover:bg-amber hover:text-black",
        max:
          "bg-bg-orange text-orange border border-orange hover:bg-orange hover:text-black",
        preset:
          "bg-bg-green-dim text-amber border border-amber-dim min-h-[44px] text-[13px] px-1 py-2 font-bold tracking-[1px] hover:bg-amber hover:text-black hover:border-amber hover:shadow-[0_0_8px_rgba(237,160,0,0.35)] active:scale-[0.96]",
        stupidOn:
          "bg-bg-cyan text-cyan border border-cyan font-bold shadow-[0_0_10px_rgba(0,200,200,0.3)] hover:bg-cyan hover:text-black",
        stupidOff:
          "bg-bg-darkest text-text-dimmer border border-border-panel font-bold hover:bg-border-panel hover:text-text-dim hover:border-text-dim",
        stupid2On:
          "bg-bg-orange text-orange border border-orange font-bold shadow-[0_0_10px_rgba(224,128,32,0.3)] hover:bg-orange hover:text-black",
        stupid2Off:
          "bg-bg-darkest text-text-dimmer border border-border-panel font-bold hover:bg-border-panel hover:text-text-dim hover:border-text-dim",
        nav:
          "bg-bg-darkest text-amber border border-border-panel px-2 py-0.5 text-[10px] min-w-[28px] min-h-0 rounded-[3px] hover:bg-amber hover:text-black disabled:opacity-30",
        chaos:
          "min-h-[36px] px-2.5 py-1.5 text-[10px] font-bold tracking-[0.8px] rounded-none border border-border-panel bg-bg-darkest text-text-dimmer hover:bg-[#111] hover:text-text-dim",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "",
        sm: "min-h-[36px] px-3 py-1 text-[10px]",
        lg: "min-h-[44px] px-4 py-2 text-xs",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)
export type ButtonVariants = VariantProps<typeof buttonVariants>
