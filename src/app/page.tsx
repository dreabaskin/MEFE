import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Calendar, Shirt, Sparkles, TrendingUp, Palette, ArrowRight, Check, Users, BarChart3, Zap, Star, HelpCircle } from 'lucide-react'
import { Footer } from '@/components/footer'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SmoothScrollButton } from '@/components/smooth-scroll-button'
export const dynamic = "force-dynamic"

export default async function Home() {
  let session = null

  try {
    session = await getServerSession(authOptions)
  } catch (error) {
    console.error("Session error:", error)
  }

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
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
                BETA
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link href="/api/auth/signin">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transition-all">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                <span>BETA</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                <Sparkles className="h-4 w-4" />
                <span>Emotional Wellness Through Style</span>
              </div>
            </div>
            <h1 className="h1 text-slate-900 mb-6">
              Your clothes tell a story.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                MEFE helps you write it with confidence.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Track your moods, outfits, and identity — and dress with emotional clarity.
            </p>
            
            {/* CTA Block */}
            <div className="bg-white rounded-2xl border-2 border-emerald-300 shadow-2xl p-10 md:p-12 max-w-4xl mx-auto mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 text-center mb-4 leading-tight">
                Start your emotional style journey
              </h2>
              <p className="text-xl md:text-2xl text-slate-700 text-center mb-10 font-medium">
                It's free. No credit card. Just clarity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
                <Link href="/demo" className="flex-1 sm:flex-initial">
                  <Button size="lg" className="text-lg px-8 py-7 h-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all w-full sm:w-auto font-semibold">
                    Try a demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <SmoothScrollButton 
                  href="#how-it-works" 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-7 h-auto border-2 border-slate-400 hover:border-emerald-600 hover:bg-emerald-50 transition-all w-full sm:w-auto font-semibold"
                >
                  Explore how MEFE works
                </SmoothScrollButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-purple-100/60 via-teal-100/60 to-purple-100/60 border-y border-slate-200/50 py-12 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">10K+</div>
              <div className="text-sm text-slate-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">50K+</div>
              <div className="text-sm text-slate-600">Outfits Created</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">100K+</div>
              <div className="text-sm text-slate-600">Mood Logs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">95%</div>
              <div className="text-sm text-slate-600">Feel More Confident</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="container mx-auto px-4 py-20 lg:py-28">
        <div className="text-center mb-16">
          <h2 className="h2 text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get started in minutes and transform your relationship with style
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold mb-6 shadow-lg">
              1
            </div>
            <h3 className="h3 text-slate-900 mb-3">Upload Your Wardrobe</h3>
            <p className="text-slate-600 leading-relaxed">
              Add photos of your clothing items. Organize by category, color, and style. Build your digital closet.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white text-2xl font-bold mb-6 shadow-lg">
              2
            </div>
            <h3 className="h3 text-slate-900 mb-3">Track Your Moods</h3>
            <p className="text-slate-600 leading-relaxed">
              Log how you feel in different outfits. Track your energy, confidence, and emotional state with each look.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-white text-2xl font-bold mb-6 shadow-lg">
              3
            </div>
            <h3 className="h3 text-slate-900 mb-3">Discover Insights</h3>
            <p className="text-slate-600 leading-relaxed">
              Get personalized insights about your style-mood connections. Learn what makes you feel your best.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20 lg:py-28">
        <div className="text-center mb-16">
          <h2 className="h2 text-slate-900 mb-4">
            Everything you need to dress with intention
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Powerful tools to understand and enhance your relationship with style
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:border-purple-300 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shirt className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl mb-2">Digital Closet</CardTitle>
              <CardDescription className="text-base">
                Upload and organize your entire wardrobe with beautiful, searchable collections
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:border-teal-300 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl mb-2">Outfit Builder</CardTitle>
              <CardDescription className="text-base">
                Create and save unlimited outfit combinations from your wardrobe
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl mb-2">Calendar Planning</CardTitle>
              <CardDescription className="text-base">
                Plan your outfits for upcoming events and never wonder what to wear
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:border-red-300 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl mb-2">Mood Logging</CardTitle>
              <CardDescription className="text-base">
                Track how different looks make you feel and build emotional awareness
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:border-emerald-300 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl mb-2">Emotional Insights</CardTitle>
              <CardDescription className="text-base">
                Discover patterns and insights about your unique style-mood connections
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:border-amber-300 hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl mb-2">AI Suggestions</CardTitle>
              <CardDescription className="text-base">
                Get personalized outfit recommendations based on how you want to feel
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 py-16 lg:py-20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="h2 text-slate-900 mb-3 text-3xl md:text-4xl font-bold">
                Why MEFE Isn't Just a Closet App — It's Your Emotional Style Companion
              </h2>
              <p className="text-base text-slate-600 max-w-2xl mx-auto">
                Each benefit becomes a mini emotional hook with a clear outcome. Transform how you think about style and wellbeing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Benefit 1: Save Time & Energy */}
              <Card className="group relative overflow-hidden border-2 border-yellow-200/50 bg-gradient-to-br from-yellow-50/80 to-amber-50/80 hover:border-yellow-300 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200/20 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-yellow-300/30 transition-colors" />
                <CardHeader className="relative z-10 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Zap className="h-6 w-6 text-white animate-pulse" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">
                        From decision fatigue to daily clarity
                      </div>
                      <CardTitle className="text-xl text-slate-900 mb-2">Save Time & Energy</CardTitle>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    "No more standing in front of your closet wondering what feels right. MEFE helps you plan with intention — so you start each day focused, not frazzled."
                  </p>
                </CardHeader>
              </Card>

              {/* Benefit 2: Build Confidence */}
              <Card className="group relative overflow-hidden border-2 border-purple-200/50 bg-gradient-to-br from-purple-50/80 to-pink-50/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-purple-300/30 transition-colors" />
                <CardHeader className="relative z-10 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">
                        From self-doubt to self-expression
                      </div>
                      <CardTitle className="text-xl text-slate-900 mb-2">Build Confidence</CardTitle>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    "Discover the pieces that make you feel powerful. MEFE tracks your emotional patterns and helps you dress like the best version of yourself — every time."
                  </p>
                </CardHeader>
              </Card>

              {/* Benefit 3: Emotional Awareness */}
              <Card className="group relative overflow-hidden border-2 border-blue-200/50 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-blue-300/30 transition-colors" />
                <CardHeader className="relative z-10 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Heart className="h-6 w-6 text-white animate-pulse" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                        From autopilot to emotional alignment
                      </div>
                      <CardTitle className="text-xl text-slate-900 mb-2">Emotional Awareness</CardTitle>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    "Your clothes affect your mood more than you think. MEFE helps you connect the dots — so your wardrobe becomes a tool for wellbeing, not just style."
                  </p>
                </CardHeader>
              </Card>

              {/* Benefit 4: Personalized Insights */}
              <Card className="group relative overflow-hidden border-2 border-emerald-200/50 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-emerald-300/30 transition-colors" />
                <CardHeader className="relative z-10 p-6">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Sparkles className="h-6 w-6 text-white animate-pulse" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                        From generic advice to your emotional blueprint
                      </div>
                      <CardTitle className="text-xl text-slate-900 mb-2">Personalized Insights</CardTitle>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    "MEFE learns what confidence looks like for you. With AI-powered insights, you'll get outfit suggestions that match your goals, your vibe, and your emotional needs."
                  </p>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-20 lg:py-28">
        <div className="text-center mb-16">
          <h2 className="h2 text-slate-900 mb-4">
            Loved by thousands
          </h2>
          <p className="text-lg text-slate-600">
            See what our community is saying
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                "MEFE has completely changed how I think about my wardrobe. I finally understand what makes me feel confident and powerful."
              </p>
              <div className="font-semibold text-slate-900">Sarah M.</div>
              <div className="text-sm text-slate-500">Fashion Enthusiast</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                "The mood tracking feature is incredible. I've discovered patterns I never noticed before. This app is a game-changer!"
              </p>
              <div className="font-semibold text-slate-900">Jessica L.</div>
              <div className="text-sm text-slate-500">Wellness Coach</div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-slate-600 mb-4 italic">
                "Planning outfits has never been easier. The calendar feature helps me feel prepared and confident every day."
              </p>
              <div className="font-semibold text-slate-900">Emily R.</div>
              <div className="text-sm text-slate-500">Professional</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-50 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="h2 text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-slate-600">
                Everything you need to know about MEFE
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-emerald-600" />
                    Is MEFE free to use?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Yes! MEFE offers a free tier with all core features including wardrobe management, outfit building, mood logging, and basic insights. Premium features are available for advanced analytics and AI suggestions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-emerald-600" />
                    How does mood tracking work?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Simply log how you feel when wearing specific outfits. Rate your energy and confidence levels, and add notes. Over time, MEFE analyzes patterns to show you which colors, styles, and combinations make you feel your best.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-emerald-600" />
                    Can I use MEFE on my phone?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    MEFE is a responsive web app that works beautifully on all devices - desktop, tablet, and mobile. Simply visit our website from any browser on your phone.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-emerald-600" />
                    Is my data private and secure?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Absolutely. Your wardrobe and mood data are private and secure. We use industry-standard encryption and never share your personal information. Your style journey is yours alone.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-md transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-emerald-600" />
                    How accurate are the AI suggestions?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">
                    Our AI learns from your mood logs and preferences to provide personalized recommendations. The more you use MEFE, the better the suggestions become. It's like having a personal stylist who knows exactly what makes you feel great.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-20 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="h2 mb-4">
            Ready to transform your relationship with style?
          </h2>
          <p className="text-xl text-emerald-50 mb-8 max-w-2xl mx-auto">
            Join thousands of people who are dressing with intention and feeling more confident every day
          </p>
          <Link href="/api/auth/signin">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
