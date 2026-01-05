"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { PageHeader } from '@/components/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Sparkles, Trash2, Edit2, Eye, Search, Grid3x3, List, X, Check, Shirt, TrendingUp, Palette, Upload, Image as ImageIcon } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/language-context'
import { EmptyState } from '@/components/empty-state'
import { useToast } from '@/components/toast'
import { ProgressIndicator } from '@/components/progress-indicator'
import { SkeletonCard } from '@/components/skeleton-card'

interface WardrobeItem {
  id: string
  name: string
  imageUrl: string
  category: string
  color: string | null
}

interface OutfitItem {
  wardrobeItem: WardrobeItem
}

interface Outfit {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  type: string
  items: OutfitItem[]
  createdAt: string
}

export default function OutfitsPage() {
  const { t } = useLanguage()
  
  const categories = [
    { value: 'top', label: t('category.top') },
    { value: 'bottom', label: t('category.bottom') },
    { value: 'dress', label: t('category.dress') },
    { value: 'outerwear', label: t('category.outerwear') },
    { value: 'shoes', label: t('category.shoes') },
    { value: 'accessories', label: t('category.accessories') },
  ]
  const searchParams = useSearchParams()
  const [outfits, setOutfits] = useState<Outfit[]>([])
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [viewOutfit, setViewOutfit] = useState<Outfit | null>(null)
  const [editOutfit, setEditOutfit] = useState<Outfit | null>(null)
  const [aiOpen, setAiOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [outfitType, setOutfitType] = useState<'wardrobe' | 'photo'>('wardrobe')
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [aiMood, setAiMood] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    fetchOutfits()
    fetchWardrobeItems()
    if (searchParams.get('ai') === 'true') {
      setAiOpen(true)
    }
    if (searchParams.get('create') === 'true') {
      setOpen(true)
    }
  }, [searchParams])

  const fetchOutfits = async () => {
    try {
      const res = await fetch('/api/outfits')
      const data = await res.json()
      setOutfits(data)
    } catch (error) {
      console.error('Error fetching outfits:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWardrobeItems = async () => {
    try {
      const res = await fetch('/api/wardrobe')
      const data = await res.json()
      setWardrobeItems(data)
    } catch (error) {
      console.error('Error fetching wardrobe:', error)
    }
  }

  const handleCreateOutfit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (outfitType === 'wardrobe') {
      if (!formData.name || selectedItems.length === 0) {
        alert('Please provide a name and select at least one item')
        return
      }
    } else {
      if (!formData.name || !photoFile) {
        alert('Please provide a name and upload a photo')
        return
      }
    }

    try {
      const url = editOutfit ? `/api/outfits/${editOutfit.id}` : '/api/outfits'
      const method = editOutfit ? 'PUT' : 'POST'
      
      let res: Response
      
      if (outfitType === 'photo') {
        // Photo-based outfit - use FormData
        const data = new FormData()
        data.append('name', formData.name)
        if (formData.description) {
          data.append('description', formData.description)
        }
        if (photoFile) {
          data.append('image', photoFile)
        }
        
        res = await fetch(url, {
          method,
          body: data,
        })
      } else {
        // Wardrobe-based outfit - use JSON
        res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            wardrobeItemIds: selectedItems,
          }),
        })
      }
      
      if (res.ok) {
        setOpen(false)
        setEditOutfit(null)
        setFormData({ name: '', description: '' })
        setSelectedItems([])
        setPhotoFile(null)
        setPhotoPreview(null)
        setOutfitType('wardrobe')
        fetchOutfits()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to save outfit')
      }
    } catch (error) {
      console.error('Error saving outfit:', error)
      alert('An error occurred while saving the outfit')
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        addToast('Please select an image file', 'warning')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        addToast('Image file size must be less than 10MB', 'warning')
        return
      }
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this outfit?')) return

    try {
      const res = await fetch(`/api/outfits/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        addToast('Outfit deleted successfully', 'success')
        setViewOutfit(null)
        fetchOutfits()
      } else {
        addToast('Failed to delete outfit', 'error')
      }
    } catch (error) {
      console.error('Error deleting outfit:', error)
      addToast('An error occurred while deleting', 'error')
    }
  }

  const handleEdit = (outfit: Outfit) => {
    setEditOutfit(outfit)
    setOutfitType(outfit.type === 'photo' ? 'photo' : 'wardrobe')
    setFormData({
      name: outfit.name,
      description: outfit.description || '',
    })
    if (outfit.type === 'photo') {
      setPhotoPreview(outfit.imageUrl || null)
    } else {
      setSelectedItems(outfit.items.map(item => item.wardrobeItem.id))
    }
    setViewOutfit(null)
    setOpen(true)
  }

  const handleAiSuggestion = async () => {
    if (!aiMood) {
      addToast('Please describe how you want to feel', 'warning')
      return
    }
    setAiLoading(true)
    try {
      const res = await fetch('/api/aiSuggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ desiredMood: aiMood }),
      })
      const data = await res.json()
      if (res.ok) {
        setAiSuggestion(data.suggestion)
        addToast('AI suggestion generated!', 'success')
      } else {
        addToast('Failed to generate suggestion', 'error')
        setAiSuggestion('Unable to generate suggestion at this time.')
      }
    } catch (error) {
      console.error('Error getting AI suggestion:', error)
      addToast('An error occurred', 'error')
      setAiSuggestion('Unable to generate suggestion at this time.')
    } finally {
      setAiLoading(false)
    }
  }

  // Filter outfits
  const filteredOutfits = useMemo(() => {
    let filtered = [...outfits]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(outfit =>
        outfit.name.toLowerCase().includes(query) ||
        outfit.description?.toLowerCase().includes(query) ||
        (outfit.type === 'wardrobe' && outfit.items.some(item => item.wardrobeItem.name.toLowerCase().includes(query)))
      )
    }

    // Category filter (only for wardrobe-based outfits)
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(outfit =>
        outfit.type === 'photo' || outfit.items.some(item => item.wardrobeItem.category === selectedCategory)
      )
    }

    return filtered
  }, [outfits, searchQuery, selectedCategory])

  // Statistics
  const stats = useMemo(() => {
    const totalOutfits = outfits.length
    const wardrobeOutfits = outfits.filter(o => o.type === 'wardrobe')
    const totalItems = wardrobeOutfits.reduce((sum, outfit) => sum + outfit.items.length, 0)
    const avgItemsPerOutfit = wardrobeOutfits.length > 0 ? (totalItems / wardrobeOutfits.length).toFixed(1) : '0'
    
    const categoryCounts: Record<string, number> = {}
    wardrobeOutfits.forEach(outfit => {
      outfit.items.forEach(item => {
        categoryCounts[item.wardrobeItem.category] = (categoryCounts[item.wardrobeItem.category] || 0) + 1
      })
    })

    return {
      totalOutfits,
      totalItems,
      avgItemsPerOutfit,
      categoryCounts,
    }
  }, [outfits])

  // Filter wardrobe items by category for selection
  const filteredWardrobeItems = useMemo(() => {
    return wardrobeItems.filter(item => {
      if (selectedCategory === 'all') return true
      return item.category === selectedCategory
    })
  }, [wardrobeItems, selectedCategory])

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 25%, #d1fae5 50%, #a7f3d0 75%, #ccfbf1 100%)' }}>
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <PageHeader
            title={t('outfits.title')}
            description={t('outfits.description')}
          />
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {Array.from({ length: 9 }).map((_, i) => (
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
          title={t('outfits.title')}
          description={t('outfits.description')}
          action={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setAiOpen(true)}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {t('common.aiSuggestion')}
              </Button>
              <Button 
                onClick={() => {
                  setEditOutfit(null)
                  setFormData({ name: '', description: '' })
                  setSelectedItems([])
                  setOpen(true)
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('outfits.createOutfit')}
              </Button>
            </div>
          }
        />

        {/* Statistics Cards */}
        {outfits.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-12">
            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">{t('outfits.totalOutfits')}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600">{stats.totalOutfits}</p>
                  </div>
                  <Sparkles className="h-7 w-7 lg:h-8 lg:w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">{t('outfits.totalItems')}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-teal-600">{stats.totalItems}</p>
                  </div>
                  <Shirt className="h-7 w-7 lg:h-8 lg:w-8 text-teal-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">{t('outfits.avgItems')}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-cyan-600">{stats.avgItemsPerOutfit}</p>
                  </div>
                  <TrendingUp className="h-7 w-7 lg:h-8 lg:w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-200/50 shadow-lg card-hover">
              <CardContent className="px-5 lg:px-6 pt-6 lg:pt-7 pb-6 lg:pb-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-2">{t('outfits.categories')}</p>
                    <p className="text-2xl lg:text-3xl font-bold text-emerald-600">
                      {Object.keys(stats.categoryCounts).length}
                    </p>
                  </div>
                  <Palette className="h-7 w-7 lg:h-8 lg:w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Suggestion Dialog */}
        <Dialog open={aiOpen} onOpenChange={setAiOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="h2">{t('common.aiSuggestion')}</DialogTitle>
              <CardDescription>Tell us how you want to feel and we'll suggest an outfit</CardDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="mood" className="text-base font-semibold">{t('common.howDoYouWantToFeel')}</Label>
                <Input
                  id="mood"
                  value={aiMood}
                  onChange={(e) => setAiMood(e.target.value)}
                  placeholder="e.g., confident, comfortable, powerful, elegant"
                  className="mt-2 border-emerald-200 focus:border-emerald-400"
                />
              </div>
              <Button 
                onClick={handleAiSuggestion} 
                disabled={aiLoading || !aiMood}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                {aiLoading ? t('common.generating') : t('common.getSuggestion')}
              </Button>
              {aiSuggestion && (
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-900 whitespace-pre-wrap">{aiSuggestion}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Create/Edit Outfit Dialog */}
        <Dialog 
          open={open} 
          onOpenChange={(open) => {
            setOpen(open)
            if (!open) {
              setEditOutfit(null)
              setFormData({ name: '', description: '' })
              setSelectedItems([])
              setPhotoFile(null)
              setPhotoPreview(null)
              setOutfitType('wardrobe')
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="h2">
                {editOutfit ? t('common.editOutfit') : t('common.createOutfit')}
              </DialogTitle>
              <CardDescription>
                {editOutfit 
                  ? outfitType === 'photo' 
                    ? t('common.updatePhotoOutfit')
                    : t('common.updateWardrobeOutfit')
                  : t('common.chooseHowToCreate')
                }
              </CardDescription>
            </DialogHeader>
            
            {!editOutfit && (
              <Tabs value={outfitType} onValueChange={(value) => setOutfitType(value as 'wardrobe' | 'photo')} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="wardrobe" className="flex items-center gap-2">
                    <Shirt className="h-4 w-4" />
                    {t('outfits.fromWardrobe')}
                  </TabsTrigger>
                  <TabsTrigger value="photo" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    {t('outfits.uploadPhoto')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <form onSubmit={handleCreateOutfit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-base font-semibold">{t('common.name')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g., Casual Friday, Date Night"
                    className="mt-2 border-emerald-200 focus:border-emerald-400"
                  />
                </div>
                {outfitType === 'wardrobe' ? (
                  <div>
                    <Label className="text-base font-semibold mb-2 block">{t('common.filterByCategory')}</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="border-emerald-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.allCategories')}</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div>
                    <Label className="text-base font-semibold mb-2 block">{t('common.category')}</Label>
                    <Select value="full-outfit" disabled>
                      <SelectTrigger className="border-emerald-200 bg-emerald-50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-outfit">{t('common.fullOutfit')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-semibold">{t('common.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add notes about this outfit..."
                  className="mt-2 border-emerald-200 focus:border-emerald-400"
                  rows={2}
                />
              </div>

              {outfitType === 'photo' ? (
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    {t('outfits.uploadOutfitPhoto')} *
                  </Label>
                  <div className="space-y-4">
                    {photoPreview ? (
                      <div className="relative border-2 border-emerald-200 rounded-lg overflow-hidden">
                        <div className="relative h-96 w-full bg-slate-100">
                          <img
                            src={photoPreview}
                            alt="Outfit preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setPhotoFile(null)
                            setPhotoPreview(null)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-emerald-200 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
                        <Label htmlFor="photo-upload" className="cursor-pointer">
                          <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            onClick={() => {
                              const input = document.getElementById('photo-upload')
                              input?.click()
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Photo
                          </Button>
                        </Label>
                        <p className="text-sm text-slate-500 mt-2">Upload a photo of yourself wearing the outfit</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    {t('outfits.selectItems')} * ({selectedItems.length} {t('common.selected')})
                  </Label>
                {filteredWardrobeItems.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-emerald-200 rounded-lg">
                    <p className="text-slate-600">{t('common.noItems')} available in this category</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-2 border border-emerald-200 rounded-lg">
                    {filteredWardrobeItems.map((item) => {
                      const isSelected = selectedItems.includes(item.id)
                      return (
                        <div
                          key={item.id}
                          className={`
                            relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all
                            ${isSelected
                              ? 'border-emerald-600 ring-2 ring-emerald-300 shadow-lg'
                              : 'border-emerald-200 hover:border-emerald-400'
                            }
                          `}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedItems(selectedItems.filter((id) => id !== item.id))
                            } else {
                              setSelectedItems([...selectedItems, item.id])
                            }
                          }}
                        >
                          <div className="relative h-24 w-full">
                            {item.imageUrl.startsWith('data:') ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            )}
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-emerald-600 rounded-full p-1">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs p-1 text-center bg-white/90">{item.name}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-lg py-6"
                disabled={
                  outfitType === 'wardrobe' 
                    ? selectedItems.length === 0 
                    : !photoFile && !photoPreview
                }
              >
                {editOutfit ? t('common.updateOutfit') : t('common.createOutfit')}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Outfit Dialog */}
        {viewOutfit && (
          <Dialog open={!!viewOutfit} onOpenChange={() => setViewOutfit(null)}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle className="h2">{viewOutfit.name}</DialogTitle>
                {viewOutfit.description && (
                  <CardDescription>{viewOutfit.description}</CardDescription>
                )}
              </DialogHeader>
              <div className="space-y-4">
                {viewOutfit.type === 'photo' && viewOutfit.imageUrl ? (
                  <div className="relative h-[600px] rounded-lg overflow-hidden border-2 border-emerald-200 bg-slate-100">
                    {viewOutfit.imageUrl.startsWith('data:') ? (
                      <img
                        src={viewOutfit.imageUrl}
                        alt={viewOutfit.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Image
                        src={viewOutfit.imageUrl}
                        alt={viewOutfit.name}
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {viewOutfit.items.map((item) => (
                      <div key={item.wardrobeItem.id} className="relative h-48 rounded-lg overflow-hidden border-2 border-emerald-200">
                        {item.wardrobeItem.imageUrl.startsWith('data:') ? (
                          <img
                            src={item.wardrobeItem.imageUrl}
                            alt={item.wardrobeItem.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={item.wardrobeItem.imageUrl}
                            alt={item.wardrobeItem.name}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-2">
                          <p className="text-sm font-medium">{item.wardrobeItem.name}</p>
                          <p className="text-xs capitalize">{item.wardrobeItem.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleEdit(viewOutfit)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(viewOutfit.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Search and Filter */}
        {outfits.length > 0 && (
          <Card className="glass-card border-emerald-200/50 shadow-lg card-hover mb-8">
            <CardContent className="px-6 pt-6 pb-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder={t('common.searchByNameDescription')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-emerald-200 focus:border-emerald-400"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">{t('common.category')}</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-emerald-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common.allCategories')}</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">{t('common.viewMode')}</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={viewMode === 'grid' ? 'bg-emerald-600' : 'border-emerald-200'}
                      title={t('common.grid')}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={viewMode === 'list' ? 'bg-emerald-600' : 'border-emerald-200'}
                      title={t('common.list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
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
        )}

        {filteredOutfits.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-8 w-8" />}
            illustration="outfit"
            title={outfits.length === 0 ? t('common.noOutfitsYet') : t('common.noOutfitsMatchFilters')}
            description={outfits.length === 0 
              ? t('common.startCreatingLooks')
              : t('common.tryAdjustingSearch')
            }
            action={outfits.length === 0 ? {
              label: t('outfits.createFirst'),
              onClick: () => {
                setFormData({ name: '', description: '' })
                setSelectedItems([])
                setOpen(true)
              },
              icon: <Plus className="h-5 w-5" />
            } : undefined}
            tips={outfits.length === 0 ? [
              "Combine items from your wardrobe to create looks",
              "Upload photos of complete outfits you've worn",
              "Add descriptions to remember the occasion",
              "Plan outfits for upcoming events"
            ] : [
              "Try removing some filters",
              "Check your search query",
              "Browse all outfit types"
            ]}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOutfits.map((outfit) => (
              <Card 
                key={outfit.id} 
                className="group bg-white/95 backdrop-blur-md border-emerald-200/50 hover:border-emerald-400 hover:shadow-xl transition-all shadow-sm overflow-hidden"
              >
                {outfit.type === 'photo' && outfit.imageUrl ? (
                  <div className="relative h-80 w-full bg-slate-100">
                    {outfit.imageUrl.startsWith('data:') ? (
                      <img
                        src={outfit.imageUrl}
                        alt={outfit.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Image
                        src={outfit.imageUrl}
                        alt={outfit.name}
                        fill
                        className="object-contain"
                      />
                    )}
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      Photo
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1 p-4 bg-gradient-to-br from-emerald-50 to-teal-50">
                    {outfit.items.slice(0, 4).map((item) => (
                      <div key={item.wardrobeItem.id} className="relative h-32 rounded-lg overflow-hidden border border-emerald-200">
                        {item.wardrobeItem.imageUrl.startsWith('data:') ? (
                          <img
                            src={item.wardrobeItem.imageUrl}
                            alt={item.wardrobeItem.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={item.wardrobeItem.imageUrl}
                            alt={item.wardrobeItem.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                    {outfit.items.length > 4 && (
                      <div className="relative h-32 rounded-lg overflow-hidden border border-emerald-200 bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-700 font-bold">+{outfit.items.length - 4}</span>
                      </div>
                    )}
                  </div>
                )}
                <CardHeader className="px-6 pt-6 pb-4">
                  <CardTitle className="text-lg">{outfit.name}</CardTitle>
                  {outfit.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">{outfit.description}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">
                    {outfit.type === 'photo' ? t('common.photoOutfit') : `${outfit.items.length} ${t('common.items')}`}
                  </p>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewOutfit(outfit)}
                      className="flex-1 border-emerald-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(outfit)}
                      className="border-emerald-200"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(outfit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOutfits.map((outfit) => (
              <Card 
                key={outfit.id} 
                className="bg-white/95 backdrop-blur-md border-emerald-200/50 hover:border-emerald-400 hover:shadow-lg transition-all shadow-sm"
              >
                <div className="flex gap-4 p-4">
                  {outfit.type === 'photo' && outfit.imageUrl ? (
                    <div className="relative h-56 w-80 flex-shrink-0 rounded-lg overflow-hidden border border-emerald-200 bg-slate-100">
                      {outfit.imageUrl.startsWith('data:') ? (
                        <img
                          src={outfit.imageUrl}
                          alt={outfit.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Image
                          src={outfit.imageUrl}
                          alt={outfit.name}
                          fill
                          className="object-contain"
                        />
                      )}
                      <div className="absolute top-1 right-1 bg-emerald-600 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                        Photo
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2 w-48 flex-shrink-0">
                      {outfit.items.slice(0, 4).map((item) => (
                        <div key={item.wardrobeItem.id} className="relative h-20 rounded-lg overflow-hidden border border-emerald-200">
                          {item.wardrobeItem.imageUrl.startsWith('data:') ? (
                            <img
                              src={item.wardrobeItem.imageUrl}
                              alt={item.wardrobeItem.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Image
                              src={item.wardrobeItem.imageUrl}
                              alt={item.wardrobeItem.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-emerald-900 mb-1">{outfit.name}</h3>
                        {outfit.description && (
                          <p className="text-sm text-slate-600 mb-2 line-clamp-2">{outfit.description}</p>
                        )}
                        <p className="text-xs text-slate-500">
                          {outfit.type === 'photo' ? t('common.photoOutfit') : `${outfit.items.length} ${t('common.items')}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setViewOutfit(outfit)}
                          className="border-emerald-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEdit(outfit)}
                          className="border-emerald-200"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDelete(outfit.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
