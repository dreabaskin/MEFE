"use client"

import React, { memo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Edit2, Trash2, ZoomIn } from 'lucide-react'
import Image from 'next/image'
import { Lightbox } from '@/components/lightbox'
import { cn } from '@/lib/utils'

interface WardrobeItemCardProps {
  item: {
    id: string
    name: string
    description: string | null
    category: string
    color: string | null
    imageUrl: string
    tags: string[]
  }
  categoryInfo?: { icon: string; label: string }
  onView: (item: any) => void
  onEdit: (item: any) => void
  onDelete: (id: string) => void
  viewMode: 'grid' | 'list'
}

const WardrobeItemCard = memo(({ 
  item, 
  categoryInfo, 
  onView, 
  onEdit, 
  onDelete, 
  viewMode 
}: WardrobeItemCardProps) => {
  // All hooks must be called at the top level, before any conditional returns
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isLightboxOpenList, setIsLightboxOpenList] = useState(false)
  const [imageLoadedList, setImageLoadedList] = useState(false)

  if (viewMode === 'grid') {
    return (
      <>
        <Card className="group overflow-hidden glass-card border-emerald-200/50 hover:border-emerald-400 hover:shadow-xl transition-all shadow-sm">
          <div className="relative h-64 w-full overflow-hidden bg-slate-100">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
            )}
            {item.imageUrl.startsWith('data:') ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-500",
                  "group-hover:scale-125 group-hover:brightness-110",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
              />
            ) : (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className={cn(
                  "object-cover transition-all duration-500",
                  "group-hover:scale-125 group-hover:brightness-110",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQADAD8AkjRcntm5se+1Hvbc0LIy0qhY2WAjs5HNB54k6SX8zA8twe4jR82PkY0sjyNqB0Xf4Rjrdx53X6eaHX5UvpH2gH8Bla8yUn5JTGMpPeqy+W1mbHPJ8P/xAAhEAEAAgAGAgMAAAAAAAAAAAABAAIDERIhMUFhcYGRof/aAAgBAQABPwAfJzYgajiOnmtNnfmnsWL8BDfa5X7uLK8jBmab6QhF3ZPVHXY4t8rLA4Jek8J//9k="
                onLoad={() => setImageLoaded(true)}
              />
            )}
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Quick Actions Overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
                onClick={() => setIsLightboxOpen(true)}
                title="View full size"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
                onClick={() => onView(item)}
                title="View details"
              >
                <Eye className="h-5 w-5" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm"
                onClick={() => onEdit(item)}
                title="Edit item"
              >
                <Edit2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        <CardHeader className="pb-3">
          <CardTitle className="text-base line-clamp-1">{item.name}</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xl">{categoryInfo?.icon}</span>
            <span className="text-xs text-slate-600 capitalize">{categoryInfo?.label}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 mb-3">
            {item.color && (
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                  style={{
                    backgroundColor: item.color.toLowerCase(),
                  }}
                />
                <span className="text-xs text-slate-600">{item.color}</span>
              </div>
            )}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {item.tags.length > 2 && (
                  <span className="px-2 py-0.5 text-slate-500 text-xs">
                    +{item.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </CardContent>
      </Card>
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        imageUrl={item.imageUrl}
        alt={item.name}
        title={item.name}
      />
    </>
    )
  }

  return (
    <>
      <Card className="glass-card border-emerald-200/50 hover:border-emerald-400 hover:shadow-lg transition-all shadow-sm group">
        <div className="flex gap-4 p-4">
          <div 
            className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 cursor-pointer"
            onClick={() => setIsLightboxOpenList(true)}
          >
            {!imageLoadedList && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse" />
            )}
            {item.imageUrl.startsWith('data:') ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
                  "group-hover:scale-110",
                  imageLoadedList ? "opacity-100" : "opacity-0"
                )}
                loading="lazy"
                onLoad={() => setImageLoadedList(true)}
              />
            ) : (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className={cn(
                  "object-cover transition-transform duration-300",
                  "group-hover:scale-110",
                  imageLoadedList ? "opacity-100" : "opacity-0"
                )}
                loading="lazy"
                sizes="96px"
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQADAD8AkjRcntm5se+1Hvbc0LIy0qhY2WAjs5HNB54k6SX8zA8twe4jR82PkY0sjyNqB0Xf4Rjrdx53X6eaHX5UvpH2gH8Bla8yUn5JTGMpPeqy+W1mbHPJ8P/xAAhEAEAAgAGAgMAAAAAAAAAAAABAAIDERIhMUFhcYGRof/aAAgBAQABPwAfJzYgajiOnmtNnfmnsWL8BDfa5X7uLK8jBmab6QhF3ZPVHXY4t8rLA4Jek8J//9k="
                onLoad={() => setImageLoadedList(true)}
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-base line-clamp-1">{item.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl">{categoryInfo?.icon}</span>
                <span className="text-xs text-slate-600 capitalize">{categoryInfo?.label}</span>
              </div>
            </div>
            <div className="flex gap-2 ml-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onView(item)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onEdit(item)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {item.color && (
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-4 h-4 rounded-full border border-slate-300 shadow-sm"
                style={{
                  backgroundColor: item.color.toLowerCase(),
                }}
              />
              <span className="text-xs text-slate-600">{item.color}</span>
            </div>
          )}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
    <Lightbox
      isOpen={isLightboxOpenList}
      onClose={() => setIsLightboxOpenList(false)}
      imageUrl={item.imageUrl}
      alt={item.name}
      title={item.name}
    />
    </>
  )
})

WardrobeItemCard.displayName = 'WardrobeItemCard'

export { WardrobeItemCard }

