import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// badge-promo — hairline-bordered pill on top of photography ("Just In", "Ending Soon").
// Status/condition chips reuse the same pill geometry with a filled variant.
const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&_svg]:pointer-events-none [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-hairline bg-background text-ink",
        primary: "border-transparent bg-primary text-primary-foreground",
        inverse: "border-transparent bg-ink text-background",
        sale: "border-transparent bg-sale/10 text-sale",
        success: "border-transparent bg-success/10 text-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
