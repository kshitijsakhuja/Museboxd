"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { getRecentlyPlayed } from "@/lib/spotify"

interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
  played_at?: string
  external_urls: {
    spotify: string
  }
}

export function RecentlyPlayed() {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function fetchRecentlyPlayed() {
      try {
        const data = await getRecentlyPlayed()
        if (data && data.items) {
          const tracks = data.items.map((item: any) => ({
            id: item.track.id,
            name: item.track.name,
            artists: item.track.artists,
            album: item.track.album,
            played_at: item.played_at,
            external_urls: item.track.external_urls,
          }))
          setRecentlyPlayed(tracks)
        }
      } catch (err) {
        setError("Failed to load recently played tracks")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentlyPlayed()
  }, [])

  // Fallback data if API call fails or during development
  const fallbackData = [
    {
      id: "1",
      name: "After Hours",
      artists: [{ name: "The Weeknd" }],
      album: {
        name: "After Hours",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
      external_urls: { spotify: "https://open.spotify.com/track/1" }
    },
    {
      id: "2",
      name: "Future Nostalgia",
      artists: [{ name: "Dua Lipa" }],
      album: {
        name: "Future Nostalgia",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
      external_urls: { spotify: "https://open.spotify.com/track/2" }
    }
  ]

  const displayData = recentlyPlayed.length > 0 ? recentlyPlayed : fallbackData
  const visibleTracks = showAll ? displayData : displayData.slice(0, 8)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Played</CardTitle>
        <CardDescription>Pick up where you left off</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="flex gap-4 pb-4 flex-wrap">
            {visibleTracks.map((item) => (
              <div
                key={item.id}
                className="w-[150px] space-y-2 cursor-pointer"
                onClick={() => window.open(item.external_urls.spotify, "_blank")}
              >
                <div className="overflow-hidden rounded-md">
                  <img
                    src={item.album.images[0]?.url || "/placeholder.svg?height=150&width=150"}
                    alt={`${item.name} by ${item.artists[0]?.name}`}
                    className="aspect-square h-auto w-full object-cover transition-all hover:scale-105"
                  />
                </div>
                <div>
                  <h3 className="font-medium leading-none">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {item.artists.map((artist) => artist.name).join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Show More / Show Less Button */}
        {displayData.length > 8 && ( 
          <div className="text-center mt-4">
            <Button onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Less" : "View More"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
