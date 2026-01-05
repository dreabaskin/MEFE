import OpenAI from 'openai'
import { prisma } from './prisma'

export async function getOutfitSuggestion(
  userId: string,
  desiredMood: string,
  occasion?: string
): Promise<string> {
  // Initialize OpenAI client inside the function to avoid build-time evaluation
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  // Get user's wardrobe items
  const wardrobeItems = await prisma.wardrobeItem.findMany({
    where: { userId },
  })

  // Get user's mood history
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
    take: 10,
  })

  // Build context for AI
  const wardrobeContext = wardrobeItems
    .map((item) => `${item.name} (${item.category}, ${item.color || 'no color'})`)
    .join(', ')

  const moodContext = moodLogs
    .map((log) => {
      const items = log.outfit?.items.map((i) => i.wardrobeItem.name).join(', ') || 'unknown'
      return `Felt ${log.mood} wearing: ${items}`
    })
    .join('; ')

  const prompt = `You are a personal styling assistant helping someone dress to feel "${desiredMood}".

Available wardrobe items: ${wardrobeContext}

Recent mood-outfit connections: ${moodContext}

${occasion ? `Occasion: ${occasion}` : ''}

Suggest a specific outfit combination from the available items that would help the user feel ${desiredMood}. 
Be specific about which items to combine. Format your response as a clear, friendly suggestion (2-3 sentences).`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a thoughtful, empathetic personal styling assistant that understands the emotional connection between clothing and mood.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || 'Unable to generate suggestion at this time.'
  } catch (error) {
    console.error('OpenAI API error:', error)
    return 'I apologize, but I cannot generate outfit suggestions right now. Please try again later.'
  }
}






