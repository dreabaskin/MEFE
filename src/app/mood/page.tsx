"use client"

import { useEffect, useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { PageHeader } from '@/components/page-header'
import { useLanguage } from '@/contexts/language-context'
import { EmptyState } from '@/components/empty-state'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Heart, TrendingUp, Calendar as CalendarIcon, BarChart3, Sparkles, Zap, Smile, Edit2, Trash2, Eye, Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, isToday, isYesterday, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, isSameDay, addDays } from 'date-fns'

interface Outfit {
  id: string
  name: string
}

interface MoodLog {
  id: string
  date: string
  mood: string
  energy: number
  confidence: number
  notes: string | null
  outfit: Outfit | null
}

const moodConfig: Record<string, { emoji: string; color: string; bgColor: string }> = {
  confident: { emoji: '✨', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  comfortable: { emoji: '😌', color: 'text-teal-600', bgColor: 'bg-teal-100' },
  powerful: { emoji: '💪', color: 'text-emerald-700', bgColor: 'bg-emerald-200' },
  creative: { emoji: '🎨', color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  elegant: { emoji: '👗', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  playful: { emoji: '🎉', color: 'text-pink-600', bgColor: 'bg-pink-100' },
  relaxed: { emoji: '🧘', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  bold: { emoji: '🔥', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  sophisticated: { emoji: '💼', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  energetic: { emoji: '⚡', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  neutral: { emoji: '😐', color: 'text-slate-500', bgColor: 'bg-slate-100' },
  down: { emoji: '😔', color: 'text-slate-600', bgColor: 'bg-slate-200' },
}

const moods = Object.keys(moodConfig)

export default function MoodPage() {
  const { t } = useLanguage()
  const [logs, setLogs] = useState<MoodLog[]>([])
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [viewLog, setViewLog] = useState<MoodLog | null>(null)
  const [editLog, setEditLog] = useState<MoodLog | null>(null)
  const [viewMode, setViewMode] = useState<'timeline' | 'stats' | 'weekly'>('timeline')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMood, setSelectedMood] = useState<string>('all')
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: '',
    energy: '5',
    confidence: '5',
    notes: '',
    outfitId: '',
  })

  useEffect(() => {
    fetchLogs()
    fetchOutfits()
  }, [])

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/mood-logs')
      const data = await res.json()
      setLogs(data.sort((a: MoodLog, b: MoodLog) => new Date(b.date).getTime() - new Date(a.date).getTime()))
    } catch (error) {
      console.error('Error fetching mood logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOutfits = async () => {
    try {
      const res = await fetch('/api/outfits')
      const data = await res.json()
      setOutfits(data)
    } catch (error) {
      console.error('Error fetching outfits:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.date || !formData.mood) return

    try {
      const url = editLog ? `/api/mood-logs/${editLog.id}` : '/api/mood-logs'
      const method = editLog ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          energy: parseInt(formData.energy),
          confidence: parseInt(formData.confidence),
        }),
      })
      if (res.ok) {
        setOpen(false)
        setEditLog(null)
        setFormData({
          date: new Date().toISOString().split('T')[0],
          mood: '',
          energy: '5',
          confidence: '5',
          notes: '',
          outfitId: '',
        })
        fetchLogs()
      }
    } catch (error) {
      console.error('Error saving mood log:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mood log?')) return

    try {
      const res = await fetch(`/api/mood-logs/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setViewLog(null)
        fetchLogs()
      }
    } catch (error) {
      console.error('Error deleting mood log:', error)
    }
  }

  const handleEdit = (log: MoodLog) => {
    setEditLog(log)
    setFormData({
      date: format(parseISO(log.date), 'yyyy-MM-dd'),
      mood: log.mood,
      energy: log.energy.toString(),
      confidence: log.confidence.toString(),
      notes: log.notes || '',
      outfitId: log.outfit?.id || '',
    })
    setViewLog(null)
    setOpen(true)
  }

  // Filter logs
  const filteredLogs = useMemo(() => {
    let filtered = [...logs]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(log =>
        log.mood.toLowerCase().includes(query) ||
        log.notes?.toLowerCase().includes(query) ||
        log.outfit?.name.toLowerCase().includes(query)
      )
    }

    // Mood filter
    if (selectedMood !== 'all') {
      filtered = filtered.filter(log => log.mood === selectedMood)
    }

    return filtered
  }, [logs, searchQuery, selectedMood])

  // Statistics
  const stats = useMemo(() => {
    if (logs.length === 0) return null

    const avgEnergy = logs.reduce((sum, log) => sum + log.energy, 0) / logs.length
    const avgConfidence = logs.reduce((sum, log) => sum + log.confidence, 0) / logs.length
    const moodCounts: Record<string, number> = {}
    logs.forEach(log => {
      moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
    })
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]

    // Trend analysis
    const recentLogs = logs.slice(0, 7)
    const olderLogs = logs.slice(7, 14)
    const recentAvgEnergy = recentLogs.length > 0 ? recentLogs.reduce((sum, log) => sum + log.energy, 0) / recentLogs.length : 0
    const olderAvgEnergy = olderLogs.length > 0 ? olderLogs.reduce((sum, log) => sum + log.energy, 0) / olderLogs.length : 0
    const energyTrend = recentAvgEnergy - olderAvgEnergy

    const recentAvgConfidence = recentLogs.length > 0 ? recentLogs.reduce((sum, log) => sum + log.confidence, 0) / recentLogs.length : 0
    const olderAvgConfidence = olderLogs.length > 0 ? olderLogs.reduce((sum, log) => sum + log.confidence, 0) / olderLogs.length : 0
    const confidenceTrend = recentAvgConfidence - olderAvgConfidence

    // Outfit correlation
    const withOutfits = logs.filter(log => log.outfit !== null)
    const avgEnergyWithOutfit = withOutfits.length > 0 
      ? withOutfits.reduce((sum, log) => sum + log.energy, 0) / withOutfits.length 
      : 0
    const avgEnergyWithoutOutfit = (logs.length - withOutfits.length) > 0
      ? logs.filter(log => log.outfit === null).reduce((sum, log) => sum + log.energy, 0) / (logs.length - withOutfits.length)
      : 0

    return {
      totalLogs: logs.length,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgConfidence: Math.round(avgConfidence * 10) / 10,
      topMood: topMood ? { mood: topMood[0], count: topMood[1] } : null,
      energyTrend,
      confidenceTrend,
      withOutfits: withOutfits.length,
      avgEnergyWithOutfit: Math.round(avgEnergyWithOutfit * 10) / 10,
      avgEnergyWithoutOutfit: Math.round(avgEnergyWithoutOutfit * 10) / 10,
      moodDistribution: Object.entries(moodCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([mood, count]) => ({
          mood,
          count,
          percentage: (count / logs.length) * 100,
        })),
    }
  }, [logs])

  // Weekly data
  const weeklyData = useMemo(() => {
    const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 })
    const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 })
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
    
    return weekDays.map(day => {
      const dayLogs = logs.filter(log => isSameDay(parseISO(log.date), day))
      return {
        date: day,
        logs: dayLogs,
        avgEnergy: dayLogs.length > 0 ? dayLogs.reduce((sum, log) => sum + log.energy, 0) / dayLogs.length : 0,
        avgConfidence: dayLogs.length > 0 ? dayLogs.reduce((sum, log) => sum + log.confidence, 0) / dayLogs.length : 0,
        topMood: dayLogs.length > 0 
          ? Object.entries(dayLogs.reduce((acc, log) => {
              acc[log.mood] = (acc[log.mood] || 0) + 1
              return acc
            }, {} as Record<string, number>))
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral'
          : null,
      }
    })
  }, [logs, currentWeek])

  const getDayLabel = (dateString: string) => {
    const date = parseISO(dateString)
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMMM d, yyyy')
  }

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <PageHeader
          title={t('mood.title')}
          description={t('mood.description')}
          action={
            <Button 
              onClick={() => {
                setEditLog(null)
                setFormData({
                  date: new Date().toISOString().split('T')[0],
                  mood: '',
                  energy: '5',
                  confidence: '5',
                  notes: '',
                  outfitId: '',
                })
                setOpen(true)
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('mood.logMood')}
            </Button>
          }
        />

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-6 mb-10 lg:mb-12">
            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Total Logs</p>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600">{stats.totalLogs}</p>
                  </div>
                  <Heart className="h-7 w-7 lg:h-8 lg:w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Avg Energy</p>
                    <p className="text-2xl lg:text-3xl font-bold text-teal-600">{stats.avgEnergy}/10</p>
                    {stats.energyTrend !== 0 && (
                      <p className={`text-xs ${stats.energyTrend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {stats.energyTrend > 0 ? '↑' : '↓'} {Math.abs(stats.energyTrend).toFixed(1)}
                      </p>
                    )}
                  </div>
                  <Zap className="h-8 w-8 text-teal-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Avg Confidence</p>
                    <p className="text-2xl lg:text-3xl font-bold text-cyan-600">{stats.avgConfidence}/10</p>
                    {stats.confidenceTrend !== 0 && (
                      <p className={`text-xs ${stats.confidenceTrend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {stats.confidenceTrend > 0 ? '↑' : '↓'} {Math.abs(stats.confidenceTrend).toFixed(1)}
                      </p>
                    )}
                  </div>
                  <TrendingUp className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-6 pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Top Mood</p>
                    <p className="text-lg font-bold text-emerald-600 capitalize">
                      {stats.topMood?.mood || 'N/A'}
                    </p>
                    <p className="text-xs text-slate-500">{stats.topMood?.count || 0} times</p>
                  </div>
                  <Smile className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-6 pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">With Outfits</p>
                    <p className="text-3xl font-bold text-emerald-600">{stats.withOutfits}</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-6 pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Outfit Impact</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {stats.avgEnergyWithOutfit > stats.avgEnergyWithoutOutfit ? '+' : ''}
                      {(stats.avgEnergyWithOutfit - stats.avgEnergyWithoutOutfit).toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-500">Energy diff</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add/Edit Mood Log Dialog */}
        <Dialog 
          open={open} 
          onOpenChange={(open) => {
            setOpen(open)
            if (!open) {
              setEditLog(null)
              setFormData({
                date: new Date().toISOString().split('T')[0],
                mood: '',
                energy: '5',
                confidence: '5',
                notes: '',
                outfitId: '',
              })
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="h2">
                {editLog ? t('common.edit') + ' ' + t('mood.title') : t('mood.logMood')}
              </DialogTitle>
              <CardDescription>How did you feel in your outfit today?</CardDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="date" className="text-base font-semibold">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="mt-2 border-emerald-200 focus:border-emerald-400"
                />
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">How did you feel? *</Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {moods.map((mood) => {
                    const config = moodConfig[mood]
                    const isSelected = formData.mood === mood
                    return (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setFormData({ ...formData, mood })}
                        className={`
                          p-4 rounded-xl border-2 transition-all transform hover:scale-105
                          ${isSelected 
                            ? `border-emerald-500 ${config.bgColor} shadow-lg` 
                            : 'border-emerald-200 bg-white hover:border-emerald-300 hover:bg-emerald-50'
                          }
                        `}
                      >
                        <div className="text-3xl mb-1">{config.emoji}</div>
                        <div className={`text-xs font-medium capitalize ${isSelected ? config.color : 'text-slate-600'}`}>
                          {mood}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="energy" className="text-base font-semibold">Energy Level</Label>
                    <span className="text-lg font-bold text-emerald-600">{formData.energy}/10</span>
                  </div>
                  <input
                    id="energy"
                    type="range"
                    min="1"
                    max="10"
                    value={formData.energy}
                    onChange={(e) => setFormData({ ...formData, energy: e.target.value })}
                    className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="confidence" className="text-base font-semibold">Confidence Level</Label>
                    <span className="text-lg font-bold text-teal-600">{formData.confidence}/10</span>
                  </div>
                  <input
                    id="confidence"
                    type="range"
                    min="1"
                    max="10"
                    value={formData.confidence}
                    onChange={(e) => setFormData({ ...formData, confidence: e.target.value })}
                    className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="outfit" className="text-base font-semibold">Outfit (optional)</Label>
                <Select
                  value={formData.outfitId || undefined}
                  onValueChange={(value) => setFormData({ ...formData, outfitId: value || '' })}
                >
                  <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                    <SelectValue placeholder="Select an outfit (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {outfits.map((outfit) => (
                      <SelectItem key={outfit.id} value={outfit.id}>
                        {outfit.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-base font-semibold">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional thoughts about how you felt..."
                  className="mt-2 border-emerald-200 focus:border-emerald-400"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg py-6">
                <Heart className="h-5 w-5 mr-2" />
                {editLog ? 'Update Mood Log' : 'Save Mood Log'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Mood Log Dialog */}
        {viewLog && (
          <Dialog open={!!viewLog} onOpenChange={() => setViewLog(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="h2 capitalize flex items-center gap-2">
                  <span className="text-3xl">{moodConfig[viewLog.mood]?.emoji}</span>
                  {viewLog.mood}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-slate-600">Date</Label>
                  <p className="text-lg text-slate-900 mt-1">{getDayLabel(viewLog.date)}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">Energy</Label>
                    <div className="mt-2">
                      <div className="w-full bg-emerald-100 rounded-full h-3">
                        <div
                          className="bg-emerald-600 h-3 rounded-full"
                          style={{ width: `${(viewLog.energy / 10) * 100}%` }}
                        />
                      </div>
                      <p className="text-lg font-bold text-emerald-600 mt-1">{viewLog.energy}/10</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">Confidence</Label>
                    <div className="mt-2">
                      <div className="w-full bg-teal-100 rounded-full h-3">
                        <div
                          className="bg-teal-600 h-3 rounded-full"
                          style={{ width: `${(viewLog.confidence / 10) * 100}%` }}
                        />
                      </div>
                      <p className="text-lg font-bold text-teal-600 mt-1">{viewLog.confidence}/10</p>
                    </div>
                  </div>
                </div>
                {viewLog.outfit && (
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">Outfit</Label>
                    <div className="flex items-center gap-2 mt-2 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      <p className="text-lg font-medium text-emerald-900">{viewLog.outfit.name}</p>
                    </div>
                  </div>
                )}
                {viewLog.notes && (
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">Notes</Label>
                    <p className="text-slate-700 mt-1">{viewLog.notes}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleEdit(viewLog)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(viewLog.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Search and Filter */}
        {logs.length > 0 && (
          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover mb-8">
            <CardContent className="px-6 pt-6 pb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search by mood, notes, or outfit..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-emerald-200 focus:border-emerald-400"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Filter by Mood</Label>
                  <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger className="border-emerald-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Moods</SelectItem>
                      {moods.map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          <span className="flex items-center gap-2">
                            <span>{moodConfig[mood].emoji}</span>
                            <span className="capitalize">{mood}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {(searchQuery || selectedMood !== 'all') && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-emerald-100">
                  <span className="text-sm text-slate-600">Active filters:</span>
                  {searchQuery && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm flex items-center gap-1">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedMood !== 'all' && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm flex items-center gap-1">
                      {moodConfig[selectedMood].emoji} {selectedMood}
                      <button onClick={() => setSelectedMood('all')}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedMood('all')
                    }}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs for different views */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="space-y-6">
          <TabsList className="bg-white/95 backdrop-blur-md border-emerald-200/50">
            <TabsTrigger value="timeline" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Timeline
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Statistics
            </TabsTrigger>
            <TabsTrigger value="weekly" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Weekly View
            </TabsTrigger>
          </TabsList>

          {/* Timeline View */}
          <TabsContent value="timeline" className="space-y-4">
            {filteredLogs.length === 0 ? (
              <EmptyState
                icon={<Heart className="h-8 w-8" />}
                illustration="mood"
                title={logs.length === 0 ? t('common.noMoodLogsYet') : t('common.noMoodLogsMatchFilters')}
                description={logs.length === 0 
                  ? t('common.startTrackingMoods')
                  : t('common.tryAdjustingYourSearchOrFilters')
                }
                action={logs.length === 0 ? {
                  label: t('common.logNewMood'),
                  onClick: () => {
                    setFormData({
                      date: new Date().toISOString().split('T')[0],
                      mood: '',
                      energy: '5',
                      confidence: '5',
                      notes: '',
                      outfitId: '',
                    })
                    setOpen(true)
                  },
                  icon: <Plus className="h-5 w-5" />
                } : undefined}
                tips={logs.length === 0 ? [
                  "Log your mood after wearing different outfits",
                  "Track energy and confidence levels",
                  "Link moods to specific outfits",
                  "Discover which styles make you feel best"
                ] : [
                  "Try adjusting your date range",
                  "Remove some filters",
                  "Check your search query"
                ]}
              />
            ) : (
              <div className="space-y-4">
                {filteredLogs.map((log) => {
                  const config = moodConfig[log.mood] || { emoji: '😊', color: 'text-emerald-600', bgColor: 'bg-emerald-100' }
                  
                  return (
                    <Card
                      key={log.id}
                      className="bg-white/95 backdrop-blur-md border-emerald-200/50 hover:border-emerald-400 hover:shadow-xl transition-all shadow-sm"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-xl ${config.bgColor} flex items-center justify-center text-3xl`}>
                              {config.emoji}
                            </div>
                            <div>
                              <CardTitle className="text-xl capitalize mb-1">{log.mood}</CardTitle>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{getDayLabel(log.date)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => setViewLog(log)}
                              className="border-emerald-200"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => handleEdit(log)}
                              className="border-emerald-200"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDelete(log.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-6 mb-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-600">Energy</span>
                              <span className="text-lg font-bold text-emerald-600">{log.energy}/10</span>
                            </div>
                            <div className="w-full bg-emerald-100 rounded-full h-2">
                              <div
                                className="bg-emerald-600 h-2 rounded-full transition-all"
                                style={{ width: `${(log.energy / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-600">Confidence</span>
                              <span className="text-lg font-bold text-teal-600">{log.confidence}/10</span>
                            </div>
                            <div className="w-full bg-teal-100 rounded-full h-2">
                              <div
                                className="bg-teal-600 h-2 rounded-full transition-all"
                                style={{ width: `${(log.confidence / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {log.outfit && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm font-medium text-emerald-900">
                                Outfit: {log.outfit.name}
                              </span>
                            </div>
                          </div>
                        )}

                        {log.notes && (
                          <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-sm text-slate-700 line-clamp-2">{log.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Statistics View */}
          <TabsContent value="stats">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-emerald-600" />
                    Mood Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats && stats.moodDistribution.length > 0 ? (
                    <div className="space-y-3">
                      {stats.moodDistribution.map((dist) => {
                        const config = moodConfig[dist.mood] || { emoji: '😊', color: 'text-emerald-600', bgColor: 'bg-emerald-100' }
                        return (
                          <div key={dist.mood} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{config.emoji}</span>
                                <span className="text-sm font-medium capitalize text-slate-700">{dist.mood}</span>
                              </div>
                              <span className="text-sm font-bold text-emerald-600">{dist.count} ({dist.percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div
                                className={`${config.bgColor} h-2 rounded-full transition-all`}
                                style={{ width: `${dist.percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-center py-8">No mood data yet</p>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Weekly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-20 text-sm text-slate-600">
                          {format(day.date, 'EEE')}
                        </div>
                        <div className="flex-1 space-y-2">
                          {day.logs.length > 0 ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 w-12">Energy:</span>
                                <div className="flex-1 bg-emerald-100 rounded-full h-2">
                                  <div
                                    className="bg-emerald-600 h-2 rounded-full"
                                    style={{ width: `${(day.avgEnergy / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-emerald-600 w-8">
                                  {day.avgEnergy.toFixed(1)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500 w-12">Confidence:</span>
                                <div className="flex-1 bg-teal-100 rounded-full h-2">
                                  <div
                                    className="bg-teal-600 h-2 rounded-full"
                                    style={{ width: `${(day.avgConfidence / 10) * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs font-medium text-teal-600 w-8">
                                  {day.avgConfidence.toFixed(1)}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="text-xs text-slate-400 italic">No logs</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Weekly Calendar View */}
          <TabsContent value="weekly">
            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-emerald-600" />
                      Weekly Mood Overview
                    </CardTitle>
                    <CardDescription>See your mood patterns throughout the week</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                      className="border-emerald-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                      className="border-emerald-200"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {weeklyData.map((day, index) => {
                    const dayLogs = day.logs
                    const isTodayDate = isToday(day.date)
                    return (
                      <div
                        key={index}
                        className={`
                          p-3 rounded-lg border-2 min-h-[120px]
                          ${isTodayDate ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200 bg-white'}
                        `}
                      >
                        <div className="text-xs font-semibold text-slate-600 mb-2">
                          {format(day.date, 'EEE')}
                        </div>
                        <div className="text-sm font-bold text-emerald-900 mb-2">
                          {format(day.date, 'd')}
                        </div>
                        {dayLogs.length > 0 ? (
                          <div className="space-y-1">
                            {dayLogs.slice(0, 2).map((log) => {
                              const config = moodConfig[log.mood] || { emoji: '😊', color: 'text-emerald-600', bgColor: 'bg-emerald-100' }
                              return (
                                <div
                                  key={log.id}
                                  className="text-xs flex items-center gap-1 bg-emerald-50 rounded px-1 py-0.5"
                                >
                                  <span>{config.emoji}</span>
                                  <span className="truncate capitalize">{log.mood}</span>
                                </div>
                              )
                            })}
                            {dayLogs.length > 2 && (
                              <div className="text-xs text-emerald-600 font-medium">
                                +{dayLogs.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic">No logs</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
