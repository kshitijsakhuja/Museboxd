"use client"

import { useState } from "react"
import { Heart, ListMusic, Maximize2, Mic2, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from "lucide-react"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const duration = 214 // Duration in seconds (3:34)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex h-20 items-center justify-between border-t bg-card px-4 py-2">
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 overflow-hidden rounded-md">
          <img src="/placeholder.svg?height=56&width=56" alt="Album cover" className="h-full w-full object-cover" />
        </div>
        <div>
          <h4 className="text-sm font-medium">Blinding Lights</h4>
          <p className="text-xs text-muted-foreground">The Weeknd</p>
        </div>
        <Button variant="ghost" size="icon" className="ml-2">
          <Heart className="h-4 w-4" />
          <span className="sr-only">Like</span>
        </Button>
      </div>

      <div className="flex max-w-md flex-1 flex-col items-center gap-1 px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Shuffle className="h-4 w-4" />
            <span className="sr-only">Shuffle</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <SkipBack className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <SkipForward className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Repeat className="h-4 w-4" />
            <span className="sr-only">Repeat</span>
          </Button>
        </div>
        <div className="flex w-full items-center gap-2">
          <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={(value) => setCurrentTime(value[0])}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Mic2 className="h-4 w-4" />
          <span className="sr-only">Lyrics</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ListMusic className="h-4 w-4" />
          <span className="sr-only">Queue</span>
        </Button>
        <div className="flex w-28 items-center gap-2">
          <Volume2 className="h-4 w-4" />
          <Slider defaultValue={[70]} max={100} step={1} className="flex-1" />
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Maximize2 className="h-4 w-4" />
          <span className="sr-only">Full screen</span>
        </Button>
      </div>
    </div>
  )
}

