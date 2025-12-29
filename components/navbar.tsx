"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Shirt, Calendar, Heart, TrendingUp, Sparkles, Home, Menu, X, Search, Users, MoreHorizontal, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { LanguageSwitcher } from '@/components/language-switcher'

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    window.location.href = '/'
  }

  if (!session) return null

  // Primary nav items (icon + label)
  const primaryLinks = [
    { href: '/dashboard', label: t('nav.dashboard'), icon: Home },
    { href: '/wardrobe', label: t('nav.wardrobe'), icon: Shirt },
    { href: '/outfits', label: t('nav.outfits'), icon: Sparkles },
  ]

  // Secondary nav items (icon only with tooltips)
  const secondaryLinks = [
    { href: '/calendar', label: t('nav.calendar'), icon: Calendar },
    { href: '/mood', label: t('nav.mood'), icon: Heart },
  ]

  // More menu items
  const moreLinks = [
    { href: '/insights', label: t('nav.insights'), icon: TrendingUp },
    { href: '/search', label: t('nav.discover'), icon: Search },
    { href: '/community', label: t('nav.community'), icon: Users },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-sm supports-[backdrop-filter]:bg-white/70 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              MEFE
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200">
              BETA
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Primary Links (Icon + Label) */}
            {primaryLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive(link.href)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}

            {/* Secondary Links (Icon Only with Tooltips) */}
            {secondaryLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-lg transition-colors
                    ${isActive(link.href)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              )
            })}

            {/* More Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`
                    flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg
                    ${moreLinks.some(link => isActive(link.href))
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50'
                    }
                  `}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="hidden lg:inline">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>More</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {moreLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-2 w-full ${
                          isActive(link.href) ? 'text-emerald-600' : ''
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline truncate max-w-[100px]">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="font-semibold">{session.user?.name || 'User'}</span>
                    <span className="text-xs text-slate-500 font-normal">
                      {session.user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 w-full">
                    <Home className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <LanguageSwitcher />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('nav.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 space-y-1">
            {/* Primary Links */}
            {primaryLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive(link.href)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}
            
            {/* Secondary Links */}
            {secondaryLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive(link.href)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}

            {/* More Links */}
            {moreLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive(link.href)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-700 hover:text-emerald-600 hover:bg-emerald-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              )
            })}

            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-slate-700 hover:text-red-600"
              onClick={() => {
                handleSignOut()
                setMobileMenuOpen(false)
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('nav.signOut')}
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
