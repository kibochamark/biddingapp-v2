"use client"

import { useEffect } from "react"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const SOUND_CONFIGS: Record<string, { freq: number; duration: number; type: OscillatorType }> = {
  success: { freq: 880, duration: 0.12, type: "sine" },
  error:   { freq: 280, duration: 0.22, type: "sawtooth" },
  warning: { freq: 520, duration: 0.16, type: "triangle" },
  info:    { freq: 660, duration: 0.12, type: "sine" },
}

function playToastSound(type: string) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const config = SOUND_CONFIGS[type] ?? SOUND_CONFIGS.info
    osc.type = config.type
    osc.frequency.setValueAtTime(config.freq, ctx.currentTime)
    gain.gain.setValueAtTime(0.07, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + config.duration)
  } catch {
    // Blocked by browser autoplay policy — silently ignore
  }
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const container = document.querySelector("[data-sonner-toaster]")
    if (!container) return

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement && node.hasAttribute("data-sonner-toast")) {
            const type = node.getAttribute("data-type") ?? "normal"
            if (type !== "normal" && type !== "loading") {
              playToastSound(type)
            }
          }
        }
      }
    })

    observer.observe(container, { childList: true })
    return () => observer.disconnect()
  }, [])

  return (
    <Sonner
      theme={resolvedTheme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
