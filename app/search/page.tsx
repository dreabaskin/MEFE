"use client"

import { useEffect, useState, useMemo } from 'react'
import { Navbar } from '@/components/navbar'
import { PageHeader } from '@/components/page-header'
import { useLanguage } from '@/contexts/language-context'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search as SearchIcon, Heart, ExternalLink, Filter, X, Sparkles, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { EmptyState } from '@/components/empty-state'

interface SavedOutfit {
  id: string
  title: string
  description: string | null
  imageUrl: string
  storeName: string | null
  storeUrl: string | null
  price: string | null
  brand: string | null
  category: string | null
  tags: string[]
  isFavorite: boolean
}

export default function SearchPage() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStore, setSelectedStore] = useState<string>('all')
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([])
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

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

  useEffect(() => {
    fetchSavedOutfits()
  }, [])

  const fetchSavedOutfits = async () => {
    try {
      const res = await fetch('/api/favorites')
      const data = await res.json()
      setSavedOutfits(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching saved outfits:', error)
      setSavedOutfits([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      })
      const data = await res.json()
      setSearchResults(data.results || [])
    } catch (error) {
      console.error('Error searching:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSaveOutfit = async (outfit: any) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: outfit.title || outfit.name || 'Untitled Outfit',
          description: outfit.description,
          imageUrl: outfit.imageUrl || outfit.image,
          storeName: outfit.storeName || outfit.store,
          storeUrl: outfit.storeUrl || outfit.url,
          price: outfit.price,
          brand: outfit.brand,
          category: outfit.category,
          tags: outfit.tags || [],
        }),
      })
      if (res.ok) {
        fetchSavedOutfits()
      }
    } catch (error) {
      console.error('Error saving outfit:', error)
    }
  }

  const handleToggleFavorite = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/favorites/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentStatus }),
      })
      if (res.ok) {
        fetchSavedOutfits()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved outfit?')) return

    try {
      const res = await fetch(`/api/favorites/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        fetchSavedOutfits()
      }
    } catch (error) {
      console.error('Error deleting outfit:', error)
    }
  }

  // Filter saved outfits
  const filteredSavedOutfits = useMemo(() => {
    if (!Array.isArray(savedOutfits)) {
      return []
    }
    
    let filtered = [...savedOutfits]

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(outfit => outfit.category === selectedCategory)
    }

    if (selectedStore !== 'all') {
      filtered = filtered.filter(outfit => outfit.storeName === selectedStore)
    }

    return filtered
  }, [savedOutfits, selectedCategory, selectedStore])

  const uniqueStores = useMemo(() => {
    if (!Array.isArray(savedOutfits)) {
      return []
    }
    return Array.from(new Set(savedOutfits.map(o => o.storeName).filter((store): store is string => Boolean(store))))
  }, [savedOutfits])

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
        <PageHeader
          title="Discover Outfits"
          description="Search for styles and save your favorites"
        />

        {/* Search Bar */}
        <Card className="glass-card border-emerald-200/50 shadow-lg card-hover mb-8">
          <CardContent className="px-6 pt-6 pb-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500 z-10" />
                  <Input
                    placeholder="Search for outfits, styles, occasions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch()
                      }
                    }}
                    className="pl-12 pr-4 py-6 text-base border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg bg-white shadow-sm transition-all"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-8 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {isSearching ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <SearchIcon className="h-5 w-5" />
                      <span>Search</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Search Tips */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-slate-500">Try searching for:</span>
                {['casual outfit', 'formal wear', 'summer style', 'work attire', 'date night'].map((tip) => (
                  <button
                    key={tip}
                    onClick={() => {
                      setSearchQuery(tip)
                      handleSearch()
                    }}
                    className="px-2 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="h2 text-emerald-900">Search Results</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchResults([])}
                className="text-slate-600"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Results
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result, index) => (
                <Card
                  key={index}
                  className="group bg-white/95 backdrop-blur-md border-emerald-200/50 hover:border-emerald-400 hover:shadow-xl transition-all shadow-sm overflow-hidden"
                >
                  <div className="relative h-64 w-full">
                    {result.imageUrl || result.image ? (
                      <Image
                        src={result.imageUrl || result.image}
                        alt={result.title || result.name || 'Outfit'}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <ShoppingBag className="h-16 w-16 text-emerald-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-white/90 hover:bg-white shadow-md"
                        onClick={() => handleSaveOutfit(result)}
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-1">
                      {result.title || result.name || 'Untitled Outfit'}
                    </CardTitle>
                    {result.description && (
                      <CardDescription className="line-clamp-2">
                        {result.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {result.storeName && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <ShoppingBag className="h-4 w-4" />
                          <span>{result.storeName}</span>
                        </div>
                      )}
                      {result.price && (
                        <p className="text-sm font-semibold text-emerald-600">{result.price}</p>
                      )}
                      {result.storeUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full border-emerald-200"
                          onClick={() => window.open(result.storeUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Store
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Saved Outfits Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="h2 text-emerald-900">Saved Outfits</h2>
            {savedOutfits.length > 0 && (
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 border-emerald-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {uniqueStores.length > 0 && (
                  <Select value={selectedStore} onValueChange={setSelectedStore}>
                    <SelectTrigger className="w-40 border-emerald-200">
                      <SelectValue placeholder="All Stores" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stores</SelectItem>
                      {uniqueStores.map((store) => (
                        <SelectItem key={store} value={store}>
                          {store}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}
          </div>

          {filteredSavedOutfits.length === 0 ? (
            <EmptyState
              icon={<SearchIcon className="h-8 w-8" />}
              illustration="search"
              title={savedOutfits.length === 0 ? 'No saved outfits yet' : 'No outfits match your filters'}
              description={savedOutfits.length === 0
                ? 'Search for outfits and save them to your favorites!'
                : 'Try adjusting your filters'
              }
              tips={savedOutfits.length === 0 ? [
                "Use the search bar to find clothing stores",
                "Save outfits you love to your favorites",
                "Browse different categories and styles",
                "Get inspired by trending looks"
              ] : [
                "Try removing some filters",
                "Search with different keywords",
                "Browse all categories"
              ]}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSavedOutfits.map((outfit) => (
                <Card
                  key={outfit.id}
                  className="group bg-white/95 backdrop-blur-md border-emerald-200/50 hover:border-emerald-400 hover:shadow-xl transition-all shadow-sm overflow-hidden"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={outfit.imageUrl}
                      alt={outfit.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        className={`h-8 w-8 bg-white/90 hover:bg-white shadow-md ${
                          outfit.isFavorite ? 'text-red-500' : ''
                        }`}
                        onClick={() => handleToggleFavorite(outfit.id, outfit.isFavorite)}
                      >
                        <Heart className={`h-4 w-4 ${outfit.isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-1">{outfit.title}</CardTitle>
                    {outfit.description && (
                      <CardDescription className="line-clamp-2">
                        {outfit.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {outfit.storeName && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <ShoppingBag className="h-4 w-4" />
                          <span>{outfit.storeName}</span>
                        </div>
                      )}
                      {outfit.brand && (
                        <p className="text-sm text-slate-600">Brand: {outfit.brand}</p>
                      )}
                      {outfit.price && (
                        <p className="text-sm font-semibold text-emerald-600">{outfit.price}</p>
                      )}
                      {outfit.category && (
                        <span className="inline-block px-2 py-1 text-xs bg-emerald-50 text-emerald-700 rounded-full">
                          {outfit.category}
                        </span>
                      )}
                      {outfit.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {outfit.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2 pt-2">
                        {outfit.storeUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-emerald-200"
                            onClick={() => window.open(outfit.storeUrl!, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Store
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(outfit.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

