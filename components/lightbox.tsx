"use client"

import * as React from "react"
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LightboxProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt: string
  title?: string
}

export function Lightbox({ isOpen, onClose, imageUrl, alt, title }: LightboxProps) {
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 })
  const imageRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!isOpen) {
      setZoom(1)
      setRotation(0)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen])

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    if (!isOpen) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') handleZoomIn()
      if (e.key === '-') handleZoomOut()
      if (e.key === 'r' || e.key === 'R') handleRotate()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, zoom])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex flex-col">
          {/* Header Controls */}
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="bg-white/90 hover:bg-white"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="bg-white/90 hover:bg-white"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleRotate}
              className="bg-white/90 hover:bg-white"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleReset}
              className="bg-white/90 hover:bg-white"
            >
              Reset
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={onClose}
              className="bg-white/90 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Image Container */}
          <div
            ref={imageRef}
            className="flex-1 overflow-hidden flex items-center justify-center cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="relative"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
              }}
            >
              {imageUrl.startsWith('data:') ? (
                <img
                  src={imageUrl}
                  alt={alt}
                  className="max-w-[90vw] max-h-[90vh] object-contain"
                  draggable={false}
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt={alt}
                  width={1920}
                  height={1080}
                  className="max-w-[90vw] max-h-[90vh] object-contain"
                  quality={100}
                  priority
                />
              )}
            </div>
          </div>

          {/* Footer Info */}
          {title && (
            <div className="absolute bottom-4 left-4 right-4 z-50">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-sm font-medium text-slate-900">{title}</p>
                <p className="text-xs text-slate-600 mt-1">
                  Use +/- to zoom, R to rotate, drag to pan when zoomed
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

