"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressIndicatorProps {
  progress: number // 0-100
  className?: string
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function ProgressIndicator({
  progress,
  className,
  showLabel = false,
  size = "md",
}: ProgressIndicatorProps) {
  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  }

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600">Uploading</span>
          <span className="text-sm text-slate-500">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={cn(
        "w-full bg-slate-200 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300 ease-out",
            "relative overflow-hidden"
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  )
}




