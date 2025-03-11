"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { getGenreArtists } from "@/lib/spotify"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2, Disc, ExternalLink } from "lucide-react"

export default function GenrePage() {
  const { name } = useParams()
  const genreName = Array.isArray(name) ? name[0] : name

  const [artists, setArtists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const limit = 20

  useEffect(() => {
    fetchGenreArtists()
  }, [])

  async function fetchGenreArtists(offset = 0) {
    if (offset === 0) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    setError(null)

    try {
      const data = await getGenreArtists(genreName, limit, offset)

      if (offset === 0) {
        setArtists(data?.artists?.items || [])
      } else {
        setArtists((prev) => [...prev, ...(data?.artists?.items || [])])
      }

      setHasMore((data?.artists?.items?.length || 0) === limit)
      setPage(Math.floor(offset / limit) + 1)
    } catch (err) {
      console.error("Error fetching genre artists:", err)
      setError("Failed to fetch artists for this genre")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (!loadingMore) {
      fetchGenreArtists(page * limit)
    }
  }

  const openSpotifyArtist = (artistId: string) => {
    window.open(`https://open.spotify.com/artist/${artistId}`, "_blank")
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <TopBar />
          <div className="container mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold md:text-3xl capitalize">{genreName.replaceAll("-", " ")} Artists</h1>
              <Button size="sm" variant="outline" onClick={() => window.history.back()}>
                Back
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading artists...</span>
              </div>
            ) : error ? (
              <div className="rounded-lg bg-red-50 p-4 text-red-500 dark:bg-red-950/30">
                <p>{error}</p>
                <Button variant="link" className="mt-2 p-0" onClick={() => fetchGenreArtists()}>
                  Try again
                </Button>
              </div>
            ) : artists.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {artists.map((artist) => (
                    <Card
                      key={artist.id}
                      className="overflow-hidden cursor-pointer transition-all hover:shadow-md group"
                      onClick={() => openSpotifyArtist(artist.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <Avatar className="mx-auto mb-2 h-24 w-24 bg-muted relative">
                          <AvatarImage
                            src={artist.images?.[0]?.url || "/placeholder.svg?height=96&width=96"}
                            alt={artist.name}
                          />
                          <AvatarFallback>
                            <Disc className="h-8 w-8 text-muted-foreground" />
                          </AvatarFallback>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity rounded-full group-hover:opacity-100">
                            <ExternalLink className="h-6 w-6 text-white" />
                          </div>
                        </Avatar>
                        <h3 className="font-medium line-clamp-1">{artist.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {artist.followers?.total
                            ? `${Number(artist.followers.total).toLocaleString()} followers`
                            : "Artist"}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
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
              </div>
            ) : (
              <div className="rounded-lg bg-muted p-8 text-center">
                <Disc className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No artists found</h3>
                <p className="text-muted-foreground mb-4">We couldn't find any artists for this genre.</p>
                <Button onClick={() => window.history.back()}>Go Back</Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

