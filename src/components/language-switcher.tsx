"use client"

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { languages, Language } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  try {
    const { language, setLanguage } = useLanguage()
    const [open, setOpen] = useState(false)

    const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{currentLanguage.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 max-h-[80vh] overflow-y-auto">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code)
                setOpen(false)
              }}
              className={`flex items-center gap-2 cursor-pointer ${
                language === lang.code ? 'bg-emerald-50 text-emerald-700 font-medium' : ''
              }`}
            >
              <span className="flex-1">{lang.name}</span>
              {language === lang.code && (
                <span className="text-emerald-600">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  } catch (error) {
    // Fallback if context is not available
    return null
  }
}

