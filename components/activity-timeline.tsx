"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shirt, Sparkles, Calendar, Heart, Plus, Clock, ArrowRight } from "lucide-react"

const getActivityIcon = (iconType: 'wardrobe' | 'outfit' | 'event' | 'mood') => {
  switch (iconType) {
    case 'wardrobe':
      return <Shirt className="h-5 w-5" />
    case 'outfit':
      return <Sparkles className="h-5 w-5" />
    case 'event':
      return <Calendar className="h-5 w-5" />
    case 'mood':
      return <Heart className="h-5 w-5" />
    default:
      return <Clock className="h-5 w-5" />
  }
}
import { format, parseISO, isToday, isYesterday } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Activity {
  id: string
  type: 'wardrobe' | 'outfit' | 'event' | 'mood'
  title: string
  description?: string
  date: Date | string
  iconType: 'wardrobe' | 'outfit' | 'event' | 'mood'
  color: string
  href: string
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const formatActivityDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (isToday(dateObj)) {
      return 'Today'
    }
    if (isYesterday(dateObj)) {
      return 'Yesterday'
    }
    return format(dateObj, 'MMM d, yyyy')
  }

  const formatActivityTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    return format(dateObj, 'h:mm a')
  }

  if (activities.length === 0) {
    return (
      <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
        <CardHeader className="px-6 pt-6 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-emerald-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>Your recent style activities will appear here</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <p className="text-sm text-slate-600 text-center py-4">
            No recent activity. Start by adding items to your wardrobe!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
      <CardHeader className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest style journey moments</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <Link
              key={activity.id}
              href={activity.href}
              className="block group"
            >
              <div className="flex gap-4 p-4 rounded-lg border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all bg-gradient-to-r from-white/50 to-emerald-50/30">
                <div className={`flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center text-white`}>
                  {getActivityIcon(activity.iconType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-emerald-900 group-hover:text-emerald-700 transition-colors">
                        {activity.title}
                      </h3>
                      {activity.description && (
                        <p className="text-sm text-slate-600 mt-1 line-clamp-1">
                          {activity.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-500">
                          {formatActivityDate(activity.date)}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          {formatActivityTime(activity.date)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 transition-colors flex-shrink-0 mt-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

