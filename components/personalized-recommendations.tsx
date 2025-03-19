"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getPersonalizedRecommendations } from "@/lib/spotify"
import { Loader2, PlayCircle, PauseCircle, Brain, Sparkles, Music } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Track {
  id: string
  name: string
  artist: string
  albumArt: string
  reason: string
  confidence: number
  previewUrl?: string
}

export function PersonalizedRecommendations() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showReason, setShowReason] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const data = await getPersonalizedRecommendations()
        if (data && data.recommendations) {
          setTracks(data.recommendations)
        }
      } catch (err) {
        setError("Failed to load personalized recommendations")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()

    // Cleanup audio on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Handle audio playback
  const togglePlay = (track: Track) => {
    if (!track.previewUrl) {
      // If no preview URL, open in Spotify
      window.open(`https://open.spotify.com/track/${track.id}`, "_blank", "noopener,noreferrer")
      return
    }

    if (currentlyPlaying === track.id) {
      // Pause current track
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setCurrentlyPlaying(null)
    } else {
      // Play new track
      if (audioRef.current) {
        audioRef.current.pause()
      }

      audioRef.current = new Audio(track.previewUrl)
      audioRef.current.play()
      audioRef.current.onended = () => setCurrentlyPlaying(null)
      setCurrentlyPlaying(track.id)
    }
  }

  // Fallback data if API call fails or during development
  const fallbackData = [
    {
      id: "1",
      name: "Bohemian Rhapsody",
      artist: "Queen",
      albumArt: "/placeholder.svg?height=150&width=150",
      reason: "Based on your interest in classic rock and theatrical music",
      confidence: 9,
    },
    {
      id: "2",
      name: "Redbone",
      artist: "Childish Gambino",
      albumArt: "/placeholder.svg?height=150&width=150",
      reason: "Matches your preference for soulful vocals and R&B influences",
      confidence: 8,
    },
    {
      id: "3",
      name: "Midnight City",
      artist: "M83",
      albumArt: "/placeholder.svg?height=150&width=150",
      reason: "Similar electronic elements to your recently played tracks",
      confidence: 7,
    },
    {
      id: "4",
      name: "Dreams",
      artist: "Fleetwood Mac",
      albumArt: "/placeholder.svg?height=150&width=150",
      reason: "Complements your taste in melodic pop-rock",
      confidence: 9,
    },
  ]

  const displayData = tracks.length > 0 ? tracks : fallbackData

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 9) return "bg-green-500 hover:bg-green-600 text-white"
    if (confidence >= 7) return "bg-blue-500 hover:bg-blue-600 text-white"
    if (confidence >= 5) return "bg-amber-500 hover:bg-amber-600 text-white"
    return "bg-rose-500 hover:bg-rose-600 text-white"
  }

  return (
    <Card className="overflow-hidden border-0 shadow-md h-full bg-gradient-to-br from-background to-muted">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>Personalized For You</CardTitle>
        </div>
        <CardDescription>Recommendations based on your listening history and diary entries</CardDescription>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
              <TooltipProvider>
                {displayData.map((track) => (
                  <motion.div
                    key={track.id}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-md h-full">
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={track.albumArt || "/placeholder.svg?height=150&width=150"}
                          alt={`${track.name} by ${track.artist}`}
                          className="h-full w-full object-cover transition-all"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="icon"
                            className="rounded-full bg-spotify hover:bg-spotify-light"
                            onClick={() => togglePlay(track)}
                          >
                            {currentlyPlaying === track.id ? (
                              <PauseCircle className="h-6 w-6 text-white" />
                            ) : (
                              <PlayCircle className="h-6 w-6 text-white" />
                            )}
                          </Button>
                        </div>
                        <Badge className={cn("absolute top-2 right-2 px-2 py-1", getConfidenceColor(track.confidence))}>
                          {track.confidence}/10
                        </Badge>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium leading-none line-clamp-1">{track.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{track.artist}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() => setShowReason(showReason === track.id ? null : track.id)}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            <span className="text-xs">Why?</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
                            onClick={() =>
                              window.open(`https://open.spotify.com/track/${track.id}`, "_blank", "noopener,noreferrer")
                            }
                          >
                            <Music className="h-3 w-3 mr-1" />
                            <span className="text-xs">Open</span>
                          </Button>
                        </div>
                        <AnimatePresence>
                          {showReason === track.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <p className="text-xs mt-2 text-muted-foreground">{track.reason}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </Card>
                  </motion.div>
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

