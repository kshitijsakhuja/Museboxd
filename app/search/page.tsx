"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { searchSpotify } from "@/lib/spotify"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SearchResult {
  artists?: { items: any[]; total: number }
  albums?: { items: any[]; total: number }
  tracks?: { items: any[]; total: number }
  playlists?: { items: any[]; total: number }
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const types = searchParams.get("types") || "artist,album,track,playlist"
  const limit = 20

  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query) {
      performSearch(0)
    }
  }, [query])

  async function performSearch(offset = 0) {
    if (!query) return

    setLoading(true)
    setError(null)

    try {
      console.log(`Performing search for "${query}" with offset ${offset}`)
      const data = await searchSpotify(query, types, limit.toString(), offset.toString())
      console.log("Search results:", data)

      setResults(data)
    } catch (err) {
      console.error("Search error:", err)
      setError("Failed to perform search. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const totalLoaded =
      (results?.artists?.items.length || 0) +
      (results?.albums?.items.length || 0) +
      (results?.tracks?.items.length || 0) +
      (results?.playlists?.items.length || 0)

    performSearch(totalLoaded)
  }

  const openSpotifyLink = (type: string, id: string) => {
    const urlMap: { [key: string]: string } = {
      track: `https://open.spotify.com/track/${id}`,
      album: `https://open.spotify.com/album/${id}`,
      artist: `https://open.spotify.com/artist/${id}`,
      playlist: `https://open.spotify.com/playlist/${id}`,
    }
    window.open(urlMap[type], "_blank", "noopener,noreferrer")
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
            <h1 className="mb-6 text-2xl font-bold md:text-3xl">
              {query ? `Search Results for "${query}"` : "Search"}
            </h1>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading results...</span>
              </div>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : results ? (
              <Tabs defaultValue="all">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="artists">Artists</TabsTrigger>
                  <TabsTrigger value="albums">Albums</TabsTrigger>
                  <TabsTrigger value="tracks">Tracks</TabsTrigger>
                  <TabsTrigger value="playlists">Playlists</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  {["artists", "albums", "tracks", "playlists"].map((category) => (
                    <div key={category}>
                      {results[category as keyof SearchResult]?.items?.length > 0 ? (
                        <>
                          <h2 className="mb-4 text-xl font-semibold">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </h2>

                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                            {results[category as keyof SearchResult]?.items.slice(0, 5).map((item: any) => (
                              <Card
                                key={item.id}
                                className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                                onClick={() => openSpotifyLink(category.slice(0, -1), item.id)}
                              >
                                <CardContent className="p-4">
                                  {category !== "tracks" ? (
                                    <>
                                      <div className="mb-2 aspect-square overflow-hidden rounded-md">
                                        <img
                                          src={item.images?.[0]?.url || "/placeholder.svg?height=150&width=150"}
                                          alt={item.name}
                                          className="h-full w-full object-cover transition-transform hover:scale-105"
                                        />
                                      </div>
                                      <h3 className="font-medium line-clamp-1">{item.name}</h3>
                                      <p className="text-xs text-muted-foreground line-clamp-1">
                                        {category === "playlists"
                                          ? `By ${item.owner.display_name}`
                                          : item.artists?.map((a: any) => a.name).join(", ")}
                                      </p>
                                    </>
                                  ) : (
                                    <div className="flex items-center gap-4">
                                      <img
                                        src={item.album.images?.[0]?.url || "/placeholder.svg?height=48&width=48"}
                                        alt={item.name}
                                        className="h-12 w-12 object-cover rounded-md"
                                      />
                                      <div className="flex-1">
                                        <h3 className="font-medium line-clamp-1">{item.name}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                          {item.artists.map((a: any) => a.name).join(", ")}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          {results[category as keyof SearchResult]?.items.length > 5 && (
                            <Button
                              variant="link"
                              className="mt-2"
                              onClick={() =>
                                document
                                  .querySelector(`[data-value="${category}"]`)
                                  ?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
                              }
                            >
                              See all {category}
                            </Button>
                          )}
                        </>
                      ) : null}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="artists" className="space-y-6">
                  {results?.artists?.items?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {results.artists.items.map((artist: any) => (
                        <Card
                          key={artist.id}
                          className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                          onClick={() => openSpotifyLink("artist", artist.id)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="mb-2 aspect-square overflow-hidden rounded-full mx-auto">
                              <img
                                src={artist.images?.[0]?.url || "/placeholder.svg?height=96&width=96"}
                                alt={artist.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
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
                  ) : (
                    <p>No artists found</p>
                  )}
                </TabsContent>

                <TabsContent value="albums" className="space-y-6">
                  {results?.albums?.items?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {results.albums.items.map((album: any) => (
                        <Card
                          key={album.id}
                          className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                          onClick={() => openSpotifyLink("album", album.id)}
                        >
                          <CardContent className="p-4">
                            <div className="mb-2 aspect-square overflow-hidden rounded-md">
                              <img
                                src={album.images?.[0]?.url || "/placeholder.svg?height=150&width=150"}
                                alt={album.name}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                              />
                            </div>
                            <h3 className="font-medium line-clamp-1">{album.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {album.artists.map((a: any) => a.name).join(", ")}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {album.release_date?.slice(0, 4) || ""}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p>No albums found</p>
                  )}
                </TabsContent>

                <TabsContent value="tracks" className="space-y-6">
                  {results?.tracks?.items?.length > 0 ? (
                    <div className="space-y-2">
                      {results.tracks.items.map((track: any) => (
                        <Card
                          key={track.id}
                          className="cursor-pointer transition-all hover:bg-muted group"
                          onClick={() => openSpotifyLink("track", track.id)}
                        >
                          <CardContent className="flex items-center gap-4 p-4">
                            <div className="relative h-12 w-12 overflow-hidden rounded-md flex-shrink-0">
                              <img
                                src={track.album.images?.[0]?.url || "/placeholder.svg?height=48&width=48"}
                                alt={track.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium line-clamp-1">{track.name}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {track.artists.map((a: any) => a.name).join(", ")}
                              </p>
                            </div>
                            <div className="text-xs text-muted-foreground hidden md:block line-clamp-1 max-w-[30%]">
                              {track.album.name}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p>No tracks found</p>
                  )}
                </TabsContent>

                <TabsContent value="playlists" className="space-y-6">
                  {results?.playlists?.items?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {results.playlists.items.map((playlist: any) => (
                        <Card
                          key={playlist.id}
                          className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                          onClick={() => openSpotifyLink("playlist", playlist.id)}
                        >
                          <CardContent className="p-4">
                            <div className="mb-2 aspect-square overflow-hidden rounded-md">
                              <img
                                src={playlist.images?.[0]?.url || "/placeholder.svg?height=150&width=150"}
                                alt={playlist.name}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                              />
                            </div>
                            <h3 className="font-medium line-clamp-1">{playlist.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              By {playlist.owner.display_name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {playlist.tracks?.total ? `${playlist.tracks.total} tracks` : ""}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p>No playlists found</p>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <p>Enter a search term to find music</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

