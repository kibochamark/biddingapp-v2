import * as React from "react"

import { cn } from "@/lib/utils"

function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "size-4 shrink-0 border border-hairline text-ink accent-ink outline-none",
        "focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Checkbox }
