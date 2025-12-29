import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/navbar'
import { DailyQuote } from '@/components/daily-quote'
import { PageHeader } from '@/components/page-header'
import { PersonalizedGreeting } from '@/components/personalized-greeting'
import { ActivityTimeline } from '@/components/activity-timeline'
import { QuickActionsWidget } from '@/components/quick-actions-widget'
import { WeatherWidget } from '@/components/weather-widget'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shirt, Sparkles, Calendar, Heart, TrendingUp, Plus, Clock, ArrowRight, Eye, Zap, BarChart3, Palette, CalendarDays } from 'lucide-react'
import { format, isToday, parseISO } from 'date-fns'
import Image from 'next/image'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/api/auth/signin')
  }

  const [
    wardrobeCount,
    outfitsCount,
    eventsCount,
    moodLogsCount,
    recentInsights,
    recentWardrobeItems,
    recentOutfits,
    upcomingEvents,
    recentMoodLogs,
    wardrobeStats,
    moodStats,
  ] = await Promise.all([
    prisma.wardrobeItem.count({ where: { userId: session.user.id } }),
    prisma.outfit.count({ where: { userId: session.user.id } }),
    prisma.calendarEvent.count({ where: { userId: session.user.id } }),
    prisma.moodLog.count({ where: { userId: session.user.id } }),
    prisma.insight.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    }),
    prisma.wardrobeItem.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: {
        id: true,
        name: true,
        imageUrl: true,
        category: true,
        createdAt: true,
      },
    }),
    prisma.outfit.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: {
        items: {
          include: {
            wardrobeItem: {
              select: {
                id: true,
                imageUrl: true,
                name: true,
              },
            },
          },
          take: 1,
        },
      },
    }),
    prisma.calendarEvent.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: new Date(),
        },
      },
      orderBy: { date: 'asc' },
      take: 5,
      include: {
        outfit: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.moodLog.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 3,
      include: {
        outfit: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.wardrobeItem.groupBy({
      by: ['category'],
      where: { userId: session.user.id },
      _count: true,
    }),
    prisma.moodLog.findMany({
      where: { userId: session.user.id },
      select: {
        energy: true,
        confidence: true,
        mood: true,
      },
    }),
  ])

  // Calculate mood statistics
  const avgEnergy = moodStats.length > 0
    ? (moodStats.reduce((sum, log) => sum + log.energy, 0) / moodStats.length).toFixed(1)
    : '0'
  const avgConfidence = moodStats.length > 0
    ? (moodStats.reduce((sum, log) => sum + log.confidence, 0) / moodStats.length).toFixed(1)
    : '0'

  const topCategory = wardrobeStats.length > 0
    ? wardrobeStats.sort((a, b) => b._count - a._count)[0]
    : null

  // Build activity timeline from recent activities
  const activities = [
    ...recentWardrobeItems.slice(0, 3).map(item => ({
      id: item.id,
      type: 'wardrobe' as const,
      title: `Added ${item.name}`,
      description: `New ${item.category} item`,
      date: item.createdAt,
      iconType: 'wardrobe' as const,
      color: 'from-emerald-500 to-emerald-600',
      href: '/wardrobe'
    })),
    ...recentOutfits.slice(0, 2).map(outfit => ({
      id: outfit.id,
      type: 'outfit' as const,
      title: `Created ${outfit.name}`,
      description: `${outfit.items.length} items`,
      date: outfit.createdAt,
      iconType: 'outfit' as const,
      color: 'from-teal-500 to-teal-600',
      href: '/outfits'
    })),
    ...upcomingEvents.slice(0, 2).map(event => ({
      id: event.id,
      type: 'event' as const,
      title: `Planned ${event.title}`,
      description: format(parseISO(event.date.toISOString()), 'MMM d'),
      date: event.date,
      iconType: 'event' as const,
      color: 'from-cyan-500 to-cyan-600',
      href: '/calendar'
    })),
    ...recentMoodLogs.slice(0, 2).map(log => ({
      id: log.id,
      type: 'mood' as const,
      title: `Logged ${log.mood} mood`,
      description: `Energy: ${log.energy}/10, Confidence: ${log.confidence}/10`,
      date: log.date,
      iconType: 'mood' as const,
      color: 'from-pink-500 to-pink-600',
      href: '/mood'
    }))
  ].sort((a, b) => {
    const dateA = typeof a.date === 'string' ? parseISO(a.date) : a.date
    const dateB = typeof b.date === 'string' ? parseISO(b.date) : b.date
    return dateB.getTime() - dateA.getTime()
  }).slice(0, 8)

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Personalized Greeting */}
        <div className="mb-8 lg:mb-10">
          <PersonalizedGreeting userName={session.user.name} />
        </div>

        {/* Main Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-10 lg:mb-12">
          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 lg:px-7 pt-6 lg:pt-7">
              <CardTitle className="text-sm font-semibold text-slate-700">Wardrobe Items</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <Shirt className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="px-6 lg:px-7 pb-6 lg:pb-7">
              <div className="text-3xl lg:text-4xl font-bold text-emerald-600 mb-3">{wardrobeCount}</div>
              <Link href="/wardrobe">
                <Button variant="ghost" size="sm" className="mt-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                  View Wardrobe <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 lg:px-7 pt-6 lg:pt-7">
              <CardTitle className="text-sm font-semibold text-slate-700">Outfits</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="px-6 lg:px-7 pb-6 lg:pb-7">
              <div className="text-3xl lg:text-4xl font-bold text-teal-600 mb-3">{outfitsCount}</div>
              <Link href="/outfits">
                <Button variant="ghost" size="sm" className="mt-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50">
                  View Outfits <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 lg:px-7 pt-6 lg:pt-7">
              <CardTitle className="text-sm font-semibold text-slate-700">Calendar Events</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="px-6 lg:px-7 pb-6 lg:pb-7">
              <div className="text-3xl lg:text-4xl font-bold text-cyan-600 mb-3">{eventsCount}</div>
              <Link href="/calendar">
                <Button variant="ghost" size="sm" className="mt-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
                  View Calendar <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 lg:px-7 pt-6 lg:pt-7">
              <CardTitle className="text-sm font-semibold text-slate-700">Mood Logs</CardTitle>
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="px-6 lg:px-7 pb-6 lg:pb-7">
              <div className="text-3xl lg:text-4xl font-bold text-pink-600 mb-3">{moodLogsCount}</div>
              <Link href="/mood">
                <Button variant="ghost" size="sm" className="mt-2 text-pink-600 hover:text-pink-700 hover:bg-pink-50">
                  View Moods <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        {moodStats.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-10 lg:mb-12">
            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-6 lg:px-7 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Avg Energy</p>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600">{avgEnergy}/10</p>
                  </div>
                  <Zap className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-6 lg:px-7 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Avg Confidence</p>
                    <p className="text-2xl lg:text-3xl font-bold text-teal-600">{avgConfidence}/10</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-teal-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-6 pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Top Category</p>
                    <p className="text-lg font-bold text-emerald-600 capitalize">
                      {topCategory?.category || 'N/A'}
                    </p>
                    {topCategory && (
                      <p className="text-xs text-slate-500">{topCategory._count} items</p>
                    )}
                  </div>
                  <Palette className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-10 lg:mb-12">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity Timeline */}
            <ActivityTimeline activities={activities} />
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                <CardHeader className="px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-emerald-600" />
                        Upcoming Events
                      </CardTitle>
                      <CardDescription>Your next planned outfits and events</CardDescription>
                    </div>
                    <Link href="/calendar">
                      <Button variant="ghost" size="sm" className="text-emerald-600">
                        View All <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => {
                      const eventDate = parseISO(event.date.toISOString())
                      const isTodayEvent = isToday(eventDate)
                      return (
                        <Link
                          key={event.id}
                          href="/calendar"
                          className="block p-4 rounded-lg border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all bg-gradient-to-r from-emerald-50/50 to-teal-50/50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${isTodayEvent ? 'bg-emerald-600' : 'bg-teal-500'}`} />
                                <h3 className="font-semibold text-emerald-900">{event.title}</h3>
                              </div>
                              <p className="text-sm text-slate-600 mb-1">
                                {format(eventDate, 'EEEE, MMMM d, yyyy')}
                                {isTodayEvent && (
                                  <span className="ml-2 px-2 py-0.5 bg-emerald-600 text-white text-xs rounded-full">Today</span>
                                )}
                              </p>
                              {event.outfit && (
                                <div className="flex items-center gap-1 mt-2">
                                  <Sparkles className="h-3 w-3 text-emerald-600" />
                                  <span className="text-xs text-emerald-700">{event.outfit.name}</span>
                                </div>
                              )}
                            </div>
                            <Clock className="h-4 w-4 text-slate-400" />
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Mood Logs */}
            {recentMoodLogs.length > 0 && (
              <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                <CardHeader className="px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-pink-600" />
                        Recent Mood Logs
                      </CardTitle>
                      <CardDescription>Your latest emotional style connections</CardDescription>
                    </div>
                    <Link href="/mood">
                      <Button variant="ghost" size="sm" className="text-pink-600">
                        View All <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-3">
                    {recentMoodLogs.map((log) => (
                      <Link
                        key={log.id}
                        href="/mood"
                        className="block p-4 rounded-lg border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all bg-gradient-to-r from-pink-50/50 to-emerald-50/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">
                              {log.mood === 'confident' && '✨'}
                              {log.mood === 'comfortable' && '😌'}
                              {log.mood === 'powerful' && '💪'}
                              {log.mood === 'creative' && '🎨'}
                              {log.mood === 'elegant' && '👗'}
                              {log.mood === 'playful' && '🎉'}
                              {log.mood === 'relaxed' && '🧘'}
                              {log.mood === 'bold' && '🔥'}
                              {log.mood === 'sophisticated' && '💼'}
                              {log.mood === 'energetic' && '⚡'}
                              {!['confident', 'comfortable', 'powerful', 'creative', 'elegant', 'playful', 'relaxed', 'bold', 'sophisticated', 'energetic'].includes(log.mood) && '😊'}
                            </div>
                            <div>
                              <p className="font-semibold text-emerald-900 capitalize">{log.mood}</p>
                              <p className="text-sm text-slate-600">
                                {format(parseISO(log.date.toISOString()), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Energy</p>
                              <p className="text-sm font-bold text-emerald-600">{log.energy}/10</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Confidence</p>
                              <p className="text-sm font-bold text-teal-600">{log.confidence}/10</p>
                            </div>
                          </div>
                        </div>
                        {log.outfit && (
                          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-emerald-100">
                            <Sparkles className="h-3 w-3 text-emerald-600" />
                            <span className="text-xs text-emerald-700">{log.outfit.name}</span>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Quick Actions Widget */}
            <QuickActionsWidget />
            
            {/* Weather Widget */}
            <WeatherWidget />

            {/* AI Outfit Suggestion */}
            <Card className="bg-gradient-to-br from-emerald-50/90 to-teal-50/90 backdrop-blur-md border-emerald-200/50 shadow-lg">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  AI Outfit Suggestion
                </CardTitle>
                <CardDescription>
                  Get personalized outfit recommendations based on your desired mood
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <Link href="/outfits?ai=true">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Suggestion
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Wardrobe Items */}
            {recentWardrobeItems.length > 0 && (
              <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                <CardHeader className="px-6 pt-6 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Recent Items</CardTitle>
                    <Link href="/wardrobe">
                      <Button variant="ghost" size="sm" className="text-emerald-600">
                        View All <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {recentWardrobeItems.map((item) => (
                      <Link
                        key={item.id}
                        href="/wardrobe"
                        className="group relative h-24 rounded-lg overflow-hidden border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all"
                      >
                        {item.imageUrl.startsWith('data:') ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-xs text-white font-medium truncate">{item.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Insights */}
        {recentInsights.length > 0 && (
          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
            <CardHeader className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    Recent Insights
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Discoveries about your style-mood connections
                  </CardDescription>
                </div>
                <Link href="/insights">
                  <Button variant="ghost" size="sm" className="text-emerald-600">
                    View All <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid md:grid-cols-3 gap-4">
                {recentInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-emerald-900 mb-2">{insight.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">{insight.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Outfits */}
        {recentOutfits.length > 0 && (
          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover mt-6">
            <CardHeader className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-teal-600" />
                    Recent Outfits
                  </CardTitle>
                  <CardDescription>Your latest style combinations</CardDescription>
                </div>
                <Link href="/outfits">
                  <Button variant="ghost" size="sm" className="text-teal-600">
                    View All <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="grid md:grid-cols-3 gap-4">
                {recentOutfits.map((outfit) => (
                  <Link
                    key={outfit.id}
                    href="/outfits"
                    className="group block p-4 rounded-lg border border-emerald-200 hover:border-emerald-400 hover:shadow-md transition-all bg-gradient-to-r from-teal-50/50 to-emerald-50/50"
                  >
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {outfit.items.slice(0, 4).map((item) => (
                        <div key={item.wardrobeItem.id} className="relative h-20 rounded-lg overflow-hidden border border-emerald-200">
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
                    </div>
                    <h3 className="font-semibold text-emerald-900 mb-1">{outfit.name}</h3>
                    <p className="text-xs text-slate-500">{outfit.items.length} items</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <DailyQuote />
    </div>
  )
}
