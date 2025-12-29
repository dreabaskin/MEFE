"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface MasonryGridProps {
  children: React.ReactNode
  className?: string
  columns?: number
}

export function MasonryGrid({ children, className, columns = 5 }: MasonryGridProps) {
  const childrenArray = React.Children.toArray(children)
  
  // Split children into columns
  const columnArrays = React.useMemo(() => {
    const cols: React.ReactNode[][] = Array.from({ length: columns }, () => [])
    childrenArray.forEach((child, index) => {
      cols[index % columns].push(child)
    })
    return cols
  }, [childrenArray, columns])

  return (
    <div className={cn("grid gap-6", className)} style={{ 
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    }}>
      {columnArrays.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-6">
          {column.map((child, childIndex) => (
            <div key={childIndex} className="w-full">{child}</div>
          ))}
        </div>
      ))}
    </div>
  )
}

