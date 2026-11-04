import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-24 w-full rounded-2xl bg-soft-cloud px-5 py-4 text-base text-ink placeholder:text-mute transition-[background-color,box-shadow] outline-none resize-none",
        "focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-soft-cloud",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:ring-2 aria-invalid:ring-sale aria-invalid:ring-offset-0",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
