"use client"

import { useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, Sparkles, Palette, Heart, BarChart3, Calendar, Zap } from 'lucide-react'
import { format, subDays, startOfWeek, parseISO } from 'date-fns'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface Insight {
  id: string
  type: string
  title: string
  description: string
  data?: any
}

interface MoodLog {
  id: string
  date: string
  mood: string
  energy: number
  confidence: number
  outfitId: string | null
}

const moodConfig: Record<string, { emoji: string; color: string }> = {
  confident: { emoji: '✨', color: '#10b981' },
  comfortable: { emoji: '😌', color: '#14b8a6' },
  powerful: { emoji: '💪', color: '#059669' },
  creative: { emoji: '🎨', color: '#06b6d4' },
  elegant: { emoji: '👗', color: '#8b5cf6' },
  playful: { emoji: '🎉', color: '#ec4899' },
  relaxed: { emoji: '🧘', color: '#3b82f6' },
  bold: { emoji: '🔥', color: '#f97316' },
  sophisticated: { emoji: '💼', color: '#64748b' },
  energetic: { emoji: '⚡', color: '#eab308' },
  neutral: { emoji: '😐', color: '#94a3b8' },
  down: { emoji: '😔', color: '#475569' },
}

export default function InsightsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [insights, setInsights] = useState<Insight[]>([])
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [viewMode, setViewMode] = useState<'overview' | 'mood-trends' | 'energy-confidence' | 'mood-distribution'>('overview')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [status, router])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/insights')
      const data = await res.json()
      
      if (data.error) {
        console.error('Error fetching insights:', data.error)
        setInsights([])
        setMoodLogs([])
      } else {
        setInsights(Array.isArray(data.insights) ? data.insights : [])
        setMoodLogs(Array.isArray(data.moodLogs) ? data.moodLogs : [])
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
      setInsights([])
      setMoodLogs([])
    } finally {
      setLoading(false)
    }
  }

  // Filter mood logs by time range
  const filteredLogs = useMemo(() => {
    if (!moodLogs.length) return []
    
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case '7d':
        startDate = subDays(now, 7)
        break
      case '30d':
        startDate = subDays(now, 30)
        break
      case '90d':
        startDate = subDays(now, 90)
        break
      default:
        return moodLogs
    }

    return moodLogs.filter(log => {
      const logDate = parseISO(log.date)
      return logDate >= startDate
    })
  }, [moodLogs, timeRange])

  // Prepare data for daily mood trends
  const dailyMoodData = useMemo(() => {
    if (!filteredLogs.length) return []

    const dateMap = new Map<string, { date: string; moods: string[]; energy: number[]; confidence: number[] }>()

    filteredLogs.forEach(log => {
      const dateKey = format(parseISO(log.date), 'yyyy-MM-dd')
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, { date: dateKey, moods: [], energy: [], confidence: [] })
      }
      const entry = dateMap.get(dateKey)!
      entry.moods.push(log.mood)
      entry.energy.push(log.energy)
      entry.confidence.push(log.confidence)
    })

    return Array.from(dateMap.values())
      .map(entry => ({
        date: format(parseISO(entry.date), 'MMM d'),
        fullDate: entry.date,
        mood: entry.moods[0], // Most common mood of the day
        avgEnergy: Math.round(entry.energy.reduce((a, b) => a + b, 0) / entry.energy.length),
        avgConfidence: Math.round(entry.confidence.reduce((a, b) => a + b, 0) / entry.confidence.length),
        minEnergy: Math.min(...entry.energy),
        maxEnergy: Math.max(...entry.energy),
        minConfidence: Math.min(...entry.confidence),
        maxConfidence: Math.max(...entry.confidence),
        count: entry.moods.length,
      }))
      .sort((a, b) => a.fullDate.localeCompare(b.fullDate))
  }, [filteredLogs])

  // Prepare data for mood distribution
  const moodDistribution = useMemo(() => {
    if (!filteredLogs.length) return []

    const moodCounts: Record<string, number> = {}
    filteredLogs.forEach(log => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
    })

    return Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood,
        count,
        percentage: Math.round((count / filteredLogs.length) * 100),
        ...moodConfig[mood] || { emoji: '😐', color: '#94a3b8' },
      }))
      .sort((a, b) => b.count - a.count)
  }, [filteredLogs])

  // Prepare data for weekly summary
  const weeklyData = useMemo(() => {
    if (!filteredLogs.length) return []

    const weekMap = new Map<string, { week: string; moods: string[]; energy: number[]; confidence: number[] }>()

    filteredLogs.forEach(log => {
      const date = parseISO(log.date)
      const weekStart = startOfWeek(date, { weekStartsOn: 1 })
      const weekKey = format(weekStart, 'yyyy-MM-dd')
      
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, { week: format(weekStart, 'MMM d'), moods: [], energy: [], confidence: [] })
      }
      const entry = weekMap.get(weekKey)!
      entry.moods.push(log.mood)
      entry.energy.push(log.energy)
      entry.confidence.push(log.confidence)
    })

    return Array.from(weekMap.values())
      .map(entry => ({
        week: entry.week,
        avgEnergy: Math.round(entry.energy.reduce((a, b) => a + b, 0) / entry.energy.length),
        avgConfidence: Math.round(entry.confidence.reduce((a, b) => a + b, 0) / entry.confidence.length),
        topMood: entry.moods.reduce((a, b, _, arr) => 
          arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
        ),
        count: entry.moods.length,
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
  }, [filteredLogs])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!filteredLogs.length) {
      return {
        totalLogs: 0,
        avgEnergy: 0,
        avgConfidence: 0,
        topMood: null,
        moodRange: null,
        energyRange: null,
        confidenceRange: null,
      }
    }

    const energies = filteredLogs.map(log => log.energy)
    const confidences = filteredLogs.map(log => log.confidence)
    const moodCounts: Record<string, number> = {}
    
    filteredLogs.forEach(log => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
    })

    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0]

    return {
      totalLogs: filteredLogs.length,
      avgEnergy: Math.round(energies.reduce((a, b) => a + b, 0) / energies.length * 10) / 10,
      avgConfidence: Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length * 10) / 10,
      topMood,
      moodRange: Object.keys(moodCounts).length,
      energyRange: `${Math.min(...energies)} - ${Math.max(...energies)}`,
      confidenceRange: `${Math.min(...confidences)} - ${Math.max(...confidences)}`,
    }
  }, [filteredLogs])

  const getIcon = (type: string) => {
    switch (type) {
      case 'mood_pattern':
        return <Heart className="h-6 w-6 text-emerald-600" />
      case 'color_impact':
        return <Palette className="h-6 w-6 text-teal-600" />
      case 'category_preference':
        return <Sparkles className="h-6 w-6 text-cyan-600" />
      default:
        return <TrendingUp className="h-6 w-6 text-emerald-600" />
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !session) {
    return null
  }

  const hasData = filteredLogs.length > 0

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <PageHeader
          title="Your Insights"
          description="Discover patterns in how your clothing affects your mood and confidence"
        />

        {/* Time Range Selector */}
        {hasData && (
          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover mb-8">
            <CardContent className="px-6 pt-6 pb-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-900">Time Range:</span>
                </div>
                <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d' | 'all') => setTimeRange(value)}>
                  <SelectTrigger className="w-40 border-emerald-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {!hasData ? (
          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
            <CardContent className="px-6 py-12 text-center">
              <TrendingUp className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-emerald-700 mb-2 font-semibold text-lg">No insights yet</p>
              <p className="text-sm text-emerald-600">
                Start logging your moods to discover patterns in your style-mood connections
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-sm font-medium text-slate-600 mb-2">Total Logs</CardTitle>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                    <span className="text-3xl font-bold text-emerald-900">{stats.totalLogs}</span>
                  </div>
                </CardHeader>
              </Card>

              <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-sm font-medium text-slate-600 mb-2">Avg Energy</CardTitle>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    <span className="text-3xl font-bold text-emerald-900">{stats.avgEnergy}/10</span>
                  </div>
                </CardHeader>
              </Card>

              <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-sm font-medium text-slate-600 mb-2">Avg Confidence</CardTitle>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-teal-600" />
                    <span className="text-3xl font-bold text-emerald-900">{stats.avgConfidence}/10</span>
                  </div>
                </CardHeader>
              </Card>

              <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-sm font-medium text-slate-600 mb-2">Top Mood</CardTitle>
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-600" />
                    <span className="text-2xl font-bold text-emerald-900 capitalize">
                      {stats.topMood ? `${moodConfig[stats.topMood]?.emoji || ''} ${stats.topMood}` : 'N/A'}
                    </span>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* Charts Tabs */}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="mb-8">
              <TabsList className="grid w-full grid-cols-4 bg-white/80 border-emerald-200">
                <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-100">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="mood-trends" className="data-[state=active]:bg-emerald-100">
                  Mood Trends
                </TabsTrigger>
                <TabsTrigger value="energy-confidence" className="data-[state=active]:bg-emerald-100">
                  Energy & Confidence
                </TabsTrigger>
                <TabsTrigger value="mood-distribution" className="data-[state=active]:bg-emerald-100">
                  Distribution
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Mood Trends Chart */}
                <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                  <CardHeader className="px-6 pt-6 pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-6 w-6 text-emerald-600" />
                      Mood Trends Over Time
                    </CardTitle>
                    <CardDescription>Track how your moods change day by day</CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={dailyMoodData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#64748b"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="#64748b"
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #d1fae5',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="avgEnergy" 
                          stroke="#eab308" 
                          strokeWidth={2}
                          name="Energy"
                          dot={{ r: 4 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="avgConfidence" 
                          stroke="#14b8a6" 
                          strokeWidth={2}
                          name="Confidence"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Weekly Summary */}
                {weeklyData.length > 0 && (
                  <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                    <CardHeader className="px-6 pt-6 pb-4">
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-emerald-600" />
                        Weekly Summary
                      </CardTitle>
                      <CardDescription>Your mood patterns by week</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={weeklyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis 
                            dataKey="week" 
                            stroke="#64748b"
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis 
                            stroke="#64748b"
                            style={{ fontSize: '12px' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'white', 
                              border: '1px solid #d1fae5',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="avgEnergy" fill="#eab308" name="Avg Energy" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="avgConfidence" fill="#14b8a6" name="Avg Confidence" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Mood Trends Tab */}
              <TabsContent value="mood-trends" className="space-y-6">
                <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                  <CardHeader className="px-6 pt-6 pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-emerald-600" />
                      Daily Mood Range
                    </CardTitle>
                    <CardDescription>Energy and confidence ranges for each day</CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={dailyMoodData}>
                        <defs>
                          <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#64748b"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="#64748b"
                          style={{ fontSize: '12px' }}
                          domain={[0, 10]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #d1fae5',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="maxEnergy" 
                          stroke="#eab308" 
                          fillOpacity={0}
                          strokeWidth={2}
                          name="Max Energy"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="avgEnergy" 
                          stroke="#fbbf24" 
                          fill="url(#colorEnergy)"
                          strokeWidth={3}
                          name="Avg Energy"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="minEnergy" 
                          stroke="#eab308" 
                          fillOpacity={0}
                          strokeWidth={2}
                          name="Min Energy"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="maxConfidence" 
                          stroke="#14b8a6" 
                          fillOpacity={0}
                          strokeWidth={2}
                          name="Max Confidence"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="avgConfidence" 
                          stroke="#2dd4bf" 
                          fill="url(#colorConfidence)"
                          strokeWidth={3}
                          name="Avg Confidence"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="minConfidence" 
                          stroke="#14b8a6" 
                          fillOpacity={0}
                          strokeWidth={2}
                          name="Min Confidence"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Energy & Confidence Tab */}
              <TabsContent value="energy-confidence" className="space-y-6">
                <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                  <CardHeader className="px-6 pt-6 pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-6 w-6 text-yellow-600" />
                      Energy & Confidence Trends
                    </CardTitle>
                    <CardDescription>Track your energy and confidence levels over time</CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={dailyMoodData}>
                        <defs>
                          <linearGradient id="colorEnergy2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorConfidence2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="date" 
                          stroke="#64748b"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="#64748b"
                          style={{ fontSize: '12px' }}
                          domain={[0, 10]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #d1fae5',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="avgEnergy" 
                          stroke="#eab308" 
                          fill="url(#colorEnergy2)"
                          strokeWidth={3}
                          name="Energy Level"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="avgConfidence" 
                          stroke="#14b8a6" 
                          fill="url(#colorConfidence2)"
                          strokeWidth={3}
                          name="Confidence Level"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Mood Distribution Tab */}
              <TabsContent value="mood-distribution" className="space-y-6">
                <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                  <CardHeader className="px-6 pt-6 pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-6 w-6 text-emerald-600" />
                      Mood Distribution
                    </CardTitle>
                    <CardDescription>Frequency of each mood in your logs</CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={moodDistribution} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} />
                        <YAxis 
                          type="category" 
                          dataKey="mood" 
                          stroke="#64748b"
                          style={{ fontSize: '12px' }}
                          width={100}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #d1fae5',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number | undefined) => [`${value || 0} times`, 'Count']}
                        />
                        <Bar dataKey="count" name="Frequency" radius={[0, 8, 8, 0]}>
                          {moodDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Mood Distribution Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {moodDistribution.map((mood) => (
                    <Card key={mood.mood} className="glass-card border-emerald-200/50 shadow-lg card-hover">
                      <CardContent className="px-6 pt-6 pb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{mood.emoji}</span>
                            <div>
                              <h3 className="font-semibold text-emerald-900 capitalize">{mood.mood}</h3>
                              <p className="text-sm text-slate-600">{mood.percentage}% of logs</p>
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className="h-3 rounded-full transition-all"
                            style={{ 
                              width: `${mood.percentage}%`,
                              backgroundColor: mood.color
                            }}
                          />
                        </div>
                        <p className="text-sm text-slate-600 mt-2">{mood.count} {mood.count === 1 ? 'time' : 'times'}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Text Insights */}
            {insights.length > 0 && (
              <div className="mt-8">
                <h2 className="h2 text-emerald-900 mb-6">Personalized Insights</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {insights.map((insight) => (
                    <Card key={insight.id} className="glass-card border-emerald-200/50 shadow-lg card-hover">
                      <CardHeader className="px-6 pt-6 pb-4">
                        <div className="flex items-center gap-3">
                          {getIcon(insight.type)}
                          <CardTitle className="text-lg">{insight.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="px-6 pb-6">
                        <CardDescription className="text-base">
                          {insight.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
