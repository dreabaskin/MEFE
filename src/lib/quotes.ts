export interface Quote {
  text: string
  author?: string
  hashtags?: string[]
}

export const quotes: Quote[] = [
  {
    text: "Let your clothing be the daily support of your new mindset. A daily encouragement of the best you.",
    hashtags: ["#mindsetthroughfashion", "#mindset", "#evolution", "#fashion", "#clothing", "#fashionempowerment"]
  },
  {
    text: "Enjoy your success while dressed for more.",
    hashtags: ["#success", "#fashion", "#empowerment", "#mindset", "#growth"]
  },
  {
    text: "Hi queen, don't forget to attire yourself for the attitude you aspire to.",
    hashtags: ["#queen", "#attitude", "#aspiration", "#fashion", "#empowerment", "#mindset"]
  },
  {
    text: "Today is your day. Dress like it.",
    hashtags: ["#today", "#confidence", "#fashion", "#empowerment", "#mindset"]
  },
  {
    text: "You are powerful. Your outfit should reflect that energy.",
    hashtags: ["#power", "#energy", "#fashion", "#confidence", "#empowerment"]
  },
  {
    text: "Feel beautiful. Look beautiful. Be beautiful. Start with what you wear.",
    hashtags: ["#beauty", "#confidence", "#fashion", "#selflove", "#empowerment"]
  },
  {
    text: "Your clothes are your armor. Wear them with pride and confidence.",
    hashtags: ["#armor", "#confidence", "#fashion", "#empowerment", "#mindset"]
  },
  {
    text: "Dress for the woman you're becoming, not the one you were yesterday.",
    hashtags: ["#growth", "#evolution", "#fashion", "#mindset", "#transformation"]
  },
  {
    text: "Every morning is a fresh start. Let your outfit set the tone for greatness.",
    hashtags: ["#freshstart", "#greatness", "#fashion", "#mindset", "#motivation"]
  },
  {
    text: "You deserve to feel amazing. Start by wearing something that makes you feel unstoppable.",
    hashtags: ["#selfworth", "#confidence", "#fashion", "#empowerment", "#feelings"]
  },
  {
    text: "Your outfit is your first impression. Make it count. Make it powerful.",
    hashtags: ["#firstimpression", "#power", "#fashion", "#confidence", "#mindset"]
  },
  {
    text: "When you look good, you feel good. When you feel good, you do good.",
    hashtags: ["#feelgood", "#lookgood", "#fashion", "#confidence", "#empowerment"]
  },
  {
    text: "Dress for the life you want, not the life you have.",
    hashtags: ["#aspiration", "#dreams", "#fashion", "#mindset", "#manifestation"]
  },
  {
    text: "You are enough. Your outfit should remind you of that every single day.",
    hashtags: ["#selfworth", "#enough", "#fashion", "#selflove", "#empowerment"]
  },
  {
    text: "Let your style speak before you do. Make it say: I am confident, I am powerful, I am unstoppable.",
    hashtags: ["#style", "#confidence", "#power", "#fashion", "#empowerment"]
  },
  {
    text: "Your clothing choices today shape how you feel tomorrow. Choose wisely, choose confidently.",
    hashtags: ["#choices", "#feelings", "#fashion", "#mindset", "#confidence"]
  },
  {
    text: "You are a queen. Dress like one. Act like one. Be one.",
    hashtags: ["#queen", "#royalty", "#fashion", "#confidence", "#empowerment"]
  },
  {
    text: "Don't just wear clothes. Wear confidence. Wear power. Wear your dreams.",
    hashtags: ["#confidence", "#power", "#dreams", "#fashion", "#empowerment"]
  },
  {
    text: "Your outfit is your daily reminder that you are capable of anything.",
    hashtags: ["#capability", "#reminder", "#fashion", "#confidence", "#mindset"]
  },
  {
    text: "Feel the power in what you wear. Let it fuel your confidence and light up your day.",
    hashtags: ["#power", "#confidence", "#fashion", "#energy", "#empowerment"]
  },
  {
    text: "You woke up today. That's already a win. Now dress like the winner you are.",
    hashtags: ["#winner", "#victory", "#fashion", "#confidence", "#mindset"]
  },
  {
    text: "Your style is your story. Make it one of strength, confidence, and unapologetic self-love.",
    hashtags: ["#story", "#strength", "#selflove", "#fashion", "#confidence"]
  },
  {
    text: "Dress for the energy you want to feel. Your clothing is your daily dose of empowerment.",
    hashtags: ["#energy", "#empowerment", "#fashion", "#mindset", "#feelings"]
  },
  {
    text: "You are beautiful. You are strong. You are worthy. Let your outfit reflect that truth.",
    hashtags: ["#beauty", "#strength", "#worth", "#fashion", "#selflove"]
  },
  {
    text: "Today, choose an outfit that makes you feel like you can conquer the world.",
    hashtags: ["#conquer", "#confidence", "#fashion", "#empowerment", "#mindset"]
  },
  {
    text: "Your confidence starts with what you wear. So wear something that makes you feel invincible.",
    hashtags: ["#confidence", "#invincible", "#fashion", "#empowerment", "#feelings"]
  }
]

/**
 * Get a random quote from the quotes array
 */
export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)]
}

/**
 * Get a quote by index (useful for cycling through quotes)
 */
export function getQuoteByIndex(index: number): Quote {
  return quotes[index % quotes.length]
}

