"use client"

import { useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { PageHeader } from '@/components/page-header'
import { useLanguage } from '@/contexts/language-context'
import { EmptyState } from '@/components/empty-state'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Sparkles, Edit2, Trash2, Eye, X, TrendingUp, CalendarDays, Download, Image as ImageIcon, Upload } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek, parseISO, differenceInDays } from 'date-fns'
import Image from 'next/image'

interface WardrobeItem {
  id: string
  name: string
  imageUrl: string
  category: string
  color?: string | null
}

interface OutfitItem {
  id: string
  wardrobeItem: WardrobeItem
}

interface Outfit {
  id: string
  name: string
  items?: OutfitItem[]
}

interface CalendarEvent {
  id: string
  date: string
  title: string
  description: string | null
  imageUrl: string | null
  eventType: string | null
  outfit: Outfit | null
}

export default function CalendarPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { t } = useLanguage()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [viewEvent, setViewEvent] = useState<CalendarEvent | null>(null)
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    outfitId: '',
    eventType: '',
    image: null as File | null,
  })

  const eventTypes = [
    'Work',
    'Casual',
    'Formal',
    'Date Night',
    'Party',
    'Wedding',
    'Meeting',
    'Travel',
    'Workout',
    'Other',
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin')
      return
    }
    if (status === 'authenticated') {
      fetchEvents()
      fetchOutfits()
    }
  }, [status, router])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/calendar')
      const data = await res.json()
      
      // Ensure events is always an array
      if (Array.isArray(data)) {
        setEvents(data)
      } else if (data.error) {
        // If there's an error (like unauthorized), set empty array
        console.error('Error fetching events:', data.error)
        setEvents([])
      } else {
        setEvents([])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([]) // Always set to empty array on error
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.date || !formData.title) return

    setIsUploading(true)
    setUploadProgress(0)

    const data = new FormData()
    data.append('date', formData.date)
    data.append('title', formData.title)
    if (formData.description) {
      data.append('description', formData.description)
    }
    if (formData.outfitId) {
      data.append('outfitId', formData.outfitId)
    }
    if (formData.eventType) {
      data.append('eventType', formData.eventType)
    }
    if (formData.image) {
      data.append('image', formData.image)
    }

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      const url = editEvent ? `/api/calendar/${editEvent.id}` : '/api/calendar'
      const method = editEvent ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        body: data,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (res.ok) {
        setOpen(false)
        setEditEvent(null)
        setFormData({ date: '', title: '', description: '', outfitId: '', eventType: '', image: null })
        setImagePreview(null)
        fetchEvents()
      }
    } catch (error) {
      console.error('Error saving event:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const res = await fetch(`/api/calendar/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setViewEvent(null)
        fetchEvents()
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const handleEdit = (event: CalendarEvent) => {
    setEditEvent(event)
    setFormData({
      date: format(parseISO(event.date), 'yyyy-MM-dd'),
      title: event.title,
      description: event.description || '',
      outfitId: event.outfit?.id || '',
      eventType: event.eventType || '',
      image: null,
    })
    setImagePreview(event.imageUrl || null)
    setViewEvent(null)
    setOpen(true)
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    // Check if there are events on this date
    const dateEvents = getEventsForDate(date)
    if (dateEvents.length > 0 && dateEvents[0].outfit) {
      // If there's an event with an outfit, show it
      setViewEvent(dateEvents[0])
    } else {
      // Otherwise, open the form to create a new event
      setFormData({ ...formData, date: format(date, 'yyyy-MM-dd') })
      setOpen(true)
    }
  }

  const downloadImage = async (imageUrl: string, itemName: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${itemName.replace(/\s+/g, '_')}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
      // Fallback: open in new tab
      window.open(imageUrl, '_blank')
    }
  }

  const getEventsForDate = (date: Date) => {
    if (!Array.isArray(events)) return []
    return events.filter((event) => isSameDay(parseISO(event.date), date))
  }

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const upcomingEvents = useMemo(() => {
    if (!Array.isArray(events)) return []
    return events
      .filter((e) => new Date(e.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
  }, [events])

  const stats = useMemo(() => {
    if (!Array.isArray(events)) {
      return {
        totalEvents: 0,
        upcomingCount: 0,
        pastCount: 0,
        withOutfits: 0,
        thisMonth: 0,
      }
    }
    const totalEvents = events.length
    const upcomingCount = events.filter((e) => new Date(e.date) >= new Date()).length
    const pastCount = events.filter((e) => new Date(e.date) < new Date()).length
    const withOutfits = events.filter((e) => e.outfit !== null).length
    const thisMonth = events.filter((e) => {
      const eventDate = parseISO(e.date)
      return isSameMonth(eventDate, currentMonth)
    }).length

    return {
      totalEvents,
      upcomingCount,
      pastCount,
      withOutfits,
      thisMonth,
    }
  }, [events, currentMonth])

  // Show loading or redirect if not authenticated
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (status === 'unauthenticated' || !session) {
    return null
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <PageHeader
          title={t('calendar.title')}
          description={t('calendar.description')}
          action={
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendar')}
                className={viewMode === 'calendar' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-emerald-600 hover:bg-emerald-700' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}
              >
                List
              </Button>
              <Button 
                onClick={() => {
                  setEditEvent(null)
                  setFormData({ date: '', title: '', description: '', outfitId: '', eventType: '', image: null })
                  setImagePreview(null)
                  setOpen(true)
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('calendar.planOutfit')}
              </Button>
            </div>
          }
        />

        {/* Statistics Cards */}
        {events.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 mb-10 lg:mb-12">
            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Total Events</p>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600">{stats.totalEvents}</p>
                  </div>
                  <CalendarDays className="h-7 w-7 lg:h-8 lg:w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Upcoming</p>
                    <p className="text-2xl lg:text-3xl font-bold text-teal-600">{stats.upcomingCount}</p>
                  </div>
                  <TrendingUp className="h-7 w-7 lg:h-8 lg:w-8 text-teal-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">This Month</p>
                    <p className="text-2xl lg:text-3xl font-bold text-cyan-600">{stats.thisMonth}</p>
                  </div>
                  <Clock className="h-7 w-7 lg:h-8 lg:w-8 text-cyan-400" />
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
                    <p className="text-sm text-slate-600 mb-1">Past Events</p>
                    <p className="text-3xl font-bold text-slate-600">{stats.pastCount}</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add/Edit Event Dialog */}
        <Dialog 
          open={open} 
          onOpenChange={(open) => {
            setOpen(open)
            if (!open) {
              setEditEvent(null)
              setFormData({ date: '', title: '', description: '', outfitId: '', eventType: '', image: null })
              setImagePreview(null)
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="h2">
                {editEvent ? 'Edit Event' : 'Plan Outfit'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Work Meeting, Date Night"
                  className="mt-2 border-emerald-200 focus:border-emerald-400"
                />
              </div>
              <div>
                <Label htmlFor="eventType" className="text-base font-semibold">Event Type (optional)</Label>
                <Select
                  value={formData.eventType || undefined}
                  onValueChange={(value) => setFormData({ ...formData, eventType: value || '' })}
                >
                  <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                    <SelectValue placeholder="Select event type (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description" className="text-base font-semibold">How does this outfit make you feel?</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe how this outfit makes you feel..."
                  className="mt-2 border-emerald-200 focus:border-emerald-400"
                  rows={3}
                />
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
                <Label htmlFor="image" className="text-base font-semibold">Upload Outfit Image (optional)</Label>
                <div className="mt-2">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-emerald-200 border-dashed rounded-lg cursor-pointer bg-emerald-50/50 hover:bg-emerald-50 transition-colors"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setFormData({ ...formData, image: null })
                            setImagePreview(editEvent?.imageUrl || null)
                            const input = document.getElementById('image') as HTMLInputElement
                            if (input) input.value = ''
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-10 w-10 text-emerald-500 mb-3" />
                        <p className="mb-2 text-sm text-slate-600">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-emerald-100 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-center">Uploading... {uploadProgress}%</p>
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {editEvent ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  editEvent ? 'Update Event' : 'Create Event'
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Event Dialog */}
        {viewEvent && (
          <Dialog open={!!viewEvent} onOpenChange={() => setViewEvent(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="h2">{viewEvent.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-slate-600">Date</Label>
                  <p className="text-lg text-slate-900 mt-1">
                    {format(parseISO(viewEvent.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
                {viewEvent.eventType && (
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">Event Type</Label>
                    <p className="text-slate-700 mt-1">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        {viewEvent.eventType}
                      </span>
                    </p>
                  </div>
                )}
                {viewEvent.imageUrl && (
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">Uploaded Outfit Image</Label>
                    <div className="mt-2 relative h-64 w-full rounded-lg overflow-hidden border-2 border-emerald-200">
                      <Image
                        src={viewEvent.imageUrl}
                        alt={viewEvent.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
                {viewEvent.description && (
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">How does this outfit make you feel?</Label>
                    <p className="text-slate-700 mt-1">{viewEvent.description}</p>
                  </div>
                )}
                {viewEvent.outfit ? (
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">Planned Outfit</Label>
                    <div className="mt-2 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        <p className="text-lg font-medium text-emerald-900">{viewEvent.outfit.name}</p>
                        {viewEvent.outfit.items && viewEvent.outfit.items.length > 0 && (
                          <span className="ml-auto text-sm text-emerald-600">
                            {viewEvent.outfit.items.length} {viewEvent.outfit.items.length === 1 ? 'item' : 'items'}
                          </span>
                        )}
                      </div>
                      {viewEvent.outfit.items && Array.isArray(viewEvent.outfit.items) && viewEvent.outfit.items.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          {viewEvent.outfit.items.map((item: any) => (
                            <div
                              key={item.id}
                              className="relative group bg-white rounded-lg border border-emerald-200 overflow-hidden hover:shadow-lg transition-all"
                            >
                              <div className="relative h-48 w-full">
                                {item.wardrobeItem.imageUrl.startsWith('data:') ? (
                                  <img
                                    src={item.wardrobeItem.imageUrl}
                                    alt={item.wardrobeItem.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Image
                                    src={item.wardrobeItem.imageUrl}
                                    alt={item.wardrobeItem.name}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      downloadImage(item.wardrobeItem.imageUrl, item.wardrobeItem.name)
                                    }}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                              <div className="p-3">
                                <p className="text-sm font-medium text-slate-900 truncate">{item.wardrobeItem.name}</p>
                                <p className="text-xs text-slate-500 capitalize">{item.wardrobeItem.category}</p>
                                {item.wardrobeItem.color && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <div
                                      className="w-4 h-4 rounded-full border border-slate-300"
                                      style={{ backgroundColor: item.wardrobeItem.color }}
                                    />
                                    <span className="text-xs text-slate-600">{item.wardrobeItem.color}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <ImageIcon className="h-12 w-12 mx-auto mb-2 text-slate-300" />
                          <p className="text-sm">
                            {viewEvent.outfit.items 
                              ? 'No items in this outfit. Add items to the outfit to see images here.' 
                              : 'Outfit items not loaded. The outfit may not have any items yet.'}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            onClick={() => window.location.href = '/outfits'}
                          >
                            Go to Outfits
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">Planned Outfit</Label>
                    <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-sm text-slate-600">No outfit planned for this event</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleEdit(viewEvent)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(viewEvent.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {viewMode === 'calendar' ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar Grid */}
            <div className="lg:col-span-2">
              <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                <CardHeader className="px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={previousMonth}
                        className="border-emerald-200 hover:bg-emerald-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <h2 className="text-2xl font-bold text-emerald-900">
                        {format(currentMonth, 'MMMM yyyy')}
                      </h2>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextMonth}
                        className="border-emerald-200 hover:bg-emerald-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      onClick={goToToday}
                      className="border-emerald-200 hover:bg-emerald-50 text-emerald-700"
                    >
                      Today
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-semibold text-emerald-700 py-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, idx) => {
                      const dayEvents = getEventsForDate(day)
                      const isCurrentMonth = isSameMonth(day, currentMonth)
                      const isDayToday = isToday(day)
                      const hasEvents = dayEvents.length > 0
                      const isSelected = selectedDate && isSameDay(day, selectedDate)

                      return (
                        <button
                          key={idx}
                          onClick={() => handleDateClick(day)}
                          className={`
                            aspect-square p-2 rounded-lg text-sm transition-all relative
                            ${isCurrentMonth ? 'text-slate-900' : 'text-slate-400'}
                            ${isDayToday ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-300' : ''}
                            ${isSelected && !isDayToday ? 'bg-teal-100 border-2 border-teal-500' : ''}
                            ${!isDayToday && !isSelected && isCurrentMonth ? 'hover:bg-emerald-50' : ''}
                            ${hasEvents && !isDayToday && !isSelected ? 'bg-teal-50 border border-teal-200' : ''}
                            ${!isCurrentMonth ? 'opacity-50' : ''}
                          `}
                        >
                          <div className="flex flex-col items-center h-full">
                            <span className="font-semibold">{format(day, 'd')}</span>
                            {hasEvents && (
                              <div className="flex gap-0.5 mt-1 justify-center flex-wrap">
                                {dayEvents.slice(0, 3).map((event) => (
                                  <div
                                    key={event.id}
                                    className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                                    title={event.title}
                                  />
                                ))}
                                {dayEvents.length > 3 && (
                                  <span className="text-xs text-emerald-600 font-semibold">+{dayEvents.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Date Events */}
              {selectedDate && getEventsForDate(selectedDate).length > 0 && (
                <Card className="mt-6 glass-card border-emerald-200/50 shadow-lg card-hover">
                  <CardHeader className="px-6 pt-6 pb-4">
                    <CardTitle className="text-lg">
                      Events on {format(selectedDate, 'MMMM d, yyyy')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <div className="space-y-3">
                      {getEventsForDate(selectedDate).map((event) => (
                        <div
                          key={event.id}
                          onClick={() => setViewEvent(event)}
                          className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-emerald-900">{event.title}</h3>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setViewEvent(event)
                                  }}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </div>
                              {event.description && (
                                <p className="text-sm text-slate-600 mb-2 line-clamp-2">{event.description}</p>
                              )}
                              {event.outfit && (
                                <div className="mt-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Sparkles className="h-4 w-4 text-emerald-600" />
                                    <span className="text-sm font-medium text-emerald-700">
                                      {event.outfit.name}
                                    </span>
                                  </div>
                                  {event.outfit.items && event.outfit.items.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mt-3">
                                      {event.outfit.items.slice(0, 4).map((item) => (
                                        <div key={item.id} className="relative h-16 rounded-lg overflow-hidden border border-emerald-200">
                                          {item.wardrobeItem.imageUrl.startsWith('data:') ? (
                                            <img
                                              src={item.wardrobeItem.imageUrl}
                                              alt={item.wardrobeItem.name}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <Image
                                              src={item.wardrobeItem.imageUrl}
                                              alt={item.wardrobeItem.name}
                                              fill
                                              className="object-cover"
                                            />
                                          )}
                                        </div>
                                      ))}
                                      {event.outfit.items.length > 4 && (
                                        <div className="relative h-16 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                                          <span className="text-xs font-medium text-emerald-700">
                                            +{event.outfit.items.length - 4}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Upcoming Events Sidebar */}
            <div className="lg:col-span-1">
              <Card className="glass-card border-emerald-200/50 shadow-lg card-hover sticky top-24">
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-emerald-300 mx-auto mb-3" />
                      <p className="text-sm text-slate-600">No upcoming events</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingEvents.map((event) => {
                        const eventDate = parseISO(event.date)
                        const isTodayEvent = isToday(eventDate)
                        const daysUntil = differenceInDays(eventDate, new Date())
                        
                        return (
                          <div
                            key={event.id}
                            onClick={() => {
                              setSelectedDate(eventDate)
                              setCurrentMonth(eventDate)
                              setViewEvent(event)
                            }}
                            className={`
                              p-3 rounded-lg border cursor-pointer transition-all
                              ${isTodayEvent 
                                ? 'bg-gradient-to-r from-emerald-100 to-teal-100 border-emerald-300 shadow-sm' 
                                : 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-100 hover:shadow-sm'
                              }
                            `}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`
                                    w-2 h-2 rounded-full
                                    ${isTodayEvent ? 'bg-emerald-600' : 'bg-teal-500'}
                                  `} />
                                  <h4 className="font-semibold text-sm text-emerald-900 truncate">
                                    {event.title}
                                  </h4>
                                </div>
                                <p className="text-xs text-slate-600 mb-1">
                                  {format(eventDate, 'MMM d, yyyy')}
                                  {daysUntil > 0 && daysUntil <= 7 && (
                                    <span className="ml-2 text-emerald-600 font-medium">
                                      ({daysUntil} {daysUntil === 1 ? 'day' : 'days'})
                                    </span>
                                  )}
                                </p>
                                {event.outfit && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Sparkles className="h-3 w-3 text-emerald-600" />
                                    <span className="text-xs text-emerald-700 truncate">
                                      {event.outfit.name}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <EmptyState
                icon={<CalendarIcon className="h-8 w-8" />}
                illustration="calendar"
                title="No upcoming events"
                description="Start planning your outfits and events!"
                action={{
                  label: "Plan Your First Outfit",
                  onClick: () => {
                    setFormData({ date: '', title: '', description: '', outfitId: '', eventType: '', image: null })
                    setImagePreview(null)
                    setOpen(true)
                  },
                  icon: <Plus className="h-5 w-5" />
                }}
                tips={[
                  "Plan outfits for special occasions",
                  "Link events to your favorite outfits",
                  "Add notes about how you want to feel",
                  "Schedule outfit planning in advance"
                ]}
              />
            ) : (
              upcomingEvents.map((event) => {
                const eventDate = parseISO(event.date)
                const isTodayEvent = isToday(eventDate)
                const daysUntil = differenceInDays(eventDate, new Date())
                
                return (
                  <Card
                    key={event.id}
                    className={`
                      bg-white/95 backdrop-blur-md border-emerald-200/50 hover:border-emerald-400 hover:shadow-xl transition-all shadow-sm
                      ${isTodayEvent ? 'ring-2 ring-emerald-300' : ''}
                    `}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`
                              w-3 h-3 rounded-full
                              ${isTodayEvent ? 'bg-emerald-600' : 'bg-teal-500'}
                            `} />
                            <CardTitle className="text-lg">{event.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600 ml-5">
                            <Clock className="h-4 w-4" />
                            <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
                            {daysUntil > 0 && daysUntil <= 7 && (
                              <span className="text-emerald-600 font-medium">
                                • {daysUntil} {daysUntil === 1 ? 'day' : 'days'} away
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setViewEvent(event)}
                            className="border-emerald-200"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => handleEdit(event)}
                            className="border-emerald-200"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      {event.description && (
                        <p className="text-sm text-slate-600 mb-3">{event.description}</p>
                      )}
                      {event.outfit && (
                        <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-emerald-600" />
                            <p className="text-sm font-medium text-emerald-900">
                              Planned Outfit: {event.outfit.name}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
