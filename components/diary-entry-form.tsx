"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { searchSpotify } from "@/lib/spotify"
import { Loader2, Search, X, Disc, Album } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  itemId: z.string().min(1, "Please select a track or album"),
  itemType: z.enum(["track", "album"]),
  rating: z.number().min(0.5, "Please rate this item").max(5),
  review: z.string().max(1000, "Review must be less than 1000 characters"),
})

type FormValues = z.infer<typeof formSchema>

interface DiaryEntryFormProps {
  onSubmit: (values: FormValues & { title: string; artist: string; imageUrl: string }) => void
  onCancel?: () => void
  initialValues?: Partial<FormValues & { title: string; artist: string; imageUrl: string }>
}

export function DiaryEntryForm({ onSubmit, onCancel, initialValues }: DiaryEntryFormProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const [selectedItem, setSelectedItem] = useState<any>(
    initialValues?.itemId
      ? {
          id: initialValues.itemId,
          type: initialValues.itemType,
          name: initialValues.title,
          artists: [{ name: initialValues.artist }],
          images: [{ url: initialValues.imageUrl }],
          album:
            initialValues.itemType === "track"
              ? {
                  images: [{ url: initialValues.imageUrl }],
                }
              : undefined,
        }
      : null,
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemId: initialValues?.itemId || "",
      itemType: initialValues?.itemType || "track",
      rating: initialValues?.rating || 0,
      review: initialValues?.review || "",
    },
  })

  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch()
      } else {
        setSearchResults(null)
        setShowResults(false)
        setSearchError(null)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const performSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setSearchError(null)

    try {
      const data = await searchSpotify(searchQuery, "track,album", 10)
      setSearchResults(data)
      setShowResults(true)

      // Check if we have any results
      const hasResults = data?.tracks?.items?.length > 0 || data?.albums?.items?.length > 0

      if (!hasResults) {
        setSearchError("No results found")
      }
    } catch (error) {
      console.error("Search error:", error)
      setSearchError("Failed to search. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults(null)
    setShowResults(false)
    setSearchError(null)
  }

  const handleSelectItem = (item: any, type: "track" | "album") => {
    setSelectedItem({
      ...item,
      type,
    })

    form.setValue("itemId", item.id)
    form.setValue("itemType", type)
    setSearchResults(null)
  }

  const handleClearSelection = () => {
    setSelectedItem(null)
    form.setValue("itemId", "")
  }

  const handleFormSubmit = (values: FormValues) => {
    if (!selectedItem) return

    onSubmit({
      ...values,
      title: selectedItem.name,
      artist: selectedItem.artists.map((a: any) => a.name).join(", "),
      imageUrl: selectedItem.type === "track" ? selectedItem.album.images[0]?.url : selectedItem.images[0]?.url,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialValues?.itemId ? "Edit Entry" : "Add to Your Diary"}</CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <CardContent className="space-y-4">
            {!selectedItem ? (
              <div className="space-y-4" ref={searchRef}>
                <FormLabel>Search for a track or album</FormLabel>
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for a song or album..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-8"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </button>
                  )}
                </form>

                {isSearching ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : searchError && showResults ? (
                  <div className="text-center py-8 text-muted-foreground">{searchError}</div>
                ) : (
                  searchResults &&
                  showResults && (
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <Tabs defaultValue="tracks">
                          <TabsList className="w-full">
                            <TabsTrigger value="tracks" className="flex-1">
                              Tracks
                            </TabsTrigger>
                            <TabsTrigger value="albums" className="flex-1">
                              Albums
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="tracks" className="mt-0">
                            <ScrollArea className="h-[300px]">
                              {searchResults.tracks?.items?.length > 0 ? (
                                <div className="space-y-0">
                                  {searchResults.tracks.items.map((track: any) => (
                                    <div
                                      key={track.id}
                                      className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-0"
                                      onClick={() => handleSelectItem(track, "track")}
                                    >
                                      <div className="h-10 w-10 overflow-hidden rounded-md flex-shrink-0">
                                        <img
                                          src={track.album.images[0]?.url || "/placeholder.svg?height=40&width=40"}
                                          alt={track.name}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-medium truncate">{track.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {track.artists.map((a: any) => a.name).join(", ")}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">No tracks found</div>
                              )}
                            </ScrollArea>
                          </TabsContent>

                          <TabsContent value="albums" className="mt-0">
                            <ScrollArea className="h-[300px]">
                              {searchResults.albums?.items?.length > 0 ? (
                                <div className="space-y-0">
                                  {searchResults.albums.items.map((album: any) => (
                                    <div
                                      key={album.id}
                                      className="flex items-center gap-3 p-3 hover:bg-muted cursor-pointer border-b last:border-0"
                                      onClick={() => handleSelectItem(album, "album")}
                                    >
                                      <div className="h-10 w-10 overflow-hidden rounded-md flex-shrink-0">
                                        <img
                                          src={album.images[0]?.url || "/placeholder.svg?height=40&width=40"}
                                          alt={album.name}
                                          className="h-full w-full object-cover"
                                        />
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-medium truncate">{album.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                          {album.artists.map((a: any) => a.name).join(", ")}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">No albums found</div>
                              )}
                            </ScrollArea>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="h-16 w-16 overflow-hidden rounded-md">
                      <img
                        src={
                          selectedItem.type === "track"
                            ? selectedItem.album.images[0]?.url
                            : selectedItem.images[0]?.url
                        }
                        alt={selectedItem.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        {selectedItem.type === "track" ? (
                          <Disc className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Album className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground capitalize">{selectedItem.type}</span>
                      </div>
                      <p className="font-medium">{selectedItem.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedItem.artists.map((a: any) => a.name).join(", ")}
                      </p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={handleClearSelection}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear selection</span>
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Rating</FormLabel>
                      <FormControl>
                        <StarRating initialRating={field.value} onChange={field.onChange} size="lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Review (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your thoughts about this track or album..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!selectedItem || form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {initialValues?.itemId ? "Save Changes" : "Add to Diary"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

