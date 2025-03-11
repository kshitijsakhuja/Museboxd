"use client"

import { useEffect, useState } from "react"
import { getUserLikedTracks } from "@/lib/spotify"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Loader2, PlayCircle, Heart, Clock } from "lucide-react"

interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  duration_ms: number
}

export default function LikedSongsPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const limit = 20

  useEffect(() => {
    fetchLikedSongs()
  }, [])

  async function fetchLikedSongs(offset = 0) {
    try {
      const isInitialLoad = offset === 0

      if (isInitialLoad) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      setError(null)

      const data = await getUserLikedTracks(limit, offset)

      if (data && data.items) {
        const newTracks = data.items.map((item: any) => item.track)

        if (isInitialLoad) {
          setTracks(newTracks)
        } else {
          setTracks((prev) => [...prev, ...newTracks])
        }

        setHasMore(data.items.length === limit && data.next !== null)
        setPage(Math.floor(offset / limit))
      }
    } catch (err) {
      console.error("Failed to fetch liked songs:", err)
      setError("Failed to load your liked songs. Please try again.")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (loadingMore) return
    const nextOffset = (page + 1) * limit
    fetchLikedSongs(nextOffset)
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(0)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  }

  const openSpotifyTrack = (trackId: string) => {
    window.open(`https://open.spotify.com/track/${trackId}`, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex items-center mb-6">
              <Heart className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold md:text-3xl">Liked Songs</h1>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading liked songs...</span>
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4 text-red-500 dark:bg-red-950/30">
                <p>{error}</p>
                <Button variant="link" className="mt-2 p-0" onClick={() => fetchLikedSongs()}>
                  Try again
                </Button>
              </div>
            ) : tracks.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    Your Liked Tracks
                    <span className="ml-2 text-sm font-normal text-muted-foreground">{tracks.length} songs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead className="hidden md:table-cell">Album</TableHead>
                          <TableHead className="hidden md:table-cell w-24 text-right">
                            <Clock className="ml-auto h-4 w-4" />
                            <span className="sr-only">Duration</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tracks.map((track, index) => (
                          <TableRow
                            key={track.id}
                            className="group cursor-pointer hover:bg-muted"
                            onClick={() => openSpotifyTrack(track.id)}
                          >
                            <TableCell className="font-medium w-12">
                              <div className="flex items-center justify-center w-8">
                                <span className="group-hover:hidden">{index + 1}</span>
                                <PlayCircle className="hidden h-5 w-5 text-primary group-hover:block" />
                              </div>
                            </TableCell>
                            <TableCell className="flex items-center gap-3">
                              <img
                                src={track.album.images[0]?.url || "/placeholder.svg?height=40&width=40"}
                                alt={track.album.name}
                                className="h-10 w-10 rounded-sm flex-shrink-0"
                              />
                              <div className="flex flex-col min-w-0">
                                <span className="font-medium truncate">{track.name}</span>
                                <span className="text-xs text-muted-foreground truncate">
                                  {track.artists.map((a) => a.name).join(", ")}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell truncate max-w-[200px]">
                              {track.album.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-right">
                              {formatDuration(track.duration_ms)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {hasMore && (
                    <div className="mt-6 flex justify-center">
                      <Button onClick={loadMore} disabled={loadingMore} className="min-w-[150px]">
                        {loadingMore ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          "Show More"
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="rounded-lg bg-muted p-8 text-center">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No liked songs yet</h3>
                <p className="text-muted-foreground mb-4">Your liked songs will appear here.</p>
                <Button onClick={() => (window.location.href = "/search")}>Discover Music</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

