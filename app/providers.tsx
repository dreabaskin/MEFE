"use client"

import { SessionProvider } from "next-auth/react"
import { LanguageProvider } from "@/contexts/language-context"
import { ToastProvider } from "@/components/toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </LanguageProvider>
    </SessionProvider>
  )
}

