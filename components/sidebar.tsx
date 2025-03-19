"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Heart,
  ListMusic,
  Music2,
  Sparkles,
  Grid,
  List,
  AlignJustify,
  Library,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react"
import { getUserPlaylists } from "@/lib/spotify"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Playlist {
  id: string
  name: string
  images?: Array<{ url: string }>
  owner?: { display_name: string }
}

type ViewMode = "compact" | "list" | "grid"

export function Sidebar({ className }: SidebarProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(true)

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const data = await getUserPlaylists()
        if (data && data.items) {
          setPlaylists(data.items)
        }
      } catch (err) {
        console.error("Failed to fetch playlists:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [])

  // Filter playlists based on search query
  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderPlaylists = () => {
    if (loading) {
      return <p className="text-sm text-muted-foreground px-2 py-1">Loading playlists...</p>
    }

    if (filteredPlaylists.length === 0) {
      return <p className="text-sm text-muted-foreground px-2 py-1">No playlists found</p>
    }

    switch (viewMode) {
      case "compact":
        return (
          <div className="space-y-1">
            {filteredPlaylists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                size="sm"
                className="w-full justify-start font-normal px-2 h-7 text-xs"
                asChild
              >
                <Link href={`/playlists/${playlist.id}`}>
                  <ListMusic className="mr-2 h-3 w-3 text-muted-foreground" />
                  <span className="truncate">{playlist.name}</span>
                </Link>
              </Button>
            ))}
          </div>
        )

      case "list":
        return (
          <div className="space-y-1">
            {filteredPlaylists.map((playlist) => (
              <Button key={playlist.id} variant="ghost" size="sm" className="w-full justify-start font-normal" asChild>
                <Link href={`/playlists/${playlist.id}`}>
                  <ListMusic className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{playlist.name}</span>
                </Link>
              </Button>
            ))}
          </div>
        )

      case "grid":
        return (
          <div className="grid grid-cols-2 gap-2 p-1">
            {filteredPlaylists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/playlists/${playlist.id}`}
                className="flex flex-col items-center p-2 rounded-md hover:bg-muted transition-colors"
              >
                <div className="w-full aspect-square mb-1 bg-muted rounded-md overflow-hidden">
                  <img
                    src={playlist.images?.[0]?.url || "/placeholder.svg?height=60&width=60"}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs truncate w-full text-center">{playlist.name}</span>
              </Link>
            ))}
          </div>
        )
    }
  }

  return (
    <div className={cn("flex h-full w-60 flex-col border-r bg-card", className)}>
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold gradient-text"></h1>
        </Link>
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
            <Link href="/liked-songs">
              <Heart className="h-4 w-4 text-rose" />
              Liked Songs
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
            <Link href="/recommendations">
              <Sparkles className="h-4 w-4 text-amber" />
              Recommendations
            </Link>
          </Button>
        </div>
        <Separator className="my-4" />
      </div>

      <div className="px-4 flex items-center justify-between">
        <div
          className="flex items-center gap-2 text-sm font-medium cursor-pointer"
          onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
        >
          <Library className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Your Library</span>
          {isLibraryExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                {viewMode === "compact" && <AlignJustify className="h-4 w-4" />}
                {viewMode === "list" && <List className="h-4 w-4" />}
                {viewMode === "grid" && <Grid className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setViewMode("compact")}>
                <AlignJustify className="mr-2 h-4 w-4" />
                <span>Compact View</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("list")}>
                <List className="mr-2 h-4 w-4" />
                <span>List View</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("grid")}>
                <Grid className="mr-2 h-4 w-4" />
                <span>Grid View</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/playlists" className="cursor-pointer">
                  <ListMusic className="mr-2 h-4 w-4" />
                  <span>All Playlists</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLibraryExpanded && (
        <>
          <div className="px-4 py-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search playlists..."
                className="h-8 pl-8 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-4 py-2">{renderPlaylists()}</ScrollArea>
        </>
      )}
    </div>
  )
}

