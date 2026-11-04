import * as React from "react"

import { cn } from "@/lib/utils"

// search-pill / form-field — soft-cloud pill by default, flips to a white field
// with an ink ring + soft halo on focus (Nike's one "focus ring" effect).
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-full bg-soft-cloud px-5 text-base text-ink placeholder:text-mute transition-[background-color,box-shadow] outline-none",
        "focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-soft-cloud",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:ring-2 aria-invalid:ring-sale aria-invalid:ring-offset-0",
        "file:text-ink file:inline-flex file:h-full file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }
