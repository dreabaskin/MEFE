"use client"

import { useState, useRef, useCallback } from 'react'

interface Ripple {
  x: number
  y: number
  id: number
}

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)

  const addRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newRipple: Ripple = {
      x,
      y,
      id: nextId.current++,
    }
    
    setRipples((prev) => [...prev, newRipple])
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)
  }, [])

  return { ripples, addRipple }
}




