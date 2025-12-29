"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function FeedbackButton() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const pathname = usePathname()
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    message: '',
    rating: '',
    priority: '',
    featureArea: '',
    frequencyOfUse: '',
    easeOfUse: '',
    designRating: '',
    functionalityRating: '',
    painPoints: '',
    whatTheyLove: '',
    stepsToReproduce: '',
  })

  // Get browser and device info
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const browserInfo = `${navigator.userAgent.split(' ')[0]} ${navigator.userAgent.match(/(?:Chrome|Firefox|Safari|Edge)\/(\d+)/)?.[1] || ''}`
      const deviceInfo = `${navigator.platform} - ${window.innerWidth}x${window.innerHeight}`
      setFormData(prev => ({ ...prev, browserInfo, deviceInfo }))
    }
  }, [])

  const feedbackTypes = [
    { value: 'bug', label: '🐛 Bug Report' },
    { value: 'feature', label: '💡 Feature Request' },
    { value: 'improvement', label: '✨ Improvement Suggestion' },
    { value: 'ui', label: '🎨 UI/UX Feedback' },
    { value: 'performance', label: '⚡ Performance Issue' },
    { value: 'general', label: '💬 General Feedback' },
  ]

  const priorities = [
    { value: 'low', label: 'Low - Nice to have' },
    { value: 'medium', label: 'Medium - Would be helpful' },
    { value: 'high', label: 'High - Important to me' },
    { value: 'critical', label: 'Critical - Blocking my use' },
  ]

  const featureAreas = [
    { value: 'wardrobe', label: '👕 Wardrobe Management' },
    { value: 'outfits', label: '👔 Outfit Planning' },
    { value: 'calendar', label: '📅 Calendar & Events' },
    { value: 'mood', label: '😊 Mood Tracking' },
    { value: 'insights', label: '📊 Insights & Analytics' },
    { value: 'community', label: '👥 Community Feed' },
    { value: 'search', label: '🔍 Search & Discovery' },
    { value: 'dashboard', label: '🏠 Dashboard' },
    { value: 'navigation', label: '🧭 Navigation' },
    { value: 'other', label: 'Other' },
  ]

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'rarely', label: 'Rarely' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.type || !formData.title || !formData.message) return

    setLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          page: pathname,
          rating: formData.rating ? parseInt(formData.rating) : null,
          easeOfUse: formData.easeOfUse ? parseInt(formData.easeOfUse) : null,
          designRating: formData.designRating ? parseInt(formData.designRating) : null,
          functionalityRating: formData.functionalityRating ? parseInt(formData.functionalityRating) : null,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
        setFormData({
          type: '',
          title: '',
          message: '',
          rating: '',
          priority: '',
          featureArea: '',
          frequencyOfUse: '',
          easeOfUse: '',
          designRating: '',
          functionalityRating: '',
          painPoints: '',
          whatTheyLove: '',
          stepsToReproduce: '',
        })
        setTimeout(() => {
          setOpen(false)
          setSubmitted(false)
          setShowAdvanced(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  // Only show feedback button for authenticated users
  if (!session) return null

  return (
    <>
      {/* Floating Feedback Button */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all z-[9999] pointer-events-auto"
        size="icon"
        aria-label="Share feedback"
        style={{ 
          position: 'fixed',
          zIndex: 9999,
          pointerEvents: 'auto'
        }}
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>

      {/* Feedback Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Share Your Feedback</DialogTitle>
            <p className="text-sm text-slate-600 mt-1">
              Help us improve MEFE! Your detailed feedback helps us build a better experience.
            </p>
          </DialogHeader>

          {submitted ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">Thank You!</h3>
              <p className="text-slate-600">Your feedback has been submitted successfully. We appreciate your input!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type" className="text-base font-semibold">Feedback Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    required
                  >
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select feedback type" />
                    </SelectTrigger>
                    <SelectContent>
                      {feedbackTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="featureArea" className="text-base font-semibold">Feature Area</Label>
                  <Select
                    value={formData.featureArea}
                    onValueChange={(value) => setFormData({ ...formData, featureArea: value })}
                  >
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Which part of the app?" />
                    </SelectTrigger>
                    <SelectContent>
                      {featureAreas.map((area) => (
                        <SelectItem key={area.value} value={area.value}>
                          {area.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Brief summary of your feedback"
                    className="mt-2 border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-base font-semibold">Detailed Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder="Tell us in detail what's working, what's not, or what you'd like to see..."
                    className="mt-2 border-emerald-200 focus:border-emerald-400"
                    rows={4}
                  />
                </div>

                {formData.type === 'bug' && (
                  <div>
                    <Label htmlFor="stepsToReproduce" className="text-base font-semibold">Steps to Reproduce (for bugs)</Label>
                    <Textarea
                      id="stepsToReproduce"
                      value={formData.stepsToReproduce}
                      onChange={(e) => setFormData({ ...formData, stepsToReproduce: e.target.value })}
                      placeholder="1. Go to... 2. Click on... 3. See error..."
                      className="mt-2 border-emerald-200 focus:border-emerald-400"
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Ratings Section */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Rate Your Experience</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rating" className="text-sm font-semibold">Overall Rating</Label>
                    <Select
                      value={formData.rating}
                      onValueChange={(value) => setFormData({ ...formData, rating: value })}
                    >
                      <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                        <SelectValue placeholder="Overall experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                        <SelectItem value="2">⭐⭐ Fair</SelectItem>
                        <SelectItem value="1">⭐ Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="easeOfUse" className="text-sm font-semibold">Ease of Use</Label>
                    <Select
                      value={formData.easeOfUse}
                      onValueChange={(value) => setFormData({ ...formData, easeOfUse: value })}
                    >
                      <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                        <SelectValue placeholder="How easy to use?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Very Easy</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Easy</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Moderate</SelectItem>
                        <SelectItem value="2">⭐⭐ Difficult</SelectItem>
                        <SelectItem value="1">⭐ Very Difficult</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="designRating" className="text-sm font-semibold">Design & Aesthetics</Label>
                    <Select
                      value={formData.designRating}
                      onValueChange={(value) => setFormData({ ...formData, designRating: value })}
                    >
                      <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                        <SelectValue placeholder="How do you like the design?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                        <SelectItem value="2">⭐⭐ Fair</SelectItem>
                        <SelectItem value="1">⭐ Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="functionalityRating" className="text-sm font-semibold">Functionality</Label>
                    <Select
                      value={formData.functionalityRating}
                      onValueChange={(value) => setFormData({ ...formData, functionalityRating: value })}
                    >
                      <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                        <SelectValue placeholder="How well does it work?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                        <SelectItem value="2">⭐⭐ Fair</SelectItem>
                        <SelectItem value="1">⭐ Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <div className="border-t pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-slate-600 hover:text-slate-900"
                >
                  <span className="font-semibold">Additional Details</span>
                  {showAdvanced ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {showAdvanced && (
                  <div className="mt-4 space-y-4 pt-4 border-t">
                    <div>
                      <Label htmlFor="priority" className="text-sm font-semibold">Priority Level</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      >
                        <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                          <SelectValue placeholder="How important is this?" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="frequencyOfUse" className="text-sm font-semibold">How often do you use MEFE?</Label>
                      <Select
                        value={formData.frequencyOfUse}
                        onValueChange={(value) => setFormData({ ...formData, frequencyOfUse: value })}
                      >
                        <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="whatTheyLove" className="text-sm font-semibold">What do you love about MEFE?</Label>
                      <Textarea
                        id="whatTheyLove"
                        value={formData.whatTheyLove}
                        onChange={(e) => setFormData({ ...formData, whatTheyLove: e.target.value })}
                        placeholder="Tell us what features or aspects you really enjoy..."
                        className="mt-2 border-emerald-200 focus:border-emerald-400"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="painPoints" className="text-sm font-semibold">What's frustrating or could be better?</Label>
                      <Textarea
                        id="painPoints"
                        value={formData.painPoints}
                        onChange={(e) => setFormData({ ...formData, painPoints: e.target.value })}
                        placeholder="Share any frustrations, pain points, or areas for improvement..."
                        className="mt-2 border-emerald-200 focus:border-emerald-400"
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {loading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
