"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
{/*import { getRecommendations } from "@/lib/spotify"*/}
import { Loader2, PlayCircle } from "lucide-react"

interface Track {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string }>
  }
}

export function RecommendedTracks() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const data = await getRecommendations()
        if (data && data.tracks) {
          setTracks(data.tracks)
        }
      } catch (err) {
        setError("Failed to load recommended tracks")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  // Fallback data if API call fails or during development
  const fallbackData = [
    {
      id: "1",
      name: "Blinding Lights",
      artists: [{ name: "The Weeknd" }],
      album: {
        name: "After Hours",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
    },
    {
      id: "2",
      name: "Don't Start Now",
      artists: [{ name: "Dua Lipa" }],
      album: {
        name: "Future Nostalgia",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
    },
    {
      id: "3",
      name: "Watermelon Sugar",
      artists: [{ name: "Harry Styles" }],
      album: {
        name: "Fine Line",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
    },
    {
      id: "4",
      name: "Levitating",
      artists: [{ name: "Dua Lipa" }],
      album: {
        name: "Future Nostalgia",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
    },
    {
      id: "5",
      name: "Save Your Tears",
      artists: [{ name: "The Weeknd" }],
      album: {
        name: "After Hours",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
    },
    {
      id: "6",
      name: "Mood",
      artists: [{ name: "24kGoldn" }],
      album: {
        name: "El Dorado",
        images: [{ url: "/placeholder.svg?height=150&width=150" }],
      },
    },
  ]

  const displayData = tracks.length > 0 ? tracks : fallbackData

  const openSpotifyTrack = (trackId: string) => {
    window.open(`https://open.spotify.com/track/${trackId}`, "_blank", "noopener,noreferrer")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended For You</CardTitle>
        <CardDescription>Based on your listening history</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="text-muted-foreground text-center py-4">{error}</p>
        ) : (
          <ScrollArea>
            <div className="flex gap-4 pb-4">
              {displayData.map((track) => (
                <div
                  key={track.id}
                  className="w-[150px] space-y-2 cursor-pointer group"
                  onClick={() => openSpotifyTrack(track.id)}
                >
                  <div className="relative overflow-hidden rounded-md">
                    <img
                      src={track.album.images[0]?.url || "/placeholder.svg?height=150&width=150"}
                      alt={`${track.name} by ${track.artists[0]?.name}`}
                      className="aspect-square h-auto w-full object-cover transition-all hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <PlayCircle className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium leading-none line-clamp-1">{track.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {track.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

