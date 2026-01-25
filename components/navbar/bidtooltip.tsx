import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Gavel } from "lucide-react"
import Link from "next/dist/client/link"

export function BidToolTip() {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                href="/profile/bids"
                className="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all whitespace-nowrap group ml-4"
              >
                <Gavel className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="z-120">
                <span className="xl:inline">My Bids</span>
            </TooltipContent>
        </Tooltip>
    )
}
