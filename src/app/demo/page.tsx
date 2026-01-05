"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowLeft, Heart, TrendingUp, Zap, Smile, RefreshCw } from "lucide-react"
import Link from "next/link"

// Dummy wardrobe data with local images
const dummyWardrobe = [
  { 
    id: 1, 
    name: "Graphic Tee", 
    category: "Tops", 
    color: "Beige", 
    image: "/demo-wardrobe/graphic-tee.jpg", 
    tags: ["Casual", "Comfortable", "Versatile"],
    style: "casual"
  },
  { 
    id: 2, 
    name: "Beige Ankle Boots", 
    category: "Shoes", 
    color: "Beige", 
    image: "/demo-wardrobe/beige-boots.jpg", 
    tags: ["Elegant", "Structured", "Confident"],
    style: "structured"
  },
  { 
    id: 3, 
    name: "Distressed Jeans", 
    category: "Bottoms", 
    color: "Blue", 
    image: "/demo-wardrobe/distressed-jeans.jpg", 
    tags: ["Edgy", "Casual", "Bold"],
    style: "casual"
  },
  { 
    id: 4, 
    name: "Black Tee", 
    category: "Tops", 
    color: "Black", 
    image: "/demo-wardrobe/black-tee.jpg", 
    tags: ["Minimalist", "Versatile", "Classic"],
    style: "structured"
  },
  { 
    id: 5, 
    name: "Ray-Ban Sunglasses", 
    category: "Accessories", 
    color: "Black", 
    image: "/demo-wardrobe/sunglasses.jpg", 
    tags: ["Classic", "Stylish", "Confident"],
    style: "structured"
  },
  { 
    id: 6, 
    name: "Red Floral Shirt", 
    category: "Tops", 
    color: "Red", 
    image: "/demo-wardrobe/floral-shirt.jpg", 
    tags: ["Bold", "Playful", "Romantic"],
    style: "romantic"
  },
  { 
    id: 7, 
    name: "Red High-Tops", 
    category: "Shoes", 
    color: "Red", 
    image: "/demo-wardrobe/red-sneakers.jpg", 
    tags: ["Bold", "Active", "Confident"],
    style: "energized"
  },
  { 
    id: 8, 
    name: "Cargo Pants", 
    category: "Bottoms", 
    color: "Grey", 
    image: "/demo-wardrobe/cargo-pants.jpg", 
    tags: ["Utilitarian", "Casual", "Relaxed"],
    style: "casual"
  },
  { 
    id: 9, 
    name: "Blue Loafers", 
    category: "Shoes", 
    color: "Blue", 
    image: "/demo-wardrobe/blue-loafers.jpg", 
    tags: ["Elegant", "Sophisticated", "Classic"],
    style: "structured"
  },
  { 
    id: 10, 
    name: "White Trucker Hat", 
    category: "Accessories", 
    color: "White", 
    image: "/demo-wardrobe/trucker-hat.jpg", 
    tags: ["Casual", "Cool", "Relaxed"],
    style: "casual"
  },
  { 
    id: 11, 
    name: "Denim Jacket", 
    category: "Outerwear", 
    color: "Blue", 
    image: "/demo-wardrobe/denim-jacket.jpg", 
    tags: ["Casual", "Cool", "Relaxed"],
    style: "casual"
  },
  { 
    id: 12, 
    name: "Linen Shirt", 
    category: "Tops", 
    color: "Navy", 
    image: "/demo-wardrobe/linen-shirt.jpg", 
    tags: ["Classic", "Comfortable", "Relaxed"],
    style: "relaxed"
  },
  { 
    id: 13, 
    name: "Dark Jeans", 
    category: "Bottoms", 
    color: "Grey", 
    image: "/demo-wardrobe/dark-jeans.jpg", 
    tags: ["Versatile", "Classic", "Comfortable"],
    style: "casual"
  },
  { 
    id: 14, 
    name: "Baseball Cap", 
    category: "Accessories", 
    color: "Grey", 
    image: "/demo-wardrobe/baseball-cap.jpg", 
    tags: ["Casual", "Cool", "Relaxed"],
    style: "casual"
  },
]

// Smart outfit logic - detects outfit combinations
const detectOutfitStyle = (items: typeof dummyWardrobe) => {
  const styles = items.map(item => item.style)
  const hasBoots = items.some(item => item.name.toLowerCase().includes("boot") || item.name.toLowerCase().includes("loafer"))
  const hasSneakers = items.some(item => item.name.toLowerCase().includes("sneaker"))
  const hasFloral = items.some(item => item.name.toLowerCase().includes("floral"))
  const hasJacket = items.some(item => item.category === "Outerwear")
  const hasStructured = styles.includes("structured")
  const hasRomantic = styles.includes("romantic")
  const hasEnergized = styles.includes("energized")
  const hasRelaxed = styles.includes("relaxed")

  if (hasBoots && hasStructured) {
    return "confident"
  }
  if (hasFloral && hasRomantic) {
    return "creative"
  }
  if (hasSneakers && hasEnergized) {
    return "energized"
  }
  if (hasRelaxed || (hasJacket && hasStructured === false)) {
    return "relaxed"
  }
  if (hasStructured) {
    return "confident"
  }
  return "confident"
}

// Enhanced insights with AI-style phrasing
const generateInsight = (
  mood: "calm" | "energized" | "confident" | "creative" | "relaxed",
  items: typeof dummyWardrobe
) => {
  const outfitStyle = detectOutfitStyle(items)
  const itemNames = items.map(i => i.name).join(", ")
  
  const insights = {
    calm: {
      title: "Calm & Grounded",
      boost: "+35%",
      color: "from-blue-400 via-cyan-400 to-teal-400",
      gradientBg: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
      message: "This outfit supports calm energy by 35% in similar users.",
      insight: `Softer fabrics and neutral tones tend to support grounded, peaceful energy. Your choice of ${itemNames.toLowerCase()} helps maintain a sense of ease throughout the day. The comfortable layers create a protective cocoon that allows you to move through your day with gentle confidence.`,
      why: "Neutral colors and soft textures signal safety to your nervous system, reducing stress responses and promoting a sense of inner peace."
    },
    energized: {
      title: "Energized & Active",
      boost: "+42%",
      color: "from-yellow-400 via-orange-400 to-red-400",
      gradientBg: "from-yellow-500/20 via-orange-500/20 to-red-500/20",
      message: "This outfit boosts energy by 42% in similar users.",
      insight: `Bold colors and structured pieces help channel active energy. The combination of ${itemNames.toLowerCase()} creates a dynamic presence that supports high-energy activities. You've chosen pieces that mirror your inner drive, amplifying your natural vitality.`,
      why: "Structured silhouettes and vibrant colors activate your visual cortex, triggering a physiological response that increases alertness and motivation."
    },
    confident: {
      title: "Confident & Powerful",
      boost: "+40%",
      color: "from-purple-500 via-pink-500 to-rose-500",
      gradientBg: "from-purple-500/20 via-pink-500/20 to-rose-500/20",
      message: "This outfit boosted confidence by 40% in similar users.",
      insight: `Structured fabrics and darker tones tend to support grounded, powerful energy. Your tailored pieces like ${itemNames.toLowerCase()} create a strong silhouette that enhances self-assurance. This outfit channels assertive energy through defined lines and deep tones, mirroring your inner clarity.`,
      why: "Structured pieces create a physical boundary that translates to psychological boundaries, helping you feel more in control and self-assured."
    },
    creative: {
      title: "Creative & Expressive",
      boost: "+38%",
      color: "from-pink-400 via-rose-400 to-fuchsia-400",
      gradientBg: "from-pink-500/20 via-rose-500/20 to-fuchsia-500/20",
      message: "This outfit enhances creativity by 38% in similar users.",
      insight: `Unique patterns and vibrant colors support creative expression. Mixing textures and styles with ${itemNames.toLowerCase()} helps unlock innovative thinking and artistic inspiration. You've curated pieces that speak to your authentic self, allowing your creative voice to emerge.`,
      why: "Unexpected combinations and bold choices activate divergent thinking pathways in your brain, opening you to new perspectives and ideas."
    },
    relaxed: {
      title: "Relaxed & Comfortable",
      boost: "+33%",
      color: "from-green-400 via-emerald-400 to-teal-400",
      gradientBg: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
      message: "This outfit promotes relaxation by 33% in similar users.",
      insight: `Soft fabrics and loose fits support a sense of ease and comfort. Your selection of ${itemNames.toLowerCase()} helps you feel at home in your own skin, reducing stress throughout the day. These pieces create a gentle embrace that allows you to move freely and authentically.`,
      why: "Comfortable clothing reduces physical tension, which signals to your brain that you're safe and can relax, lowering cortisol levels."
    }
  }

  return insights[mood]
}

export default function DemoPage() {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [mood, setMood] = useState<"calm" | "energized" | "confident" | "creative" | "relaxed">("confident")
  const [moodValue, setMoodValue] = useState(50)

  const selectedWardrobeItems = useMemo(() => 
    dummyWardrobe.filter(item => selectedItems.includes(item.id)),
    [selectedItems]
  )

  // Auto-detect outfit style when items change
  useMemo(() => {
    if (selectedWardrobeItems.length > 0) {
      const detectedStyle = detectOutfitStyle(selectedWardrobeItems)
      setMood(detectedStyle)
      // Update slider position based on detected mood
      const moodPositions = { calm: 10, relaxed: 30, confident: 50, energized: 70, creative: 90 }
      setMoodValue(moodPositions[detectedStyle])
    }
  }, [selectedWardrobeItems])

  const handleItemClick = (itemId: number) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    } else {
      if (selectedItems.length < 5) {
        setSelectedItems([...selectedItems, itemId])
      }
    }
  }

  const handleMoodChange = (value: number) => {
    setMoodValue(value)
    if (value < 20) {
      setMood("calm")
    } else if (value < 40) {
      setMood("relaxed")
    } else if (value < 60) {
      setMood("confident")
    } else if (value < 80) {
      setMood("energized")
    } else {
      setMood("creative")
    }
  }

  const tryDifferentMood = () => {
    const moods: Array<"calm" | "energized" | "confident" | "creative" | "relaxed"> = 
      ["calm", "relaxed", "confident", "energized", "creative"]
    const currentIndex = moods.indexOf(mood)
    const nextIndex = (currentIndex + 1) % moods.length
    const nextMood = moods[nextIndex]
    setMood(nextMood)
    const moodPositions = { calm: 10, relaxed: 30, confident: 50, energized: 70, creative: 90 }
    setMoodValue(moodPositions[nextMood])
  }

  const currentInsight = useMemo(() => 
    generateInsight(mood, selectedWardrobeItems),
    [mood, selectedWardrobeItems]
  )

  // Mood slider gradient colors
  const moodGradients = {
    calm: "from-blue-400 via-cyan-400 to-teal-400",
    relaxed: "from-green-400 via-emerald-400 to-teal-400",
    confident: "from-purple-400 via-pink-400 to-rose-400",
    energized: "from-yellow-400 via-orange-400 to-red-400",
    creative: "from-pink-400 via-rose-400 to-fuchsia-400"
  }

  const sliderGradient = moodGradients[mood]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                MEFE
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200">
                DEMO
              </span>
            </Link>
            <Link href="/api/auth/signin">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                Get Started Free
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Intro Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium border border-emerald-200 mb-4">
            <Zap className="h-4 w-4" />
            <span>Interactive Demo - No Account Needed</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Experience MEFE in Action
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Explore how your wardrobe choices connect to your emotions. Click, drag, and discover insights — all without signing up.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Wardrobe Section */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                Your Wardrobe
              </CardTitle>
              <p className="text-sm text-slate-600 mt-2">
                Click items to add them to your outfit (up to 5 items)
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {dummyWardrobe.map((item) => {
                  const isSelected = selectedItems.includes(item.id)
                  const isHovered = hoveredItem === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`
                        relative aspect-square rounded-lg border-2 transition-all duration-200 overflow-hidden
                        ${isSelected 
                          ? "border-emerald-500 bg-emerald-50 shadow-md scale-105 ring-2 ring-emerald-200" 
                          : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                        }
                        ${isHovered ? "ring-2 ring-emerald-200 z-10" : ""}
                      `}
                    >
                      <div className="relative w-full h-full">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 pointer-events-none">
                          <span className="text-xs font-semibold text-white drop-shadow-lg">
                            {item.name}
                          </span>
                        </div>
                      </div>
                      {isHovered && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-20 shadow-xl min-w-[140px]">
                          <div className="font-semibold mb-2 text-center">{item.name}</div>
                          <div className="flex gap-1 flex-wrap justify-center">
                            {item.tags.map((tag, idx) => (
                              <span key={idx} className="bg-slate-700 px-2 py-0.5 rounded text-[10px]">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                            <div className="border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        </div>
                      )}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg z-10">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Outfit Canvas */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-emerald-600" />
                Your Outfit
              </CardTitle>
              <p className="text-sm text-slate-600 mt-2">
                {selectedItems.length > 0 
                  ? `${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} selected`
                  : "Select items from your wardrobe to build an outfit"
                }
              </p>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] border-2 border-dashed border-slate-200 rounded-lg bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/20 p-6 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Background texture */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }} />
                </div>
                
                {selectedWardrobeItems.length === 0 ? (
                  <div className="text-center text-slate-400 relative z-10">
                    <Sparkles className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">Your outfit will appear here</p>
                    <p className="text-xs mt-1">Click items from your wardrobe to get started</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full relative z-10">
                    {selectedWardrobeItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg border-2 border-emerald-200 p-3 shadow-md hover:shadow-lg transition-all relative overflow-hidden group"
                        style={{ 
                          transform: `rotate(${index % 2 === 0 ? -1 : 1}deg)`,
                          zIndex: selectedWardrobeItems.length - index
                        }}
                      >
                        <div className="relative aspect-square mb-2 rounded overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="text-xs font-medium text-slate-700 text-center">{item.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood Slider Section */}
        <Card className="bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-emerald-600" />
              How do you want to feel?
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">
              Adjust the slider to see how MEFE helps you dress for different emotions
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${sliderGradient} opacity-20 rounded-lg blur-xl`} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={moodValue}
                  onChange={(e) => handleMoodChange(Number(e.target.value))}
                  className="relative w-full h-4 bg-slate-200 rounded-lg appearance-none cursor-pointer z-10"
                  style={{
                    background: `linear-gradient(to right, 
                      ${mood === "calm" ? "#60a5fa" : mood === "relaxed" ? "#4ade80" : mood === "confident" ? "#a78bfa" : mood === "energized" ? "#fbbf24" : "#f472b6"} 0%, 
                      ${mood === "calm" ? "#60a5fa" : mood === "relaxed" ? "#4ade80" : mood === "confident" ? "#a78bfa" : mood === "energized" ? "#fbbf24" : "#f472b6"} ${moodValue}%, 
                      #e2e8f0 ${moodValue}%, 
                      #e2e8f0 100%)`
                  }}
                />
                <div className="flex justify-between mt-3 text-xs text-slate-600 font-medium">
                  <span className={mood === "calm" ? "text-blue-600 font-bold" : ""}>Calm</span>
                  <span className={mood === "relaxed" ? "text-green-600 font-bold" : ""}>Relaxed</span>
                  <span className={mood === "confident" ? "text-purple-600 font-bold" : ""}>Confident</span>
                  <span className={mood === "energized" ? "text-orange-600 font-bold" : ""}>Energized</span>
                  <span className={mood === "creative" ? "text-pink-600 font-bold" : ""}>Creative</span>
                </div>
              </div>
              
              {selectedItems.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                  <p className="text-sm font-medium text-emerald-800">
                    You chose <span className="font-bold capitalize">{mood}</span> — here's how MEFE helps you dress for that feeling.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Insight Card with Glassmorphism */}
        {selectedItems.length > 0 && currentInsight && (
          <Card className={`relative overflow-hidden border-0 shadow-2xl mb-8`}>
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentInsight.color} opacity-90`} />
            
            {/* Glassmorphism Overlay */}
            <div className="relative backdrop-blur-xl bg-white/10 border border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${currentInsight.color} flex items-center justify-center shadow-lg`}>
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-2xl flex items-center gap-2">
                        {currentInsight.title}
                      </CardTitle>
                      <p className="text-white/80 text-sm mt-1">Mood Badge</p>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border border-white/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">{currentInsight.boost}</div>
                      <div className="text-xs text-white/80">Confidence Boost</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xl font-semibold text-white/95 leading-relaxed">
                  {currentInsight.message}
                </p>
                <p className="text-white/90 leading-relaxed text-lg">
                  {currentInsight.insight}
                </p>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mt-4">
                  <p className="text-sm font-semibold text-white/90 mb-2">Why this works:</p>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {currentInsight.why}
                  </p>
                </div>
                {selectedItems.length > 0 && (
                  <div className="pt-4">
                    <Button
                      onClick={tryDifferentMood}
                      variant="outline"
                      className="bg-white/20 hover:bg-white/30 border-white/30 text-white backdrop-blur-sm"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try a different mood
                    </Button>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        )}

        {/* CTA Section */}
        <div className="mt-12 text-center bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-emerald-200 p-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to start your real journey?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            This was just a preview. Create your account to track your actual wardrobe, log your moods, and discover personalized insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api/auth/signin">
              <Button size="lg" className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all">
                Get Started Free
                <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto border-2">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
