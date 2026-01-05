"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Shirt, Sparkles, Calendar, Heart, Zap } from "lucide-react"
import Link from "next/link"

export function QuickActionsWidget() {
  const actions = [
    {
      label: "Add Wardrobe Item",
      icon: <Shirt className="h-6 w-6" />,
      href: "/wardrobe",
      color: "from-emerald-500 to-emerald-600",
      hoverColor: "hover:from-emerald-600 hover:to-emerald-700"
    },
    {
      label: "Create Outfit",
      icon: <Sparkles className="h-6 w-6" />,
      href: "/outfits",
      color: "from-teal-500 to-teal-600",
      hoverColor: "hover:from-teal-600 hover:to-teal-700"
    },
    {
      label: "Plan Outfit",
      icon: <Calendar className="h-6 w-6" />,
      href: "/calendar",
      color: "from-cyan-500 to-cyan-600",
      hoverColor: "hover:from-cyan-600 hover:to-cyan-700"
    },
    {
      label: "Log Mood",
      icon: <Heart className="h-6 w-6" />,
      href: "/mood",
      color: "from-pink-500 to-pink-600",
      hoverColor: "hover:from-pink-600 hover:to-pink-700"
    },
  ]

  return (
    <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Zap className="h-6 w-6 text-emerald-600" />
          Quick Actions
        </CardTitle>
        <CardDescription className="text-base">
          Jump into your most common tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Button
                className={`w-full h-auto py-6 px-4 bg-gradient-to-r ${action.color} ${action.hoverColor} text-white shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2 text-base font-semibold`}
              >
                {action.icon}
                <span className="text-sm">{action.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}






