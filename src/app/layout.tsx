import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { FeedbackButton } from "@/components/feedback-button"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "MEFE - Your Digital Closet & Emotional Wellness Styling",
  description: "Understand how clothing affects your mood, confidence, and identity. Dress with intention.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Providers>
          {children}
          <FeedbackButton />
        </Providers>
      </body>
    </html>
  )
}

