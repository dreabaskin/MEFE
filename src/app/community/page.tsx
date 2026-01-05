"use client"

import { useEffect, useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { Navbar } from '@/components/navbar'
import { PageHeader } from '@/components/page-header'
import { useLanguage } from '@/contexts/language-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Heart, Share2, Eye, Filter, X, Sparkles, User, TrendingUp, Users, Search as SearchIcon, Upload, Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { EmptyState } from '@/components/empty-state'

interface CommunityPost {
  id: string
  title: string
  description: string | null
  imageUrl: string
  mood: string | null
  tags: string[]
  category: string | null
  likesCount: number
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
  outfit: {
    id: string
    name: string
  } | null
  isLiked: boolean
}

interface Outfit {
  id: string
  name: string
  imageUrl: string | null
  items: Array<{
    wardrobeItem: {
      imageUrl: string
    }
  }>
}

export default function CommunityPage() {
  const { data: session } = useSession()
  const { t } = useLanguage()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<CommunityPost | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null,
    outfitId: '',
    mood: '',
    category: '',
    tags: '',
  })

  const categories = [
    { value: 'all', label: t('common.allCategories') },
    { value: 'casual', label: t('category.casual') },
    { value: 'formal', label: t('category.formal') },
    { value: 'streetwear', label: t('category.streetwear') },
    { value: 'business', label: t('category.business') },
    { value: 'date', label: t('category.date') },
    { value: 'party', label: t('category.party') },
    { value: 'workout', label: t('category.workout') },
  ]

  const moods = [
    'confident', 'comfortable', 'powerful', 'creative', 'elegant',
    'playful', 'relaxed', 'bold', 'sophisticated', 'energetic'
  ]

  useEffect(() => {
    fetchPosts()
    fetchOutfits()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/community')
      const data = await res.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchOutfits = async () => {
    try {
      const res = await fetch('/api/outfits')
      const data = await res.json()
      setOutfits(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching outfits:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.image) return

    setIsUploading(true)
    setUploadProgress(0)

    const data = new FormData()
    data.append('title', formData.title)
    if (formData.description) {
      data.append('description', formData.description)
    }
    if (formData.image) {
      data.append('image', formData.image)
    }
    if (formData.outfitId) {
      data.append('outfitId', formData.outfitId)
    }
    if (formData.mood) {
      data.append('mood', formData.mood)
    }
    if (formData.category) {
      data.append('category', formData.category)
    }
    if (formData.tags) {
      data.append('tags', formData.tags.split(',').map(t => t.trim()).filter(Boolean).join(','))
    }

    try {
      // Simulate progress for file uploads
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      const res = await fetch('/api/community', {
        method: 'POST',
        body: data,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (res.ok) {
        setOpen(false)
        setFormData({
          title: '',
          description: '',
          image: null,
          outfitId: '',
          mood: '',
          category: '',
          tags: '',
        })
        setImagePreview(null)
        fetchPosts()
      } else {
        const error = await res.json()
        console.error('Error creating post:', error)
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      const res = await fetch(`/api/community/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      })
      if (res.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleEdit = (post: CommunityPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      description: post.description || '',
      image: null,
      outfitId: post.outfit?.id || '',
      mood: post.mood || '',
      category: post.category || '',
      tags: post.tags.join(', '),
    })
    setImagePreview(post.imageUrl)
    setEditOpen(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost || !formData.title) return

    setIsUploading(true)
    setUploadProgress(0)

    const data = new FormData()
    data.append('title', formData.title)
    if (formData.description) {
      data.append('description', formData.description)
    }
    if (formData.image) {
      data.append('image', formData.image)
    }
    if (formData.outfitId) {
      data.append('outfitId', formData.outfitId)
    }
    if (formData.mood) {
      data.append('mood', formData.mood)
    }
    if (formData.category) {
      data.append('category', formData.category)
    }
    if (formData.tags) {
      data.append('tags', formData.tags.split(',').map(t => t.trim()).filter(Boolean).join(','))
    }

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      const res = await fetch(`/api/community/${editingPost.id}`, {
        method: 'PUT',
        body: data,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (res.ok) {
        setEditOpen(false)
        setEditingPost(null)
        setFormData({
          title: '',
          description: '',
          image: null,
          outfitId: '',
          mood: '',
          category: '',
          tags: '',
        })
        setImagePreview(null)
        fetchPosts()
      } else {
        const error = await res.json()
        console.error('Error updating post:', error)
      }
    } catch (error) {
      console.error('Error updating post:', error)
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const res = await fetch(`/api/community/${postId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  // Filter posts
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) {
      return []
    }

    let filtered = [...posts]

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.description?.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query)) ||
        post.user.name?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [posts, selectedCategory, searchQuery])

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <PageHeader
          title="Community Inspiration"
          description="Share your style and discover outfits from the community"
          action={
            <Button 
              onClick={() => {
                setFormData({
                  title: '',
                  description: '',
                  image: null,
                  outfitId: '',
                  mood: '',
                  category: '',
                  tags: '',
                })
                setImagePreview(null)
                setOpen(true)
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Share Outfit
            </Button>
          }
        />

        {/* Search and Filter */}
        <Card className="glass-card border-emerald-200/50 shadow-lg card-hover mb-8">
          <CardContent className="px-6 pt-6 pb-6">
            <div className="space-y-4">
              <div className="grid md:grid-cols-[1fr_auto] gap-4 items-end">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500 z-10 pointer-events-none" />
                  <Input
                    placeholder="Search posts, users, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                      }
                    }}
                    className="pl-10 pr-4 py-6 text-base border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg bg-white shadow-sm transition-all w-full"
                  />
                </div>
                <div className="w-full md:w-56">
                  <Label className="text-sm font-semibold mb-2 block text-slate-700">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-2 border-emerald-200 focus:border-emerald-500 h-14 text-base">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {(searchQuery || selectedCategory !== 'all') && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-emerald-100">
                <span className="text-sm text-slate-600">Active filters:</span>
                {searchQuery && (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm flex items-center gap-1">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm flex items-center gap-1">
                    {categories.find(c => c.value === selectedCategory)?.label}
                    <button onClick={() => setSelectedCategory('all')}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Share Outfit Dialog */}
        <Dialog 
          open={open} 
          onOpenChange={(open) => {
            setOpen(open)
            if (!open) {
              setFormData({
                title: '',
                description: '',
                image: null,
                outfitId: '',
                mood: '',
                category: '',
                tags: '',
              })
              setImagePreview(null)
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="h2">Share Your Outfit</DialogTitle>
              <CardDescription>Inspire others with your style</CardDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Casual Friday Look, Date Night Outfit"
                  className="mt-2 border-emerald-200 focus:border-emerald-400"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-semibold">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about this outfit..."
                  className="mt-2 border-emerald-200 focus:border-emerald-400"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="image" className="text-base font-semibold">Upload Image *</Label>
                <div className="mt-2">
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-emerald-200 border-dashed rounded-lg cursor-pointer bg-emerald-50/50 hover:bg-emerald-50 transition-colors"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setFormData({ ...formData, image: null })
                            setImagePreview(null)
                            const input = document.getElementById('image') as HTMLInputElement
                            if (input) input.value = ''
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-10 w-10 text-emerald-500 mb-3" />
                        <p className="mb-2 text-sm text-slate-600">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required={!imagePreview}
                    />
                  </label>
                </div>
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-emerald-100 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-center">Uploading... {uploadProgress}%</p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="outfit" className="text-base font-semibold">Link to Your Outfit (optional)</Label>
                  <Select
                    value={formData.outfitId || undefined}
                    onValueChange={(value) => setFormData({ ...formData, outfitId: value || '' })}
                  >
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select an outfit (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {outfits.map((outfit) => (
                        <SelectItem key={outfit.id} value={outfit.id}>
                          {outfit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category" className="text-base font-semibold">Category</Label>
                  <Select
                    value={formData.category || undefined}
                    onValueChange={(value) => setFormData({ ...formData, category: value || '' })}
                  >
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mood" className="text-base font-semibold">How did this outfit make you feel?</Label>
                  <Select
                    value={formData.mood || undefined}
                    onValueChange={(value) => setFormData({ ...formData, mood: value || '' })}
                  >
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select mood (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          <span className="capitalize">{mood}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-base font-semibold">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="casual, summer, work"
                    className="mt-2 border-emerald-200 focus:border-emerald-400"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Share2 className="h-5 w-5 mr-2" />
                    Share Outfit
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Post Dialog */}
        <Dialog 
          open={editOpen} 
          onOpenChange={(open) => {
            setEditOpen(open)
            if (!open) {
              setEditingPost(null)
              setFormData({
                title: '',
                description: '',
                image: null,
                outfitId: '',
                mood: '',
                category: '',
                tags: '',
              })
              setImagePreview(null)
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="h2">Edit Your Post</DialogTitle>
              <CardDescription>Update your outfit post</CardDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <Label htmlFor="edit-title" className="text-base font-semibold">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Casual Friday Look, Date Night Outfit"
                  className="mt-2 border-emerald-200 focus:border-emerald-400"
                />
              </div>

              <div>
                <Label htmlFor="edit-description" className="text-base font-semibold">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about this outfit..."
                  className="mt-2 border-emerald-200 focus:border-emerald-400"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-image" className="text-base font-semibold">Upload New Image (optional)</Label>
                <div className="mt-2">
                  <label
                    htmlFor="edit-image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-emerald-200 border-dashed rounded-lg cursor-pointer bg-emerald-50/50 hover:bg-emerald-50 transition-colors"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setFormData({ ...formData, image: null })
                            setImagePreview(editingPost?.imageUrl || null)
                            const input = document.getElementById('edit-image') as HTMLInputElement
                            if (input) input.value = ''
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-10 w-10 text-emerald-500 mb-3" />
                        <p className="mb-2 text-sm text-slate-600">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      id="edit-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-emerald-100 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 text-center">Uploading... {uploadProgress}%</p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-outfit" className="text-base font-semibold">Link to Your Outfit (optional)</Label>
                  <Select
                    value={formData.outfitId || undefined}
                    onValueChange={(value) => setFormData({ ...formData, outfitId: value || '' })}
                  >
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select an outfit (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {outfits.map((outfit) => (
                        <SelectItem key={outfit.id} value={outfit.id}>
                          {outfit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-category" className="text-base font-semibold">Category</Label>
                  <Select
                    value={formData.category || undefined}
                    onValueChange={(value) => setFormData({ ...formData, category: value || '' })}
                  >
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-mood" className="text-base font-semibold">How did this outfit make you feel?</Label>
                  <Select
                    value={formData.mood || undefined}
                    onValueChange={(value) => setFormData({ ...formData, mood: value || '' })}
                  >
                    <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                      <SelectValue placeholder="Select mood (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          <span className="capitalize">{mood}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-tags" className="text-base font-semibold">Tags (comma-separated)</Label>
                  <Input
                    id="edit-tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="casual, summer, work"
                    className="mt-2 border-emerald-200 focus:border-emerald-400"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit2 className="h-5 w-5 mr-2" />
                    Update Post
                  </>
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <EmptyState
            icon={<Users className="h-8 w-8" />}
            illustration="community"
            title={posts.length === 0 ? 'No posts yet' : 'No posts match your filters'}
            description={posts.length === 0
              ? 'Be the first to share your style with the community!'
              : 'Try adjusting your search or filters'
            }
            action={posts.length === 0 ? {
              label: 'Share Your First Outfit',
              onClick: () => {
                setFormData({
                  title: '',
                  description: '',
                  image: null,
                  outfitId: '',
                  mood: '',
                  category: '',
                  tags: '',
                })
                setImagePreview(null)
                setOpen(true)
              },
              icon: <Plus className="h-5 w-5" />
            } : undefined}
            tips={posts.length === 0 ? [
              "Share your favorite outfit combinations",
              "Add mood tags to inspire others",
              "Get feedback from the community",
              "Discover new style ideas"
            ] : [
              "Try adjusting your search query",
              "Remove some filters",
              "Browse all categories"
            ]}
          />
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl space-y-6">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group bg-white/95 backdrop-blur-md border-emerald-200/50 hover:border-emerald-400 hover:shadow-xl transition-all shadow-lg overflow-hidden"
                >
                  {/* User Header */}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {post.user.image ? (
                          <Image
                            src={post.user.image}
                            alt={post.user.name || 'User'}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-emerald-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-emerald-900">
                            {post.user.name || 'Anonymous'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {format(parseISO(post.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      {session?.user?.id === post.user.id && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(post)}
                            className="h-8 w-8 p-0 text-slate-600 hover:text-emerald-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                            className="h-8 w-8 p-0 text-slate-600 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  {/* Image */}
                  <div className="relative w-full aspect-square">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {/* Actions */}
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id, post.isLiked)}
                          className={`p-0 h-auto ${post.isLiked ? 'text-red-500' : 'text-slate-600'} hover:text-red-500`}
                        >
                          <Heart className={`h-6 w-6 ${post.isLiked ? 'fill-current' : ''}`} />
                        </Button>
                        <span className="text-sm font-semibold text-slate-700">
                          {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}
                        </span>
                      </div>

                      {/* Title and Description */}
                      <div>
                        <CardTitle className="text-lg mb-1">{post.title}</CardTitle>
                        {post.description && (
                          <CardDescription className="text-sm text-slate-600 mt-1">
                            {post.description}
                          </CardDescription>
                        )}
                      </div>

                      {/* Mood, Category, Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        {post.mood && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                            <Sparkles className="h-3 w-3" />
                            <span className="text-xs font-medium capitalize">{post.mood}</span>
                          </div>
                        )}
                        {post.category && (
                          <span className="px-2 py-1 text-xs bg-teal-50 text-teal-700 rounded-full font-medium">
                            {post.category}
                          </span>
                        )}
                        {post.tags.length > 0 && (
                          <>
                            {post.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </>
                        )}
                      </div>

                      {/* Outfit Link */}
                      {post.outfit && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 pt-2 border-t border-emerald-100">
                          <Eye className="h-3 w-3" />
                          <span>From outfit: {post.outfit.name}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

