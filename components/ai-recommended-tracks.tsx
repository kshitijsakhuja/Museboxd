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
          setTracks(data.recommendations)
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

  // Fallback data if API call fails or during development
  const fallbackData = [
    {
      id: "1",
      name: "Bohemian Rhapsody",
      artist: "Queen",
      albumArt: "/placeholder.svg?height=150&width=150",
      reason: "Based on your interest in classic rock and theatrical music",
    },
    {
      id: "2",
      name: "Redbone",
      artist: "Childish Gambino",
      albumArt: "/placeholder.svg?height=150&width=150",
      reason: "Matches your preference for soulful vocals and R&B influences",
    },
    {
      id: "3",
      name: "Midnight City",
      artist: "M83",
      albumArt: "/placeholder.svg?height=150&width=150",
      reason: "Similar electronic elements to your recently played tracks",
    },
    {
      id: "4",
      name: "Dreams",
      artist: "Fleetwood Mac",
      albumArt: "/placeholder.svg?height=150&width=150",
      reason: "Complements your taste in melodic pop-rock",
    },
    {
      id: "5",
      name: "Alright",
      artist: "Kendrick Lamar",
      albumArt: "/placeholder.svg?height=150&width=150",
      reason: "Matches your interest in lyrical hip-hop",
    },
    {
      id: "6",
      name: "Weird Fishes/Arpeggi",
      artist: "Radiohead",
      albumArt: "/placeholder.svg?height=150&width=150",
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

