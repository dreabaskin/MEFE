import { prisma } from './prisma'

export async function generateInsights(userId: string) {
  const moodLogs = await prisma.moodLog.findMany({
    where: { userId },
    include: {
      outfit: {
        include: {
          items: {
            include: {
              wardrobeItem: true,
            },
          },
        },
      },
    },
    orderBy: { date: 'desc' },
    take: 50,
  })

  const insights: Array<{
    type: string
    title: string
    description: string
    data?: any
  }> = []

  // Mood pattern analysis
  const moodCounts: Record<string, number> = {}
  moodLogs.forEach((log) => {
    moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
  })

  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]
  if (topMood) {
    insights.push({
      type: 'mood_pattern',
      title: `Your Most Common Mood`,
      description: `You feel "${topMood[0]}" most often (${topMood[1]} times). This suggests you're naturally drawn to styles that evoke this feeling.`,
      data: { mood: topMood[0], count: topMood[1] },
    })
  }

  // Color impact analysis
  const colorMoodMap: Record<string, { moods: string[]; avgConfidence: number }> = {}
  moodLogs.forEach((log) => {
    if (log.outfit) {
      log.outfit.items.forEach((item) => {
        const color = item.wardrobeItem.color || 'unknown'
        if (!colorMoodMap[color]) {
          colorMoodMap[color] = { moods: [], avgConfidence: 0 }
        }
        colorMoodMap[color].moods.push(log.mood)
        colorMoodMap[color].avgConfidence += log.confidence
      })
    }
  })

  Object.entries(colorMoodMap).forEach(([color, data]) => {
    const avgConf = data.avgConfidence / data.moods.length
    const moodFreq: Record<string, number> = {}
    data.moods.forEach((m) => {
      moodFreq[m] = (moodFreq[m] || 0) + 1
    })
    const topMoodForColor = Object.entries(moodFreq).sort((a, b) => b[1] - a[1])[0]

    if (topMoodForColor && avgConf > 6) {
      insights.push({
        type: 'color_impact',
        title: `${color} Makes You Feel ${topMoodForColor[0]}`,
        description: `When you wear ${color}, you typically feel ${topMoodForColor[0]} with an average confidence of ${avgConf.toFixed(1)}/10.`,
        data: { color, mood: topMoodForColor[0], confidence: avgConf },
      })
    }
  })

  // Category preference
  const categoryMoodMap: Record<string, { moods: string[]; avgEnergy: number }> = {}
  moodLogs.forEach((log) => {
    if (log.outfit) {
      log.outfit.items.forEach((item) => {
        const category = item.wardrobeItem.category
        if (!categoryMoodMap[category]) {
          categoryMoodMap[category] = { moods: [], avgEnergy: 0 }
        }
        categoryMoodMap[category].moods.push(log.mood)
        categoryMoodMap[category].avgEnergy += log.energy
      })
    }
  })

  Object.entries(categoryMoodMap).forEach(([category, data]) => {
    const avgEnergy = data.avgEnergy / data.moods.length
    if (avgEnergy > 7) {
      insights.push({
        type: 'category_preference',
        title: `${category} Boosts Your Energy`,
        description: `Wearing ${category} items gives you an average energy level of ${avgEnergy.toFixed(1)}/10.`,
        data: { category, energy: avgEnergy },
      })
    }
  })

  // Delete old insights and create new ones
  await prisma.insight.deleteMany({
    where: { userId },
  })

  // Save insights
  if (insights.length > 0) {
    await prisma.insight.createMany({
      data: insights.map((insight) => ({
        userId,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        data: insight.data,
      })),
    })
  }

  return insights
}

