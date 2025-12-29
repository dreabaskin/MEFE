"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showEmailForm, setShowEmailForm] = useState(false)

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-400 via-emerald-500 to-teal-600 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-lime-300/50 to-transparent"></div>
              <div className="w-8 h-8 bg-white rounded-md relative z-10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-black/20 rounded-t-md"></div>
              </div>
              <div className="absolute -bottom-2 -left-2 w-8 h-12 bg-yellow-200/30 blur-sm"></div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-900">Sign in</h1>

        {/* Social Sign-in Buttons */}
        {!showEmailForm && (
          <div className="space-y-3 mb-6">
            {/* Google */}
            <Button
              variant="outline"
              className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-medium"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>

            {/* Facebook */}
            <Button
              variant="outline"
              className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-medium"
              onClick={() => {
                // Facebook sign-in would go here
                alert("Facebook sign-in coming soon")
              }}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Sign in with Facebook
            </Button>

            {/* Apple */}
            <Button
              variant="outline"
              className="w-full h-12 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-medium"
              onClick={() => {
                // Apple sign-in would go here
                alert("Apple sign-in coming soon")
              }}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24" fill="#000000">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C1.79 15.25 4.96 7.59 9.38 7.3c1.35.13 2.3.72 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continue with Apple
            </Button>

            {/* Email */}
            <Button
              className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white font-medium"
              onClick={() => setShowEmailForm(true)}
            >
              Sign in with email
            </Button>
          </div>
        )}

        {/* Email/Password Form */}
        {showEmailForm && (
          <form onSubmit={handleCredentialsSignIn} className="space-y-4 mb-6">
            <div>
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowEmailForm(false)}
              >
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-slate-800 hover:bg-slate-900">
                Sign In
              </Button>
            </div>
          </form>
        )}

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          <span className="text-slate-500">New user? </span>
          <Link 
            href="/auth/signup" 
            className="text-blue-600 hover:text-blue-700 underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

