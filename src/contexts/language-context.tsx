"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, getTranslation } from '@/lib/translations'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Load language from localStorage on mount (client-side only)
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('mefe-language') as Language
      if (savedLanguage) {
        setLanguageState(savedLanguage)
      }
      setMounted(true)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('mefe-language', lang)
      // Update document direction for RTL languages
      if (lang === 'ar') {
        document.documentElement.dir = 'rtl'
      } else {
        document.documentElement.dir = 'ltr'
      }
    }
  }

  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      // Set document direction based on language
      if (language === 'ar') {
        document.documentElement.dir = 'rtl'
      } else {
        document.documentElement.dir = 'ltr'
      }
    }
  }, [language, mounted])

  const t = (key: string) => getTranslation(key, language)

  // Always provide the context value, even during SSR
  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}






