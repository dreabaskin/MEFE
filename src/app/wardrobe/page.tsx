"use client"

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash2, Plus, Upload, Search, Grid3x3, List, Eye, Edit2, X, Tag, Palette, Shirt, Sparkles, Check, LayoutGrid } from 'lucide-react'
import { MasonryGrid } from '@/components/masonry-grid'
import { WardrobeItemCard } from '@/components/wardrobe-item-card'
import { SkeletonCard } from '@/components/skeleton-card'
import { EmptyState } from '@/components/empty-state'
import { useToast } from '@/components/toast'
import { ProgressIndicator } from '@/components/progress-indicator'
import Image from 'next/image'

interface WardrobeItem {
  id: string
  name: string
  description: string | null
  category: string
  color: string | null
  brand: string | null
  imageUrl: string
  tags: string[]
  createdAt: string
}

export default function WardrobePage() {
  const { t } = useLanguage()
  
  const categories = [
    { value: 'top', label: t('category.top'), icon: '👕', color: 'emerald' },
    { value: 'bottom', label: t('category.bottom'), icon: '👖', color: 'teal' },
    { value: 'dress', label: t('category.dress'), icon: '👗', color: 'pink' },
    { value: 'outerwear', label: t('category.outerwear'), icon: '🧥', color: 'blue' },
    { value: 'shoes', label: t('category.shoes'), icon: '👠', color: 'purple' },
    { value: 'accessories', label: t('category.accessories'), icon: '👜', color: 'amber' },
  ]
  
  const colors = [
    t('color.black'), t('color.white'), t('color.gray'), t('color.navy'), t('color.brown'), t('color.beige'), t('color.red'), t('color.pink'),
    t('color.orange'), t('color.yellow'), t('color.green'), t('color.blue'), t('color.purple'), t('color.teal'), t('color.coral'), t('color.other')
  ]
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<WardrobeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const itemsPerPage = 20
  const [open, setOpen] = useState(false)
  const [viewItem, setViewItem] = useState<WardrobeItem | null>(null)
  const [editItem, setEditItem] = useState<WardrobeItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'masonry'>('grid')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [debouncedCategory, setDebouncedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedColor, setSelectedColor] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { addToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    color: '',
    brand: '',
    tags: '',
    image: null as File | null,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin')
      return
    }
    if (status === 'authenticated') {
      fetchItems()
    }
  }, [status, router])

  // Debounce category changes for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCategory(activeCategory)
      setPage(1) // Reset to first page when category changes
    }, 100)
    return () => clearTimeout(timer)
  }, [activeCategory])

  const fetchItems = async (reset = false) => {
    try {
      if (reset) {
        setPage(1)
        setLoading(true)
      }
      const res = await fetch('/api/wardrobe')
      const data = await res.json()
      const allItems = Array.isArray(data) ? data : []
      setItems(allItems)
      setHasMore(allItems.length > itemsPerPage)
    } catch (error) {
      console.error('Error fetching wardrobe:', error)
      setItems([])
    } finally {
      setLoading(false)
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
    
    if (!formData.name || !formData.category) {
      addToast('Please fill in all required fields', 'warning')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    const data = new FormData()
    data.append('name', formData.name)
    data.append('category', formData.category)
    if (formData.description) {
      data.append('description', formData.description)
    }
    if (formData.color) {
      data.append('color', formData.color)
    }
    if (formData.brand) {
      data.append('brand', formData.brand)
    }
    if (formData.tags) {
      data.append('tags', formData.tags)
    }
    if (formData.image) {
      data.append('image', formData.image)
    }

    try {
      const url = editItem ? `/api/wardrobe/${editItem.id}` : '/api/wardrobe'
      const method = editItem ? 'PUT' : 'POST'
      
      // Simulate progress for file uploads
      if (formData.image) {
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval)
              return 90
            }
            return prev + 10
          })
        }, 200)
      } else {
        setUploadProgress(50)
      }
      
      const res = await fetch(url, {
        method,
        body: data,
      })
      
      setUploadProgress(100)
      
      const result = await res.json()
      
      if (res.ok) {
        addToast(
          editItem ? 'Item updated successfully!' : 'Item added successfully!',
          'success'
        )
        setOpen(false)
        setEditItem(null)
        setImagePreview(null)
        setFormData({
          name: '',
          description: '',
          category: '',
          color: '',
          brand: '',
          tags: '',
          image: null,
        })
        fetchItems()
      } else {
        addToast(result.error || 'Failed to save item', 'error')
      }
    } catch (error) {
      console.error('Error saving item:', error)
      addToast('An error occurred while saving', 'error')
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 500)
    }
  }

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await fetch(`/api/wardrobe/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }, [])

  const handleView = useCallback((item: WardrobeItem) => {
    setViewItem(item)
  }, [])

  const handleEdit = useCallback((item: WardrobeItem) => {
    setEditItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      category: item.category,
      color: item.color || '',
      brand: item.brand || '',
      tags: item.tags.join(', '),
      image: null,
    })
    setImagePreview(item.imageUrl)
    setOpen(true)
  }, [])

  // Get all unique tags
  const allTags = useMemo(() => {
    if (!Array.isArray(items)) return []
    const tagSet = new Set<string>()
    items.forEach(item => {
      if (item.tags && Array.isArray(item.tags)) {
        item.tags.forEach(tag => tagSet.add(tag.trim()))
      }
    })
    return Array.from(tagSet).sort()
  }, [items])

  // Memoize category lookup map
  const categoryMap = useMemo(() => {
    const map = new Map<string, { icon: string; label: string }>()
    categories.forEach(cat => {
      map.set(cat.value, { icon: cat.icon, label: cat.label })
    })
    return map
  }, [categories])

  // Filter and sort items
  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return []
    let filtered = [...items]

    // Category filter (using debounced category)
    if (debouncedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === debouncedCategory)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.brand?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Color filter
    if (selectedColor !== 'all') {
      filtered = filtered.filter(item => 
        item.color?.toLowerCase() === selectedColor.toLowerCase()
      )
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item =>
        selectedTags.some(tag => item.tags.includes(tag))
      )
    }

    // Sort by newest first
    filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return filtered
  }, [items, debouncedCategory, searchQuery, selectedColor, selectedTags])

  // Paginated items
  const paginatedItems = useMemo(() => {
    return filteredItems.slice(0, page * itemsPerPage)
  }, [filteredItems, page])

  const loadMore = useCallback(() => {
    if (paginatedItems.length < filteredItems.length) {
      setPage(prev => prev + 1)
    }
  }, [paginatedItems.length, filteredItems.length])

  // Statistics
  const stats = useMemo(() => {
    if (!Array.isArray(items)) {
      return {
        total: 0,
        categoryCounts: {},
        topColors: [],
      }
    }
    const categoryCounts: Record<string, number> = {}
    const colorCounts: Record<string, number> = {}
    
    items.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
      if (item.color) {
        colorCounts[item.color] = (colorCounts[item.color] || 0) + 1
      }
    })

    const topColors = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    return {
      total: items.length,
      categoryCounts,
      topColors,
    }
  }, [items])

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <PageHeader
            title={t('wardrobe.title')}
            description={t('wardrobe.description')}
          />
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' : 'space-y-3'}>
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} viewMode={viewMode} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <PageHeader
          title={t('wardrobe.title')}
          description={t('wardrobe.description')}
          action={
            <Button
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('wardrobe.addItem')}
            </Button>
          }
        />

        {/* Add/Edit Item Dialog */}
        <Dialog 
          open={open} 
          onOpenChange={(open) => {
            setOpen(open)
            if (!open) {
              setEditItem(null)
              setImagePreview(null)
              setFormData({
                name: '',
                description: '',
                category: '',
                color: '',
                brand: '',
                tags: '',
                image: null,
              })
            }
          }}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="h2">
                  {editItem ? t('common.edit') + ' ' + t('common.item') : t('wardrobe.addItem')}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload with Preview */}
                <div>
                  <Label htmlFor="image" className="text-base font-semibold">
                    Image {!editItem && '*'}
                  </Label>
                  <div className="mt-2 space-y-4">
                    {imagePreview && (
                      <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-emerald-200 shadow-lg">
                        {imagePreview.startsWith('data:') ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required={!editItem}
                        className="border-emerald-200 focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold">{t('common.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="e.g., Blue Denim Jacket"
                      className="mt-2 border-emerald-200 focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-base font-semibold">{t('common.category')} *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <span className="flex items-center gap-2">
                              <span>{cat.icon}</span>
                              <span>{cat.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color" className="text-base font-semibold">{t('common.color')}</Label>
                    <Select
                      value={formData.color || undefined}
                      onValueChange={(value) => setFormData({ ...formData, color: value || '' })}
                    >
                      <SelectTrigger className="mt-2 border-emerald-200 focus:border-emerald-400">
                        <SelectValue placeholder="Select color (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand" className="text-base font-semibold">{t('common.brand')}</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g., Zara, H&M"
                      className="mt-2 border-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-base font-semibold">{t('common.description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Add any notes about this item..."
                    className="mt-2 border-emerald-200 focus:border-emerald-400"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="tags" className="text-base font-semibold">{t('common.tags')}</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="casual, summer, formal, work"
                    className="mt-2 border-emerald-200 focus:border-emerald-400"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {t('common.separateTagsWithCommas')}
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg py-6"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {editItem ? t('common.updateItem') : t('common.uploadItem')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

        {/* Statistics Cards */}
        {items.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-12">
            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">{t('wardrobe.totalItems')}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600">{stats.total}</p>
                  </div>
                  <Shirt className="h-7 w-7 lg:h-8 lg:w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">{t('wardrobe.categories')}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600">
                      {Object.keys(stats.categoryCounts).length}
                    </p>
                  </div>
                  <Tag className="h-7 w-7 lg:h-8 lg:w-8 text-teal-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">{t('wardrobe.uniqueColors')}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600">
                      {new Set(items.filter(i => i.color).map(i => i.color)).size}
                    </p>
                  </div>
                  <Palette className="h-7 w-7 lg:h-8 lg:w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">{t('wardrobe.topColor')}</p>
                    <p className="text-lg font-bold text-emerald-600 capitalize">
                      {stats.topColors[0]?.[0] || 'N/A'}
                    </p>
                  </div>
                  <Sparkles className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        {items.length > 0 && (
          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover mb-8">
            <CardContent className="px-6 pt-6 pb-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search by name, brand, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-emerald-200 focus:border-emerald-400"
                  />
                </div>

                {/* Filters Row */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Color</Label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger className="border-emerald-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Colors</SelectItem>
                        {colors.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-2 block">View</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? 'bg-emerald-600' : 'border-emerald-200'}
                        title="Grid View"
                      >
                        <Grid3x3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'masonry' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('masonry')}
                        className={viewMode === 'masonry' ? 'bg-emerald-600' : 'border-emerald-200'}
                        title="Masonry View"
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? 'bg-emerald-600' : 'border-emerald-200'}
                        title="List View"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Results</Label>
                    <p className="text-sm text-slate-600 pt-2">
                      {paginatedItems.length} of {filteredItems.length} items
                    </p>
                  </div>
                </div>

                {/* Tag Filters */}
                {allTags.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Filter by Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTags(prev =>
                              prev.includes(tag)
                                ? prev.filter(t => t !== tag)
                                : [...prev, tag]
                            )
                          }}
                          className={`
                            px-3 py-1 rounded-full text-sm transition-all flex items-center gap-1
                            ${selectedTags.includes(tag)
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }
                          `}
                        >
                          {selectedTags.includes(tag) && <Check className="h-3 w-3" />}
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Active Filters */}
                {(selectedColor !== 'all' || selectedTags.length > 0 || searchQuery) && (
                  <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-emerald-100">
                    <span className="text-sm text-slate-600">Active filters:</span>
                    {searchQuery && (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm flex items-center gap-1">
                        Search: "{searchQuery}"
                        <button onClick={() => setSearchQuery('')}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedColor !== 'all' && (
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm flex items-center gap-1">
                        {selectedColor}
                        <button onClick={() => setSelectedColor('all')}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-sm flex items-center gap-1"
                      >
                        {tag}
                        <button onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedColor('all')
                        setSelectedTags([])
                      }}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category Tabs */}
        {items.length > 0 ? (
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
            <TabsList className="bg-white/95 backdrop-blur-md border-emerald-200/50 w-full justify-start overflow-x-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
                All Items ({items.length})
              </TabsTrigger>
              {categories.map((cat) => {
                const count = stats.categoryCounts[cat.value] || 0
                if (count === 0) return null
                return (
                  <TabsTrigger
                    key={cat.value}
                    value={cat.value}
                    className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                      <span className="text-xs opacity-75">({count})</span>
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            <TabsContent value={activeCategory} className="mt-0">
              {loading ? (
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6' : 'space-y-3'}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} viewMode={viewMode} />
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
                  <CardContent className="py-12 text-center">
                    <Search className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="h3 text-emerald-900 mb-2">{t('common.noItemsFound')}</h3>
                    <p className="text-slate-600 mb-6">{t('common.tryAdjustingFilters')}</p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedColor('all')
                        setSelectedTags([])
                        setActiveCategory('all')
                      }}
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      {t('common.clearFilters')}
                    </Button>
                  </CardContent>
                </Card>
              ) : viewMode === 'grid' ? (
                <>
                  <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {paginatedItems.map((item) => (
                      <WardrobeItemCard
                        key={item.id}
                        item={item}
                        categoryInfo={categoryMap.get(item.category)}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        viewMode="grid"
                      />
                    ))}
                  </div>
                  {paginatedItems.length < filteredItems.length && (
                    <div className="mt-8 text-center">
                      <Button
                        onClick={loadMore}
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        Load More ({filteredItems.length - paginatedItems.length} remaining)
                      </Button>
                    </div>
                  )}
                </>
              ) : viewMode === 'masonry' ? (
                <>
                  <MasonryGrid columns={5} className="md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {paginatedItems.map((item) => (
                      <WardrobeItemCard
                        key={item.id}
                        item={item}
                        categoryInfo={categoryMap.get(item.category)}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        viewMode="grid"
                      />
                    ))}
                  </MasonryGrid>
                  {paginatedItems.length < filteredItems.length && (
                    <div className="mt-8 text-center">
                      <Button
                        onClick={loadMore}
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        Load More ({filteredItems.length - paginatedItems.length} remaining)
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    {paginatedItems.map((item) => (
                      <WardrobeItemCard
                        key={item.id}
                        item={item}
                        categoryInfo={categoryMap.get(item.category)}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        viewMode="list"
                      />
                    ))}
                  </div>
                  {paginatedItems.length < filteredItems.length && (
                    <div className="mt-8 text-center">
                      <Button
                        onClick={loadMore}
                        variant="outline"
                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        Load More ({filteredItems.length - paginatedItems.length} remaining)
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
            <CardContent className="py-12 text-center">
              <Shirt className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="h3 text-emerald-900 mb-2">{t('common.yourWardrobeIsEmpty')}</h3>
              <p className="text-slate-600 mb-6">{t('common.startBuildingCloset')}</p>
              <Button 
                onClick={() => setOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('wardrobe.addFirst')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* View Item Dialog */}
        {viewItem && (
          <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="h2">{viewItem.name}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-96 rounded-xl overflow-hidden border-2 border-emerald-200">
                  {viewItem.imageUrl.startsWith('data:') ? (
                    <img
                      src={viewItem.imageUrl}
                      alt={viewItem.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={viewItem.imageUrl}
                      alt={viewItem.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-semibold text-slate-600">{t('common.category')}</Label>
                    <p className="text-lg capitalize flex items-center gap-2 mt-1">
                      <span className="text-2xl">
                        {categories.find(c => c.value === viewItem.category)?.icon}
                      </span>
                      {categories.find(c => c.value === viewItem.category)?.label}
                    </p>
                  </div>
                  {viewItem.color && (
                    <div>
                      <Label className="text-sm font-semibold text-slate-600">{t('common.color')}</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-slate-300 shadow-sm"
                          style={{ backgroundColor: viewItem.color.toLowerCase() }}
                        />
                        <p className="text-lg">{viewItem.color}</p>
                      </div>
                    </div>
                  )}
                  {viewItem.brand && (
                    <div>
                      <Label className="text-sm font-semibold text-slate-600">{t('common.brand')}</Label>
                      <p className="text-lg">{viewItem.brand}</p>
                    </div>
                  )}
                  {viewItem.description && (
                    <div>
                      <Label className="text-sm font-semibold text-slate-600">{t('common.description')}</Label>
                      <p className="text-slate-700 mt-1">{viewItem.description}</p>
                    </div>
                  )}
                  {viewItem.tags.length > 0 && (
                    <div>
                      <Label className="text-sm font-semibold text-slate-600">{t('common.tags')}</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {viewItem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => {
                        setViewItem(null)
                        handleEdit(viewItem)
                      }}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      {t('common.edit')}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDelete(viewItem.id)
                        setViewItem(null)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('common.delete')}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
