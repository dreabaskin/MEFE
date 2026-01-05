"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, CloudSun, Wind, Droplets, Thermometer } from "lucide-react"

interface WeatherWidgetProps {
  temperature?: number
  condition?: string
  location?: string
}

export function WeatherWidget({ temperature, condition, location }: WeatherWidgetProps) {
  const getWeatherIcon = (condition?: string) => {
    if (!condition) return <Sun className="h-8 w-8 text-yellow-500" />
    
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />
    }
    if (lowerCondition.includes('cloud')) {
      return <Cloud className="h-8 w-8 text-slate-400" />
    }
    if (lowerCondition.includes('partly') || lowerCondition.includes('sunny')) {
      return <CloudSun className="h-8 w-8 text-yellow-500" />
    }
    return <Sun className="h-8 w-8 text-yellow-500" />
  }

  const getOutfitSuggestion = (condition?: string, temp?: number) => {
    if (!condition && !temp) {
      return "Check the weather to get outfit suggestions"
    }
    
    const lowerCondition = condition?.toLowerCase() || ''
    const isRainy = lowerCondition.includes('rain') || lowerCondition.includes('drizzle')
    const isCold = temp !== undefined && temp < 60
    const isHot = temp !== undefined && temp > 80

    if (isRainy) {
      return "Consider a jacket or umbrella-friendly outfit"
    }
    if (isCold) {
      return "Layer up with cozy pieces"
    }
    if (isHot) {
      return "Light, breathable fabrics recommended"
    }
    return "Perfect weather for your favorite outfit!"
  }

  return (
    <Card className="glass-card border-emerald-200/50 shadow-lg card-hover bg-gradient-to-br from-blue-50/50 to-cyan-50/50">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-blue-600" />
          Weather
        </CardTitle>
        <CardDescription>
          {location || "Weather-based outfit suggestions"}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {temperature !== undefined ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getWeatherIcon(condition)}
                <div>
                  <div className="text-3xl font-bold text-emerald-900">
                    {temperature}°F
                  </div>
                  <div className="text-sm text-slate-600 capitalize">
                    {condition || "Clear"}
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-emerald-200">
              <p className="text-sm text-slate-700 font-medium">
                💡 {getOutfitSuggestion(condition, temperature)}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Cloud className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-2">
              Weather data unavailable
            </p>
            <p className="text-xs text-slate-500">
              Check your local weather for outfit planning
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}






