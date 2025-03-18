"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Heart, ListMusic, Music2 } from "lucide-react"
import { getUserPlaylists } from "@/lib/spotify"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

interface Playlist {
  id: string
  name: string
}

export function Sidebar({ className }: SidebarProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const data = await getUserPlaylists()
        if (data && data.items) {
          setPlaylists(data.items)
        }
      } catch (err) {
        console.error("Failed to fetch playlists:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [])

  return (
    <div className={cn("flex h-full w-60 flex-col border-r bg-card", className)}>
      <div className="p-4">
        <Link href="/" className="flex items-center gap-2">
          {/* <Music2 className="h-6 w-6 text-primary" /> */}
          {/* <h1 className="text-xl font-bold">Museboxd</h1> */}

        </Link>
        {/*<Separator className="my-4" />*/}
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
            <Link href="/playlists">
              <PlusCircle className="h-4 w-4" />
              View Playlist
            </Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
            <Link href="/liked-songs">
              <Heart className="h-4 w-4" />
              Liked Songs
            </Link>
          </Button>
        </div>
        <Separator className="my-4" />
      </div>
      <div className="px-4 text-sm font-medium text-muted-foreground">Your Playlists</div>
      <ScrollArea className="flex-1 px-4 py-2">
        <div className="space-y-1">
          {loading ? (
            <p>Loading playlists...</p>
          ) : playlists.length > 0 ? (
            playlists.map((playlist) => (
              <Button key={playlist.id} variant="ghost" size="sm" className="w-full justify-start font-normal" asChild>
                <Link href={`/playlists/${playlist.id}`}>
                  <ListMusic className="mr-2 h-4 w-4" />
                  {playlist.name}
                </Link>
              </Button>
            ))
          ) : (
            <p>No playlists found</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

