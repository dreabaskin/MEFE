"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useRipple } from "@/hooks/use-ripple"

interface RippleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const RippleCard = React.forwardRef<HTMLDivElement, RippleCardProps>(
  ({ className, children, ...props }, ref) => {
    const { ripples, addRipple } = useRipple()

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm",
          "transition-all duration-300 ease-out",
          "hover:scale-[1.02] hover:shadow-xl",
          "hover:border-emerald-300/50",
          "before:absolute before:inset-0 before:rounded-lg before:p-[1px]",
          "before:bg-gradient-to-r before:from-emerald-400/0 before:to-teal-400/0",
          "before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:from-emerald-400/30 hover:before:to-teal-400/30 hover:before:opacity-100",
          "before:-z-10",
          className
        )}
        onClick={addRipple}
        {...props}
      >
        {children}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-emerald-400/30 pointer-events-none"
            style={{
              left: ripple.x - 50,
              top: ripple.y - 50,
              width: 100,
              height: 100,
              animation: 'ripple 0.6s ease-out',
            }}
          />
        ))}
      </div>
    )
  }
)
RippleCard.displayName = "RippleCard"

export { RippleCard }






