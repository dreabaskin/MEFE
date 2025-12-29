"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function SkeletonCard({ viewMode }: { viewMode: 'grid' | 'list' | 'masonry' }) {
  if (viewMode === 'grid' || viewMode === 'masonry') {
    return (
      <Card className="glass-card border-emerald-200/50 shadow-sm">
        <div className={cn("relative h-64 w-full skeleton rounded-t-lg")} />
        <CardHeader className="pb-3">
          <div className={cn("h-5 skeleton rounded mb-2")} />
          <div className={cn("h-4 skeleton rounded w-2/3")} />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 mb-3">
            <div className={cn("h-4 skeleton rounded w-1/2")} />
            <div className="flex gap-1">
              <div className={cn("h-5 skeleton rounded w-16")} />
              <div className={cn("h-5 skeleton rounded w-16")} />
            </div>
          </div>
          <div className={cn("h-9 skeleton rounded")} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-emerald-200/50 shadow-sm">
      <div className="flex gap-4 p-4">
        <div className={cn("relative w-24 h-24 skeleton rounded-lg")} />
        <div className="flex-1 min-w-0 space-y-2">
          <div className={cn("h-5 skeleton rounded")} />
          <div className={cn("h-4 skeleton rounded w-2/3")} />
          <div className="flex gap-2">
            <div className={cn("h-6 skeleton rounded w-16")} />
            <div className={cn("h-6 skeleton rounded w-16")} />
          </div>
        </div>
      </div>
    </Card>
  )
}

