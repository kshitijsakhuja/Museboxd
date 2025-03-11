"use client"

import { useEffect, useState } from "react"
import { getUserPlaylists } from "@/lib/spotify"
import { TopBar } from "@/components/top-bar"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Playlist {
  id: string
  name: string
  images: Array<{ url: string }>
  tracks: {
    total: number
  }
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const data = await getUserPlaylists()
        if (data && data.items) {
          setPlaylists(data.items)
        }
      } catch (error) {
        console.error("Failed to fetch playlists:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlaylists()
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">
            <h1 className="mb-6 text-2xl font-bold md:text-3xl">Your Playlists</h1>
            {loading ? (
              <p>Loading playlists...</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {playlists.map((playlist) => (
                  <Card key={playlist.id}>
                    <CardHeader>
                      <CardTitle>{playlist.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-square overflow-hidden rounded-md">
                        <img
                          src={playlist.images[0]?.url || "/placeholder.svg?height=150&width=150"}
                          alt={playlist.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{playlist.tracks.total} tracks</p>
                      <Button asChild className="mt-4 w-full">
                        <Link href={`/playlists/${playlist.id}`}>View Playlist</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

