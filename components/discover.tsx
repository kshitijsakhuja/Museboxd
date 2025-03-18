"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { getNewReleases } from "@/lib/spotify"

interface Album {
  id: string
  name: string
  artists: Array<{ name: string }>
  images: Array<{ url: string }>
  album_type: string
  external_urls: {
    spotify: string
  }
}

export function Discover() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function fetchNewReleases() {
      try {
        const data = await getNewReleases()
        if (data && data.albums && data.albums.items) {
          setAlbums(data.albums.items.slice(0, 50)) // Fetch up to 50 items
        }
      } catch (err) {
        setError("Failed to load new releases")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchNewReleases()
  }, [])

  // Fallback data if API call fails or during development
  const fallbackData = [
    {
      id: "1",
      name: "Currents",
      artists: [{ name: "Tame Impala" }],
      images: [{ url: "/placeholder.svg?height=150&width=150" }],
      album_type: "Psychedelic Pop",
      external_urls: { spotify: "https://open.spotify.com/album/1" }
    },
    {
      id: "2",
      name: "Blonde",
      artists: [{ name: "Frank Ocean" }],
      images: [{ url: "/placeholder.svg?height=150&width=150" }],
      album_type: "R&B",
      external_urls: { spotify: "https://open.spotify.com/album/2" }
    }
  ]

  const displayData = albums.length > 0 ? albums : fallbackData
  const visibleAlbums = showAll ? displayData : displayData.slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discover</CardTitle>
        <CardDescription>Based on new releases</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="flex gap-4 pb-4 flex-wrap">
            {visibleAlbums.map((item) => (
              <div
                key={item.id}
                className="w-[150px] space-y-2 cursor-pointer"
                onClick={() => window.open(item.external_urls.spotify, "_blank")}
              >
                <div className="overflow-hidden rounded-md">
                  <img
                    src={item.images[0]?.url || "/placeholder.svg?height=150&width=150"}
                    alt={`${item.name} by ${item.artists[0]?.name}`}
                    className="aspect-square h-auto w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="font-medium leading-none">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.artists.map((artist) => artist.name).join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.album_type}</p>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Show Less" : "View More Recommendations"}
        </Button>
      </CardContent>
    </Card>
  )
}
