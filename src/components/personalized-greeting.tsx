"use client"

import * as React from "react"
import { Sun, Moon, Coffee, Sunset } from "lucide-react"

interface PersonalizedGreetingProps {
  userName: string | null | undefined
}

// Deterministic greeting selection based on hour and day
function getGreetingForTime(hour: number, dayOfYear: number) {
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  let greeting: string
  let icon: React.ReactNode

  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning'
    const morningGreetings = [
      "Good morning",
      "Rise and shine",
      "Morning sunshine",
      "Start your day strong",
      "Beautiful morning"
    ]
    // Use day of year to deterministically select greeting
    greeting = morningGreetings[dayOfYear % morningGreetings.length]
    icon = <Sun className="h-6 w-6 text-yellow-500" />
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon'
    const afternoonGreetings = [
      "Good afternoon",
      "Afternoon vibes",
      "Hope your day is going well",
      "Afternoon energy",
      "Midday momentum"
    ]
    greeting = afternoonGreetings[dayOfYear % afternoonGreetings.length]
    icon = <Coffee className="h-6 w-6 text-amber-500" />
  } else if (hour >= 17 && hour < 21) {
    timeOfDay = 'evening'
    const eveningGreetings = [
      "Good evening",
      "Evening elegance",
      "Wind down beautifully",
      "Evening glow",
      "Sunset style"
    ]
    greeting = eveningGreetings[dayOfYear % eveningGreetings.length]
    icon = <Sunset className="h-6 w-6 text-orange-500" />
  } else {
    timeOfDay = 'night'
    const nightGreetings = [
      "Good evening",
      "Night mode",
      "Evening vibes",
      "Night elegance",
      "End your day well"
    ]
    greeting = nightGreetings[dayOfYear % nightGreetings.length]
    icon = <Moon className="h-6 w-6 text-indigo-500" />
  }

  return { timeOfDay, greeting, icon }
}

export function PersonalizedGreeting({ userName }: PersonalizedGreetingProps) {
  // Calculate deterministic values on both server and client
  const now = new Date()
  const hour = now.getHours()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
  
  const { timeOfDay, greeting, icon } = getGreetingForTime(hour, dayOfYear)

  const motivationalMessages = {
    morning: [
      "Dress for the success you're creating today",
      "Your outfit sets the tone for your day",
      "Start strong, look strong, feel strong",
      "Today's look, tomorrow's confidence"
    ],
    afternoon: [
      "Keep that energy going",
      "Your style is your superpower",
      "Dress for the attitude you aspire to",
      "You're looking great today"
    ],
    evening: [
      "You've dressed well today",
      "End your day with style",
      "Your outfit carried you through",
      "Evening elegance awaits"
    ],
    night: [
      "Rest well, you've earned it",
      "Tomorrow is another opportunity to shine",
      "Your style journey continues",
      "Night mode: activated"
    ]
  }

  // Use dayOfYear to deterministically select message
  const message = motivationalMessages[timeOfDay][
    dayOfYear % motivationalMessages[timeOfDay].length
  ]

  return (
    <div className="bg-gradient-to-r from-emerald-50/90 to-teal-50/90 backdrop-blur-md rounded-xl p-6 lg:p-8 border border-emerald-200/50 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-emerald-900 mb-2">
            {greeting}{userName ? `, ${userName.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-base lg:text-lg text-slate-700 font-medium">
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}
