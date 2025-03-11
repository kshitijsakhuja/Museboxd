"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Bell, ChevronDown, Search, User, X, Disc, AlertCircle, Home, BookOpen, Library } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signIn, signOut, useSession } from "next-auth/react"
import { searchSpotify } from "@/lib/spotify"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
        // Don't collapse search on outside click if there's a query
        if (!searchQuery.trim()) {
          setIsSearchExpanded(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [searchQuery])

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
      const data = await searchSpotify(searchQuery, "artist,track,album,playlist", 5)
      setSearchResults(data)
      setShowResults(true)

      // Check if we have any results
      const hasResults =
        data?.artists?.items?.length > 0 ||
        data?.tracks?.items?.length > 0 ||
        data?.albums?.items?.length > 0 ||
        data?.playlists?.items?.length > 0

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
    if (searchQuery.trim()) {
      setShowResults(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults(null)
    setShowResults(false)
    setSearchError(null)
  }

  // Update the openSpotifyTrack function to properly redirect to Spotify
  const openSpotifyTrack = (trackId: string) => {
    window.open(`https://open.spotify.com/track/${trackId}`, "_blank", "noopener,noreferrer")
  }

  // Add functions to open other Spotify entities
  const openSpotifyArtist = (artistId: string) => {
    window.open(`https://open.spotify.com/artist/${artistId}`, "_blank", "noopener,noreferrer")
  }

  const openSpotifyAlbum = (albumId: string) => {
    window.open(`https://open.spotify.com/album/${albumId}`, "_blank", "noopener,noreferrer")
  }

  const openSpotifyPlaylist = (playlistId: string) => {
    window.open(`https://open.spotify.com/playlist/${playlistId}`, "_blank", "noopener,noreferrer")
  }

  // Navigation items
  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/diary", label: "Diary", icon: BookOpen },
    { href: "/playlists", label: "Library", icon: Library },
  ]

  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Logo and Navigation */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Disc className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold hidden sm:block">Museboxd</h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Button key={item.href} variant={isActive ? "secondary" : "ghost"} size="sm" className="gap-2" asChild>
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            )
          })}
        </nav>
      </div>

      {/* Search and User Controls */}
      <div className="flex items-center gap-2">
        {/* Expandable Search */}
        <div
          className={cn(
            "relative transition-all duration-200 ease-in-out",
            isSearchExpanded ? "w-full max-w-md" : "w-10",
          )}
          ref={searchRef}
        >
          {isSearchExpanded ? (
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for artists, songs, or playlists..."
                className="w-full bg-muted pl-9 pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if ((searchResults || searchError) && searchQuery.trim()) {
                    setShowResults(true)
                  }
                }}
                autoFocus
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
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsSearchExpanded(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          {/* Search Results */}
          {showResults && (searchResults || isSearching || searchError) && (
            <Card className="absolute left-0 right-0 top-full mt-1 z-50 max-h-[70vh] overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <ScrollArea className="max-h-[70vh]">
                  <div className="p-4">
                    {isSearching ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : searchError ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">{searchError}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Try different keywords or check your spelling
                        </p>
                      </div>
                    ) : (
                      <>
                        {searchResults?.artists?.items?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Artists</h3>
                            <div className="space-y-2">
                              {searchResults.artists?.items?.map((artist: any) => (
                                <div
                                  key={artist.id}
                                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                                  onClick={() => {
                                    openSpotifyArtist(artist.id)
                                    setShowResults(false)
                                  }}
                                >
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={artist.images?.[0]?.url || "/placeholder.svg?height=40&width=40"}
                                      alt={artist.name}
                                    />
                                    <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium">{artist.name}</p>
                                    <p className="text-xs text-muted-foreground">Artist</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults?.tracks?.items?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Tracks</h3>
                            <div className="space-y-2">
                              {searchResults.tracks.items.map((track: any) => (
                                <div
                                  key={track.id}
                                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer group"
                                  onClick={() => {
                                    openSpotifyTrack(track.id)
                                    setShowResults(false)
                                  }}
                                >
                                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                    <img
                                      src={track.album.images?.[0]?.url || "/placeholder.svg?height=40&width=40"}
                                      alt={track.name}
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                      <Disc className="h-5 w-5 text-white" />
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium line-clamp-1">{track.name}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                      {track.artists.map((a: any) => a.name).join(", ")}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults?.albums?.items?.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2">Albums</h3>
                            <div className="space-y-2">
                              {searchResults.albums?.items?.slice(0, 3).map((album: any) => (
                                <div
                                  key={album.id}
                                  className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                                  onClick={() => {
                                    openSpotifyAlbum(album.id)
                                    setShowResults(false)
                                  }}
                                >
                                  <div className="h-10 w-10 overflow-hidden rounded-md">
                                    <img
                                      src={album.images?.[0]?.url || "/placeholder.svg?height=40&width=40"}
                                      alt={album.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium line-clamp-1">{album.name}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">
                                      {album.artists.map((a: any) => a.name).join(", ")}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {(searchResults?.artists?.items?.length > 0 ||
                          searchResults?.tracks?.items?.length > 0 ||
                          searchResults?.albums?.items?.length > 0 ||
                          searchResults?.playlists?.items?.length > 0) && (
                          <Button variant="link" className="mt-2 w-full" onClick={handleSearch}>
                            See all results for "{searchQuery}"
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Library className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="flex items-center">
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session?.user?.image || "/placeholder.svg?height=32&width=32"}
                  alt={session?.user?.name || "User"}
                />
                <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">{session?.user?.name || "Sign In"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {session ? (
              <>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/diary")}>
                  <Disc className="mr-2 h-4 w-4" />
                  My Diary
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <User className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={() => signIn("spotify")}>Sign in with Spotify</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

