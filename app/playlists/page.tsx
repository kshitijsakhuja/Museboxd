"use client"

import { useEffect, useState } from "react"
import { getUserPlaylists } from "@/lib/spotify"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Grid, List, LayoutGrid, Plus, Music, MoreHorizontal, Play, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AnimatedBackground } from "@/components/animated-background"

interface Playlist {
  id: string
  name: string
  images: Array<{ url: string }>
  tracks: {
    total: number
  }
  owner: {
    display_name: string
  }
  public?: boolean
  description?: string
}

type ViewMode = "grid" | "list" | "compact"

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const data = await getUserPlaylists()
        if (data && data.items) {
          setPlaylists(data.items)
        }
      } catch (error) {
        console.error("Failed to fetch playlists:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <AnimatedBackground>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <TopBar />
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:block">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 md:p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold md:text-3xl gradient-text">Your Library</h1>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={viewMode === "grid" ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={viewMode === "list" ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={viewMode === "compact" ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => setViewMode("compact")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="sm" className="ml-2">
                    <Plus className="h-4 w-4 mr-1" />
                    New Playlist
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="created">Created</TabsTrigger>
                  <TabsTrigger value="followed">Followed</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  {loading ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden animate-pulse">
                          <div className="aspect-square bg-muted"></div>
                          <CardContent className="p-4">
                            <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <>
                      {viewMode === "grid" && (
                        <motion.div
                          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                          variants={container}
                          initial="hidden"
                          animate="show"
                        >
                          {playlists.map((playlist) => (
                            <motion.div key={playlist.id} variants={item}>
                              <Card className="overflow-hidden border-0 shadow-md transition-all hover:shadow-lg group">
                                <div className="aspect-square overflow-hidden relative">
                                  <img
                                    src={playlist.images[0]?.url || "/placeholder.svg?height=150&width=150"}
                                    alt={playlist.name}
                                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                      size="icon"
                                      className="rounded-full bg-spotify hover:bg-spotify-light"
                                      onClick={() => window.open(`https://open.spotify.com/playlist/${playlist.id}`, "_blank")}
                                    >
                                      <Play className="h-6 w-6 text-white" />
                                    </Button>
                                  </div>
                                  {playlist.public === false && (
                                    <Badge className="absolute top-2 right-2 bg-background/80">Private</Badge>
                                  )}
                                </div>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="font-medium line-clamp-1">{playlist.name}</h3>
                                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                        By {playlist.owner.display_name} • {playlist.tracks.total} tracks
                                      </p>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                          <Link href={`/playlists/${playlist.id}`}>View Details</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() => window.open(`https://open.spotify.com/playlist/${playlist.id}`, "_blank")}
                                        >
                                          Open in Spotify
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {viewMode === "list" && (
                        <motion.div className="space-y-2" variants={container} initial="hidden" animate="show">
                          {playlists.map((playlist) => (
                            <motion.div key={playlist.id} variants={item}>
                              <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
                                <CardContent className="p-0">
                                  <Link href={`/playlists/${playlist.id}`} className="flex items-center p-3 gap-3">
                                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                                      <img
                                        src={playlist.images[0]?.url || "/placeholder.svg?height=48&width=48"}
                                        alt={playlist.name}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium line-clamp-1">{playlist.name}</h3>
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <User className="h-3 w-3" /> {playlist.owner.display_name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Music className="h-3 w-3" /> {playlist.tracks.total} tracks
                                        </span>
                                        {playlist.public === false && (
                                          <Badge variant="outline" className="text-xs py-0 h-4">
                                            Private
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 rounded-full"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        window.open(`https://open.spotify.com/playlist/${playlist.id}`, "_blank")
                                      }}
                                    >
                                      <Play className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {viewMode === "compact" && (
                        <motion.div
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"
                          variants={container}
                          initial="hidden"
                          animate="show"
                        >
                          {playlists.map((playlist) => (
                            <motion.div key={playlist.id} variants={item}>
                              <Link href={`/playlists/${playlist.id}`}>
                                <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors">
                                  <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-sm">
                                    <img
                                      src={playlist.images[0]?.url || "/placeholder.svg?height=32&width=32"}
                                      alt={playlist.name}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{playlist.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {playlist.tracks.total} tracks
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </>
                  )}
                </TabsContent>

                <TabsContent value="created" className="mt-4">
                  <div className="text-center py-8">
                    <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Created Playlists</h3>
                    <p className="text-muted-foreground mb-4">Filter view coming soon</p>
                  </div>
                </TabsContent>

                <TabsContent value="followed" className="mt-4">
                  <div className="text-center py-8">
                    <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Followed Playlists</h3>
                    <p className="text-muted-foreground mb-4">Filter view coming soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </AnimatedBackground>
  )
}