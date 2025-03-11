"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
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
}

export function RecentlyPlayed() {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    },
    {
      id: "2",
      name: "Future Nostalgia",
      artists: [{ name: "Dua Lipa" }],
      album: {
        name: "Future Nostalgia",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
    },
    {
      id: "3",
      name: "Chromatica",
      artists: [{ name: "Lady Gaga" }],
      album: {
        name: "Chromatica",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
    },
    {
      id: "4",
      name: "Fine Line",
      artists: [{ name: "Harry Styles" }],
      album: {
        name: "Fine Line",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
    },
    {
      id: "5",
      name: "Folklore",
      artists: [{ name: "Taylor Swift" }],
      album: {
        name: "Folklore",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
    },
    {
      id: "6",
      name: "DAMN.",
      artists: [{ name: "Kendrick Lamar" }],
      album: {
        name: "DAMN.",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
    },
  ]

  const displayData = recentlyPlayed.length > 0 ? recentlyPlayed : fallbackData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Played</CardTitle>
        <CardDescription>Pick up where you left off</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="flex gap-4 pb-4">
            {displayData.map((item) => (
              <div key={item.id} className="w-[150px] space-y-2">
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
      </CardContent>
    </Card>
  )
}

