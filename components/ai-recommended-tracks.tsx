"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getAIRecommendations } from "@/lib/spotify"
import { Loader2, PlayCircle, Sparkles } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Track {
  id: string
  name: string
  artist: string
  albumArt: string
  reason: string
}

export function AIRecommendedTracks() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const data = await getAIRecommendations()
        if (data && data.recommendations) {
          // Ensure the recommendations include the correct album art URLs
          setTracks(data.recommendations.map(track => ({
            ...track,
            albumArt: track.albumArt || "/placeholder.svg?height=150&width=150", // Fallback if necessary
          })))
        }
      } catch (err) {
        setError("Failed to load AI recommendations")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  // Updated fallback data with specific album art URLs
  const fallbackData = [
    {
      id: "1",
      name: "Bohemian Rhapsody",
      artist: "Queen",
      albumArt: "https://m.media-amazon.com/images/M/MV5BMTA2NDc3Njg5NDVeQTJeQWpwZ15BbWU4MDc1NDcxNTUz._V1_FMjpg_UX1000_.jpg", // Updated album art URL
      reason: "Based on your interest in classic rock and theatrical music",
    },
    {
      id: "2",
      name: "Redbone",
      artist: "Childish Gambino",
      albumArt: "https://i1.sndcdn.com/artworks-000494218389-imek4t-t1080x1080.jpg", // Updated album art URL
      reason: "Matches your preference for soulful vocals and R&B influences",
    },
    {
      id: "3",
      name: "Midnight City",
      artist: "M83",
      albumArt: "https://i.scdn.co/image/ab67616d0000b27307e66d3237a8d19f51a7ac08", // Updated album art URL
      reason: "Similar electronic elements to your recently played tracks",
    },
    {
      id: "4",
      name: "Dreams",
      artist: "Fleetwood Mac",
      albumArt: "https://upload.wikimedia.org/wikipedia/en/b/b9/Fleetwood_Mac_-_Dreams.png", // Updated album art URL
      reason: "Complements your taste in melodic pop-rock",
    },
    {
      id: "5",
      name: "Alright",
      artist: "Kendrick Lamar",
      albumArt: "https://cdn-images.dzcdn.net/images/cover/5c163a572dc76597231aa942375dec89/0x1900-000000-80-0-0.jpg", // Updated album art URL
      reason: "Matches your interest in lyrical hip-hop",
    },
    {
      id: "6",
      name: "Weird Fishes/Arpeggi",
      artist: "Radiohead",
      albumArt: "https://i.scdn.co/image/ab67616d0000b27334733f87148c2fbe0176abdb", // Updated album art URL
      reason: "Aligns with your preference for atmospheric alternative music",
    },
  ]

  const displayData = tracks.length > 0 ? tracks : fallbackData

  const openSpotifyTrack = (trackId: string) => {
    if (trackId.startsWith("ai-rec-")) return // Skip if it's a placeholder
    window.open(`https://open.spotify.com/track/${trackId}`, "_blank", "noopener,noreferrer")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber" />
          <CardTitle>AI-Powered Recommendations</CardTitle>
        </div>
        <CardDescription>Personalized suggestions based on your listening patterns</CardDescription>
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
              <TooltipProvider>
                {displayData.map((track) => (
                  <Tooltip key={track.id}>
                    <TooltipTrigger asChild>
                      <div
                        className="w-[150px] space-y-2 cursor-pointer group"
                        onClick={() => openSpotifyTrack(track.id)}
                      >
                        <div className="relative overflow-hidden rounded-md">
                          <img
                            src={track.albumArt || "/placeholder.svg?height=150&width=150"}
                            alt={`${track.name} by ${track.artist}`}
                            className="aspect-square h-auto w-full object-cover transition-all hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                            <PlayCircle className="h-12 w-12 text-spotify" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium leading-none line-clamp-1">{track.name}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{track.artist}</p>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[200px] p-3">
                      <p className="text-sm">{track.reason}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}