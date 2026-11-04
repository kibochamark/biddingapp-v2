import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[transform,background-color,color,opacity] active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // button-primary — the universal CTA pill, orange standing in for Nike's ink
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-sale text-white hover:bg-sale-deep focus-visible:ring-sale/20 dark:focus-visible:ring-sale/40",
        // button-secondary — soft-cloud pill, the low-emphasis alternate beside a primary
        secondary:
          "bg-soft-cloud text-ink hover:bg-hairline-soft",
        // hairline-bordered pill — filter-chip default / un-selected state
        outline:
          "border border-hairline bg-background text-ink hover:bg-soft-cloud",
        // button-outline-on-image — the crisp white pill anchored on photography
        onImage:
          "bg-background text-ink hover:bg-soft-cloud",
        ghost:
          "text-ink hover:bg-soft-cloud dark:hover:bg-soft-cloud",
        link: "text-ink underline-offset-4 hover:underline rounded-none active:scale-100",
      },
      size: {
        default: "h-12 px-8 has-[>svg]:px-6",
        sm: "h-10 gap-1.5 px-5 text-sm has-[>svg]:px-4",
        lg: "h-12 px-8 text-base has-[>svg]:px-6",
        // button-icon-circular
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
