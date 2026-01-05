"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Search, Users, Sparkles, Shirt, Heart, Calendar as CalendarIcon } from "lucide-react"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  tips?: string[]
  illustration?: "wardrobe" | "outfit" | "calendar" | "mood" | "search" | "community"
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  tips,
  illustration,
  className,
}: EmptyStateProps) {
  const [isAnimating, setIsAnimating] = React.useState(false)

  React.useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const illustrations = {
    wardrobe: (
      <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
        <div className={cn(
          "relative",
          isAnimating && "animate-bounce"
        )}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-lg">
            <Shirt className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    ),
    outfit: (
      <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
        <div className={cn(
          "relative",
          isAnimating && "animate-bounce"
        )}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-lg">
            <Sparkles className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    ),
    calendar: (
      <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
        <div className={cn(
          "relative",
          isAnimating && "animate-bounce"
        )}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-lg">
            <CalendarIcon className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    ),
    mood: (
      <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
        <div className={cn(
          "relative",
          isAnimating && "animate-bounce"
        )}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-lg">
            <Heart className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    ),
    search: (
      <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
        <div className={cn(
          "relative",
          isAnimating && "animate-bounce"
        )}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-lg">
            <Search className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    ),
    community: (
      <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
        <div className={cn(
          "relative",
          isAnimating && "animate-bounce"
        )}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-lg">
            <Users className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
          </div>
        </div>
      </div>
    ),
  }

  return (
    <Card className={cn("glass-card border-emerald-200/50 shadow-lg card-hover", className)}>
      <CardContent className="py-6 px-5 text-center">
        {/* Animated Illustration */}
        {illustration && illustrations[illustration]}
        
        {/* Icon */}
        {!illustration && (
          <div className={cn(
            "inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-3",
            isAnimating && "animate-pulse"
          )}>
            <div className="text-2xl">{icon}</div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-emerald-900 mb-1.5">{title}</h3>

        {/* Description */}
        <p className="text-slate-600 mb-4 max-w-md mx-auto text-sm">
          {description}
        </p>

        {/* Action Button */}
        {action && (
          <Button
            onClick={action.onClick}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-sm px-5 py-2 mb-4 shadow-lg hover:shadow-xl transition-all"
          >
            {action.icon && <span className="mr-1.5">{action.icon}</span>}
            {action.label}
          </Button>
        )}

        {/* Tips */}
        {tips && tips.length > 0 && (
          <div className="mt-4 pt-4 border-t border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-2">💡 Quick Tips:</p>
            <ul className="space-y-1 text-left max-w-md mx-auto">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-1.5 text-xs text-slate-600">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

