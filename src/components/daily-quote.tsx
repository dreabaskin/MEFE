"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles, X } from 'lucide-react'
import { getRandomQuote } from '@/lib/quotes'

export function DailyQuote() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [quote, setQuote] = useState<{ text: string; hashtags?: string[] } | null>(null)

  useEffect(() => {
    if (session?.user) {
      // Show a quote every time the user logs in
      // Use sessionStorage to track if we've shown a quote in this browser session
      // This ensures a quote shows on each login, but not on page refreshes
      const hasShownQuoteThisSession = sessionStorage.getItem('mefe_quote_shown_this_session')
      
      if (!hasShownQuoteThisSession) {
        const randomQuote = getRandomQuote()
        setQuote(randomQuote)
        setOpen(true)
        sessionStorage.setItem('mefe_quote_shown_this_session', 'true')
      }
    } else {
      // Clear session flag when user signs out so next login will show a quote
      sessionStorage.removeItem('mefe_quote_shown_this_session')
    }
  }, [session])

  if (!quote) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            Daily Inspiration
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="relative">
            <div className="absolute -left-4 top-0 text-4xl text-emerald-200 leading-none">"</div>
            <p className="text-lg text-slate-700 italic pl-6 pr-4 leading-relaxed">
              {quote.text}
            </p>
            <div className="absolute -right-2 bottom-0 text-4xl text-emerald-200 leading-none">"</div>
          </div>
          
          {quote.hashtags && quote.hashtags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-emerald-100">
              <div className="flex flex-wrap gap-2">
                {quote.hashtags.map((hashtag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-full text-sm font-medium border border-emerald-200"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-emerald-100">
          <Button
            onClick={() => setOpen(false)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
          >
            Start My Day
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

